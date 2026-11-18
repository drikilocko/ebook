begin;

delete from public.products
where id in (
    'formation-entreprendre',
    'formation-marketing',
    'formation-reseaux-sociaux',
    'formation-budget',
    'formation-freelance',
    'formation-productivite',
    'formation-outils-numeriques',
    'formation-ia'
);

insert into public.products (id, data)
values
    ('livre-09-liberte-financiere', jsonb_build_object(
        'name', 'De 0 F à la Liberté Totale',
        'category', 'FINANCES',
        'brand', 'Vance Sterling',
        'price', 14000.0 / 610,
        'rating', 4.9,
        'reviewsCount', 142,
        'images', jsonb_build_array('https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=85'),
        'backgroundImage', 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1600&q=85',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#6d28d9')),
        'description', 'Le guide pratique consacré au développement des revenus et à la liberté financière.',
        'preview', 'Le vrai power move n’est pas d’économiser plus : c’est de faire circuler de l’argent qui te libère.',
        'specifications', 'Livre numérique JSON • Lecture en ligne • Thème finance & libertés individuelles',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'formations/livre09_de_0f_a_la_liberte.json',
        'theme', jsonb_build_object('background', '#0f172a', 'surface', '#111827', 'accent', '#d4af37', 'title', '#fef3c7', 'text', '#e2e8f0', 'glow', 'rgba(212,175,55,0.35)'),
        'relatedBookIds', jsonb_build_array('livre-10-pourquoi-tu-es-pauvre', 'livre-11-arrete-de-travailler-dur', 'livre-02-inversion_roles', 'livre-03-art_frustration', 'livre-04-addiction_emotionnelle'),
        'userAppreciations', jsonb_build_array(
            jsonb_build_object('id', 'app-1', 'author', 'Amina', 'rating', 5, 'quote', 'J’ai compris que la vraie liberté commence quand on arrête de courir après des paiements et on construit des systèmes.', 'highlight', 'La règle de l’épargne intelligente'),
            jsonb_build_object('id', 'app-2', 'author', 'Moussa', 'rating', 5, 'quote', 'Le chapitre sur l’argent non négociable m’a fait revoir toute ma stratégie.', 'highlight', 'Le signal de rupture'),
            jsonb_build_object('id', 'app-3', 'author', 'Nadia', 'rating', 4, 'quote', 'Le plus fort : ça parle de discipline sans culpabilité. On repart avec une vraie architecture.', 'highlight', 'Le système de revenu'),
            jsonb_build_object('id', 'app-4', 'author', 'Kossi', 'rating', 5, 'quote', 'J’ai appliqué la règle sur mon budget 72h après la lecture et j’ai enfin vu la différence.', 'highlight', 'L’équilibre de la croissance'),
            jsonb_build_object('id', 'app-5', 'author', 'Sarah', 'rating', 5, 'quote', 'C’est le premier livre qui m’a donné un plan simple, lisible et sans blabla.', 'highlight', 'La libération financière')
        ),
        'comments', jsonb_build_array(
            jsonb_build_object('id', 'comment-1', 'user', 'Béatrice', 'chapter', 'Règle d’argent', 'text', 'J’ai adoré la partie sur le fait de ne plus travailler pour survivre. C’est exactement ce que j’avais besoin d’entendre.', 'rating', 5),
            jsonb_build_object('id', 'comment-2', 'user', 'Yvan', 'chapter', 'La liberté totale', 'text', 'La règle que je retiens : tes revenus doivent te rendre indépendant avant même que tu ne te sentes prêt.', 'rating', 5),
            jsonb_build_object('id', 'comment-3', 'user', 'Mireille', 'chapter', 'Budget brut', 'text', 'Le chapitre sur le budget brut m’a beaucoup fascinée car il casse la logique de perte qui nous enferme.', 'rating', 5),
            jsonb_build_object('id', 'comment-4', 'user', 'Tino', 'chapter', 'Le système', 'text', 'J’ai vu une vraie transformation dans la manière de gérer le cashflow sans dramatiser.', 'rating', 4),
            jsonb_build_object('id', 'comment-5', 'user', 'Estelle', 'chapter', 'Le signal de rupture', 'text', 'Ce passage sur la récupération du contrôle de l’argent m’a touchée parce que c’est exactement le moment où j’ai basculé.', 'rating', 5),
            jsonb_build_object('id', 'comment-6', 'user', 'Hervé', 'chapter', 'Les sources', 'text', 'Le conseil sur la diversification des revenus est super clair et immédiatement appliquable.', 'rating', 5),
            jsonb_build_object('id', 'comment-7', 'user', 'Fanta', 'chapter', 'L’honnêteté comptable', 'text', 'J’ai beaucoup aimé la règle sur la vérité financière, parce qu’on ne peut pas guérir ce qu’on refuse de mesurer.', 'rating', 5),
            jsonb_build_object('id', 'comment-8', 'user', 'Daniel', 'chapter', 'La libération', 'text', 'La partie sur l’écart entre ce que tu dépenses et ce que tu produis est une bombe.', 'rating', 5),
            jsonb_build_object('id', 'comment-9', 'user', 'Lia', 'chapter', 'Le plan de sortie', 'text', 'Le livre donne une impulsion très claire pour sortir du piège du salaire sans tomber dans le ‘je vais m’en sortir plus tard’.', 'rating', 4),
            jsonb_build_object('id', 'comment-10', 'user', 'Marlon', 'chapter', 'L’exécution', 'text', 'C’est le genre de livre qui rend le passage à l’action presque impossible à remettre à demain.', 'rating', 5)
        )
    )),
    ('livre-10-pourquoi-tu-es-pauvre', jsonb_build_object(
        'name', 'Pourquoi tu es encore pauvre',
        'category', 'FINANCES',
        'brand', 'Vance Sterling',
        'price', 12000.0 / 610,
        'rating', 4.8,
        'reviewsCount', 138,
        'images', jsonb_build_array('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=85'),
        'backgroundImage', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=85',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#7c3aed')),
        'description', 'Un livre sur les habitudes financières et les principes de gestion de l’argent.',
        'preview', 'La pauvreté n’est pas un destin : c’est souvent une suite de décisions mal répliquées, que le livre expose sans compromis.',
        'specifications', 'Livre numérique JSON • Lecture en ligne • Thème finance & habitudes',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'formations/livre10_pourquoi_tu_es_pauvre.json',
        'theme', jsonb_build_object('background', '#111827', 'surface', '#1f2937', 'accent', '#a78bfa', 'title', '#ddd6fe', 'text', '#e5e7eb', 'glow', 'rgba(167,139,250,0.35)'),
        'relatedBookIds', jsonb_build_array('livre-09-liberte-financiere', 'livre-11-arrete-de-travailler-dur', 'livre-05-psychologie_sombre', 'livre-06-arme_du_silence', 'livre-07-masterclass_chaud_froid'),
        'userAppreciations', jsonb_build_array(
            jsonb_build_object('id', 'app-1', 'author', 'Alex', 'rating', 5, 'quote', 'Ce livre m’a donné l’impression d’avoir enfin les lunettes pour comprendre mes erreurs d’argent.', 'highlight', 'Le schéma de pauvreté'),
            jsonb_build_object('id', 'app-2', 'author', 'Faiza', 'rating', 5, 'quote', 'Je n’ai pas seulement lu un livre, j’ai reconnu mes habitudes dans chaque page.', 'highlight', 'La vérité crue'),
            jsonb_build_object('id', 'app-3', 'author', 'Dorian', 'rating', 5, 'quote', 'Le chapitre sur les décisions répétées a été la clé. J’avais la mauvaise routine, pas le mauvais talent.', 'highlight', 'Le faux confort'),
            jsonb_build_object('id', 'app-4', 'author', 'Claire', 'rating', 4, 'quote', 'Le niveau de franchise est brutal, mais c’est précisément ce qui rend le livre si puissant.', 'highlight', 'La fuite de la responsabilité'),
            jsonb_build_object('id', 'app-5', 'author', 'Ludo', 'rating', 5, 'quote', 'À partir du moment où j’ai vu mon propre système, j’ai pu agir sans me sentir coupable.', 'highlight', 'Le plan de redirection')
        ),
        'comments', jsonb_build_array(
            jsonb_build_object('id', 'comment-1', 'user', 'Noë', 'chapter', 'Le faux rêve', 'text', 'Le passage sur le manque d’échelle de pensée m’a énormément touché. C’est vrai qu’on reste petit quand on ne veut pas changer de logique.', 'rating', 5),
            jsonb_build_object('id', 'comment-2', 'user', 'Sonia', 'chapter', 'Les habitudes', 'text', 'Je me reconnais dans beaucoup de situations décrites. Le livre est direct et très utile.', 'rating', 5),
            jsonb_build_object('id', 'comment-3', 'user', 'Rachid', 'chapter', 'Le système de fuite', 'text', 'J’ai adoré la règle qui dit qu’on ne sort pas de la pauvreté sans cesser d’utiliser les mêmes outils mentaux.', 'rating', 5),
            jsonb_build_object('id', 'comment-4', 'user', 'Yasmine', 'chapter', 'Le vrai coût', 'text', 'Le chapitre sur les petits sacrifices aEnchanté l’ensemble, c’est très concret et pas du blabla.', 'rating', 4),
            jsonb_build_object('id', 'comment-5', 'user', 'Ibrahim', 'chapter', 'La responsabilisation', 'text', 'Le livre force à regarder les dépenses comme des décisions, pas comme des accidents. Ça a été très fort.', 'rating', 5),
            jsonb_build_object('id', 'comment-6', 'user', 'Mélanie', 'chapter', 'La redirection', 'text', 'J’ai beaucoup aimé la manière de rendre le redressement financier presque instinctif, sans romantisme.', 'rating', 5),
            jsonb_build_object('id', 'comment-7', 'user', 'Karim', 'chapter', 'L’auto-sabotage', 'text', 'Cette partie sur le délire du “je ne suis pas prêt” m’a fait rire et réfléchir en même temps.', 'rating', 5),
            jsonb_build_object('id', 'comment-8', 'user', 'Hélène', 'chapter', 'Le plan', 'text', 'Le plus précieux, c’est qu’on peut l’appliquer sans attendre un miracle. Très utile.', 'rating', 4),
            jsonb_build_object('id', 'comment-9', 'user', 'Mickaël', 'chapter', 'La vérité', 'text', 'Le livre est on ne peut plus honnête : il prend la croissance personnelle et l’argent comme un système, pas comme un don.', 'rating', 5),
            jsonb_build_object('id', 'comment-10', 'user', 'Flore', 'chapter', 'Le déclic', 'text', 'La dernière règle m’a énormément fasciné : il ne s’agit pas de gagner plus, mais de penser plus gros.', 'rating', 5)
        )
    )),
    ('livre-11-arrete-de-travailler-dur', jsonb_build_object(
        'name', 'Arrête de travailler dur',
        'category', 'FINANCES',
        'brand', 'Vance Sterling',
        'price', 0,
        'rating', 4.9,
        'reviewsCount', 201,
        'images', jsonb_build_array('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=85'),
        'backgroundImage', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=85',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#16a34a')),
        'description', 'Le livre numérique gratuit sur les stratégies financières et la création de revenus.',
        'preview', 'Le vrai gain vient moins du travail acharné que de la manière de créer de la valeur sans dépendre du temps.',
        'specifications', 'Livre numérique JSON • Gratuit • Lecture en ligne • Thème revenus & efficacité',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'formations/livre11_arrete_de_travailler_dur.json',
        'theme', jsonb_build_object('background', '#052e16', 'surface', '#0f172a', 'accent', '#4ade80', 'title', '#dcfce7', 'text', '#d1fae5', 'glow', 'rgba(74,222,128,0.28)'),
        'relatedBookIds', jsonb_build_array('livre-09-liberte-financiere', 'livre-10-pourquoi-tu-es-pauvre', 'livre-01-choc_emotionnel', 'livre-08-exploiter_psy_feminine', 'livre-07-masterclass_chaud_froid'),
        'userAppreciations', jsonb_build_array(
            jsonb_build_object('id', 'app-1', 'author', 'Léa', 'rating', 5, 'quote', 'C’est le premier livre qui m’a donné le courage de sortir de la logique “trop de travail, trop peu de revenus”.', 'highlight', 'Le pouvoir du système'),
            jsonb_build_object('id', 'app-2', 'author', 'Jules', 'rating', 5, 'quote', 'La règle la plus forte : le travail intelligent crée de la liberté, pas le travail épuisant.', 'highlight', 'Le manque de structure'),
            jsonb_build_object('id', 'app-3', 'author', 'Nina', 'rating', 5, 'quote', 'J’ai eu le déclic sur la différence entre effort visible et valeur captée.', 'highlight', 'La déconnexion revenus/heure'),
            jsonb_build_object('id', 'app-4', 'author', 'Olivier', 'rating', 5, 'quote', 'Aucune morale, juste des principes utiles et applicables au quotidien.', 'highlight', 'La capitalisation de valeur'),
            jsonb_build_object('id', 'app-5', 'author', 'Rita', 'rating', 4, 'quote', 'Le chapitre sur l’impact du temps m’a beaucoup fasciné parce qu’il révèle le vrai coût de l’inaction.', 'highlight', 'Le temps est un levier')
        ),
        'comments', jsonb_build_array(
            jsonb_build_object('id', 'comment-1', 'user', 'Ariane', 'chapter', 'Le travail inutile', 'text', 'J’ai beaucoup aimé la partie sur le travail inutile : c’est exactement là que la plupart des gens se perdent sans le voir.', 'rating', 5),
            jsonb_build_object('id', 'comment-2', 'user', 'Patrice', 'chapter', 'Le déclic', 'text', 'Le livre remet les priorités à leur place. Travail dur, mais avec une logique de valeur, pas de fatigue inutile.', 'rating', 5),
            jsonb_build_object('id', 'comment-3', 'user', 'Sonia', 'chapter', 'Le système', 'text', 'J’ai admiré la règle sur la création de valeur sans dépendre du temps. C’est la meilleure ligne du livre.', 'rating', 5),
            jsonb_build_object('id', 'comment-4', 'user', 'Mamadou', 'chapter', 'La refonte', 'text', 'C’est le genre de lecture qui te fait remettre les bonnes questions sur la table dès la première page.', 'rating', 5),
            jsonb_build_object('id', 'comment-5', 'user', 'Mady', 'chapter', 'Le coût du temps', 'text', 'Je le recommande surtout à ceux qui travaillent beaucoup mais gagnent peu. Ça ouvre les yeux très vite.', 'rating', 4),
            jsonb_build_object('id', 'comment-6', 'user', 'Gérald', 'chapter', 'Le salaire sans liberté', 'text', 'Le chapitre sur la dépendance au salaire a été le plus marquant pour moi.', 'rating', 5),
            jsonb_build_object('id', 'comment-7', 'user', 'Mina', 'chapter', 'La meilleure piste', 'text', 'Le livre est puissant parce qu’il donne un cadre sans prérequis. On peut commencer très vite.', 'rating', 5),
            jsonb_build_object('id', 'comment-8', 'user', 'Abdoul', 'chapter', 'La logique de valeur', 'text', 'Le passage sur la valeur et la perception de ton travail est excellent. Ça change beaucoup la manière de vendre.', 'rating', 5),
            jsonb_build_object('id', 'comment-9', 'user', 'Lina', 'chapter', 'Le bon sens', 'text', 'J’ai trouvé la proposition très crédible : moins de stress, plus d’impact, plus de liberté.', 'rating', 4),
            jsonb_build_object('id', 'comment-10', 'user', 'Cedric', 'chapter', 'La libération', 'text', 'J’ai gardé le principe : une vie forte ne se construit pas à coups de surmenage, mais par des choix de valeur.', 'rating', 5)
        )
    ))
on conflict (id) do update set data = excluded.data;

drop policy if exists "Paid ebook buyers can read purchased ebooks" on storage.objects;
create policy "Paid ebook buyers can read purchased ebooks"
    on storage.objects for select to authenticated
    using (
        bucket_id = 'ebooks'
        and (
            exists (
                select 1
                from public.orders o
                cross join lateral jsonb_array_elements(
                    case when jsonb_typeof(o.items) = 'array' then o.items else '[]'::jsonb end
                ) item
                join public.products p
                  on p.id = (item -> 'product' ->> 'id')
                where o.user_id = (select auth.uid())
                  and o.payment_status = 'paid'
                  and o.payment_verified
                  and p.data ->> 'ebookStoragePath' = storage.objects.name
            )
            or exists (
                select 1
                from public.products p
                where p.data ->> 'ebookStoragePath' = storage.objects.name
                  and p.data @> '{"price": 0}'::jsonb
            )
        )
    );

notify pgrst, 'reload schema';
commit;
