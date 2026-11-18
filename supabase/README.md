# Supabase setup

1. For a fresh project, open the project's SQL Editor and run `schema.sql`. For an existing project, run `migrations/20261106000000_add_ebook_payment_status.sql` in the SQL Editor. This migration adds the payment columns, permits address-less ebook orders, protects payment fields and order contents from client changes, makes the ebook bucket private, and refreshes its storage policy. Existing orders previously marked paid are reset to unverified because their status was not independently protected; review legitimate historical purchases manually before restoring access.
2. Run `migrations/20261111000000_replace_sample_ebooks.sql` to replace the sample catalog entries with the three finance JSON ebooks. Then run `migrations/20261113000000_add_remaining_json_ebooks.sql` to add the other eight books and their cover-image paths. Finally, run `migrations/20261113005800_hide_removed_ebooks.sql` to hide books 08–11 from the customer catalog. This keeps their database rows and storage objects intact so existing paid orders retain access. The configured `seed.sql` is intentionally empty; the migrations are the source of catalog data.
3. Create a customer account in the app. To grant it admin access, run this query with that account's email:

   ```sql
   update public.profiles
   set role = 'admin'
   where id = (select id from auth.users where email = 'admin@example.com');
   ```

The local app configuration is in `.env.local`; `.env.example` shows the required variable names. The publishable key is intended for client use. Never put a Supabase secret/service-role key in the app.

Email/password authentication is ready. To use Google sign-in, enable the Google provider in Supabase Authentication and configure its OAuth credentials. Add `https://www.dreamyyspace.com/` to **Authentication → URL Configuration → Redirect URLs** in Supabase. Local web development uses the current `localhost` origin, which must also be allowed.

## Ebooks and private downloads

The catalog points to JSON ebooks in the private Supabase Storage bucket `ebooks` under `formations/`. The last finance book is free; only its catalogued object is readable without a paid order, and authentication is still required. Paid ebooks remain available only through short-lived signed links after a verified purchase. Do not make this bucket public. Product covers use a separate public `product-images` bucket.

The schema migration marks historical orders whose payment cannot be independently trusted as `unverified`; their payment result cannot be inferred retroactively. Physical-product purchases are excluded from the ebook purchase history and no unverified order is treated as paid or failed.

Upload the JSON ebooks and matching JPG covers from `dist/assets/` to the `formations/` folder in the private `ebooks` bucket and public `product-images` bucket, respectively. Keep the filenames unchanged. Do not delete already-uploaded books 08–11: they are hidden from the catalog but may still be needed for prior purchases. The SQL migrations set catalog paths but cannot upload local files; use the Supabase Storage dashboard before publishing the catalog.

## PayDunya card and mobile-money checkout

The app calls the `paydunya-checkout` Edge Function instead of calling PayDunya from the browser. Card details are entered on the checkout page and sent to PayDunya's SoftPay card endpoint by the Edge Function; card numbers and CVVs are not stored in the database. PayDunya requires PCI-DSS certification and activation of SoftPay card payments for this integration. A bank may still require a 3-D Secure challenge, which opens PayDunya's challenge URL. Mobile-money checkout starts the selected SoftPay operator. Configured operators are T-Money and Moov Togo; Orange Money, Expresso, Wave, Free Money, and Djamo Senegal; Orange Money, MTN, Moov, Wave, and Djamo Côte d'Ivoire; Orange Money and Moov Burkina Faso; Orange Money Mali; Moov Money and Celtiis Cash Benin; and MTN Cameroon. Orange Money Senegal, Wave, and Djamo may return a hosted payment URL, which the app opens. Orange Money Côte d'Ivoire and Burkina Faso require the customer to provide the operator payment code.

The checkout collects no delivery address. It creates an `initiating` digital order, starts PayDunya, and records `pending` only after a provider invoice is created. Definitive PayDunya or SoftPay rejections are recorded as `failed`. The checkout automatically polls PayDunya while open, and the library automatically rechecks pending orders when opened or when the app returns to the foreground; the customer never has to declare that payment was made.

PayDunya also sends a server-to-server notification to the function callback URL. The function verifies the notification hash using `PAYDUNYA_MASTER_KEY`, looks up the saved invoice reference, and confirms the status directly with PayDunya before updating the order. The library then exposes the ebook only when the database records a confirmed payment.

The Supabase gateway's JWT check is disabled for this function so PayDunya can call the notification endpoint. This does not make customer actions anonymous: every app action still requires and validates a signed-in customer's access token, while the callback must pass PayDunya hash verification and a server-side invoice confirmation. The function verifies order ownership and each ebook against the server-side catalog, recalculates the total from catalog prices, and saves invoice references server-side. Database triggers prevent client-supplied payment states and order totals or contents from being changed after creation; the storage policy grants ebook access only for server-confirmed paid orders and catalog-backed ebook paths. Do not trust a client-supplied order amount or payment status.

```sh
npm install --save-dev supabase
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase functions deploy paydunya-checkout --no-verify-jwt
```

On Windows, Node.js 20 or later is required; run these commands from the repository root. Copy `<PROJECT_REF>` from **Supabase Dashboard → Project Settings → General**. The first `link` may also ask for the database password.

In the Supabase Dashboard, open **Edge Functions → Secrets** and set `PAYDUNYA_MASTER_KEY`, `PAYDUNYA_TOKEN`, `PAYDUNYA_PRIVATE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. The service-role key is used only by the Edge Function to persist provider-confirmed payments and must never be placed in the app bundle or an `EXPO_PUBLIC_` variable. Use the PayDunya credentials with those exact names from the same PayDunya application and mode. A PayDunya Public Key is not a substitute for the Master Key required by the Checkout Invoice API. Remove any PayDunya credentials from `.env.local` after moving them to Supabase. Since the old implementation exposed payment credentials in client code, rotate those credentials before adding them as Edge Function secrets.

Redeploy `paydunya-checkout` after changing the callback implementation. Its callback URL is generated from `SUPABASE_URL`; confirm the same URL is reachable from PayDunya. `supabase/config.toml` sets `verify_jwt = false` for this function because PayDunya cannot send a Supabase JWT; do not remove the function's explicit customer authentication or callback hash check.

The order table stores PayDunya orders with the generic `paydunya` method; legacy Togo values `tmoney` and `flooz` remain supported. `schema.sql` adds the digital payment state, invoice reference, private bucket and paid-buyer read policy. Run it in the SQL Editor before deploying the updated function:

```sql
alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders add constraint orders_payment_method_check
    check (payment_method in ('card', 'apple-pay', 'paypal', 'cod', 'tmoney', 'flooz', 'paydunya'));
```
