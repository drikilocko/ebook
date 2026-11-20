begin;

update public.products
set data = jsonb_set(data, '{price}', to_jsonb(9900.0 / 610), true)
where data ? 'ebookStoragePath'
  and case
      when jsonb_typeof(data -> 'price') = 'number'
      then round((data ->> 'price')::numeric * 610, 0) = 250
      else false
  end;

commit;
