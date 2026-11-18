begin;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Product cover images are publicly readable" on storage.objects;
create policy "Product cover images are publicly readable"
    on storage.objects for select to anon, authenticated
    using (bucket_id = 'product-images');

insert into public.products (id, data)
values
    ('livre-01-choc_emotionnel', jsonb_build_object(
        'name', 'Le Choc Émotionnel : Comment Passer d''Inconnu à Indispensable dans Son Esprit',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Vance Sterling',
        'price', 12000.0 / 610,
        'rating', 0,
        'reviewsCount', 0,
        'images', jsonb_build_array('formations/livre01_choc_emotionnel.jpg'),
        'backgroundImage', 'formations/livre01_choc_emotionnel.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#b45309')),
        'description', 'Ebook JSON avec couverture et sommaire. Consultez l’aperçu pour déterminer si son contenu vous convient.',
        'preview', 'Un ouvrage sur les interactions sociales et les premières impressions. L’aperçu et le sommaire permettent d’évaluer son approche.',
        'specifications', 'Livre numérique JSON • Lecture en ligne',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'formations/livre01_choc_emotionnel.json',
        'theme', jsonb_build_object('background', '#1c1917', 'surface', '#292524', 'accent', '#f59e0b', 'title', '#fef3c7', 'text', '#e7e5e4', 'glow', 'rgba(245,158,11,0.28)'),
        'relatedBookIds', jsonb_build_array('livre-02-inversion_roles', 'livre-03-art_frustration', 'livre-04-addiction_emotionnelle', 'livre-05-psychologie_sombre', 'livre-06-arme_du_silence')
    )),
    ('livre-02-inversion_roles', jsonb_build_object(
        'name', 'L’Inversion des Rôles : La Méthode pour Qu''elle Devienne le Chasseur et Vous la Proie',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Vance Sterling',
        'price', 12000.0 / 610,
        'rating', 0,
        'reviewsCount', 0,
        'images', jsonb_build_array('formations/livre02_inversion_roles.jpg'),
        'backgroundImage', 'formations/livre02_inversion_roles.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#7c3aed')),
        'description', 'Ebook JSON avec couverture et sommaire. Consultez l’aperçu pour déterminer si son contenu vous convient.',
        'preview', 'Un ouvrage sur les relations et les dynamiques de réciprocité. L’aperçu et le sommaire permettent d’évaluer son approche.',
        'specifications', 'Livre numérique JSON • Lecture en ligne',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'formations/livre02_inversion_roles.json',
        'theme', jsonb_build_object('background', '#1e1b4b', 'surface', '#312e81', 'accent', '#a78bfa', 'title', '#ede9fe', 'text', '#e0e7ff', 'glow', 'rgba(167,139,250,0.3)'),
        'relatedBookIds', jsonb_build_array('livre-01-choc_emotionnel', 'livre-03-art_frustration', 'livre-05-psychologie_sombre', 'livre-07-masterclass_chaud_froid', 'livre-08-exploiter_psy_feminine')
    )),
    ('livre-03-art_frustration', jsonb_build_object(
        'name', 'L’Art de la Frustration : Rendre une 10/10 Obsédée en Lui Refusant Votre Validation',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Vance Sterling',
        'price', 12000.0 / 610,
        'rating', 0,
        'reviewsCount', 0,
        'images', jsonb_build_array('formations/livre03_art_frustration.jpg'),
        'backgroundImage', 'formations/livre03_art_frustration.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#be123c')),
        'description', 'Ebook JSON avec couverture et sommaire. Consultez l’aperçu pour déterminer si son contenu vous convient.',
        'preview', 'Un ouvrage portant sur la validation et les interactions relationnelles. L’aperçu et le sommaire permettent d’évaluer son approche.',
        'specifications', 'Livre numérique JSON • Lecture en ligne',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'formations/livre03_art_frustration.json',
        'theme', jsonb_build_object('background', '#4c0519', 'surface', '#881337', 'accent', '#fb7185', 'title', '#ffe4e6', 'text', '#fce7f3', 'glow', 'rgba(251,113,133,0.28)'),
        'relatedBookIds', jsonb_build_array('livre-01-choc_emotionnel', 'livre-02-inversion_roles', 'livre-04-addiction_emotionnelle', 'livre-07-masterclass_chaud_froid', 'livre-08-exploiter_psy_feminine')
    )),
    ('livre-04-addiction_emotionnelle', jsonb_build_object(
        'name', 'Le Code de l’Addiction Émotionnelle : Comment Occuper Ses Pensées Nuit et Jour',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Vance Sterling',
        'price', 12000.0 / 610,
        'rating', 0,
        'reviewsCount', 0,
        'images', jsonb_build_array('formations/livre04_addiction_emotionnelle.jpg'),
        'backgroundImage', 'formations/livre04_addiction_emotionnelle.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#0891b2')),
        'description', 'Ebook JSON avec couverture et sommaire. Consultez l’aperçu pour déterminer si son contenu vous convient.',
        'preview', 'Un ouvrage sur les émotions et les dynamiques relationnelles. L’aperçu et le sommaire permettent d’évaluer son approche.',
        'specifications', 'Livre numérique JSON • Lecture en ligne',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'formations/livre04_addiction_emotionnelle.json',
        'theme', jsonb_build_object('background', '#083344', 'surface', '#164e63', 'accent', '#22d3ee', 'title', '#cffafe', 'text', '#e0f2fe', 'glow', 'rgba(34,211,238,0.27)'),
        'relatedBookIds', jsonb_build_array('livre-01-choc_emotionnel', 'livre-03-art_frustration', 'livre-05-psychologie_sombre', 'livre-06-arme_du_silence', 'livre-07-masterclass_chaud_froid')
    )),
    ('livre-05-psychologie_sombre', jsonb_build_object(
        'name', 'Psychologie Sombre : Le Guide pour Créer une Obsession Mentale',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Vance Sterling',
        'price', 12000.0 / 610,
        'rating', 0,
        'reviewsCount', 0,
        'images', jsonb_build_array('formations/livre05_psychologie_sombre.jpg'),
        'backgroundImage', 'formations/livre05_psychologie_sombre.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#4f46e5')),
        'description', 'Ebook JSON avec couverture et sommaire. Consultez l’aperçu pour déterminer si son contenu vous convient.',
        'preview', 'Un ouvrage abordant la psychologie sociale et les relations. L’aperçu et le sommaire permettent d’évaluer son approche.',
        'specifications', 'Livre numérique JSON • Lecture en ligne',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'formations/livre05_psychologie_sombre.json',
        'theme', jsonb_build_object('background', '#111827', 'surface', '#1f2937', 'accent', '#818cf8', 'title', '#e0e7ff', 'text', '#e5e7eb', 'glow', 'rgba(129,140,248,0.3)'),
        'relatedBookIds', jsonb_build_array('livre-01-choc_emotionnel', 'livre-02-inversion_roles', 'livre-04-addiction_emotionnelle', 'livre-06-arme_du_silence', 'livre-08-exploiter_psy_feminine')
    )),
    ('livre-06-arme_du_silence', jsonb_build_object(
        'name', 'L’Arme du Silence : Comment Utiliser l’Indifférence dans les Relations',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Vance Sterling',
        'price', 12000.0 / 610,
        'rating', 0,
        'reviewsCount', 0,
        'images', jsonb_build_array('formations/livre06_arme_du_silence.jpg'),
        'backgroundImage', 'formations/livre06_arme_du_silence.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#059669')),
        'description', 'Ebook JSON avec couverture et sommaire. Consultez l’aperçu pour déterminer si son contenu vous convient.',
        'preview', 'Un ouvrage sur le silence, la communication et les relations. L’aperçu et le sommaire permettent d’évaluer son approche.',
        'specifications', 'Livre numérique JSON • Lecture en ligne',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'formations/livre06_arme_du_silence.json',
        'theme', jsonb_build_object('background', '#022c22', 'surface', '#064e3b', 'accent', '#34d399', 'title', '#d1fae5', 'text', '#d1fae5', 'glow', 'rgba(52,211,153,0.27)'),
        'relatedBookIds', jsonb_build_array('livre-01-choc_emotionnel', 'livre-04-addiction_emotionnelle', 'livre-05-psychologie_sombre', 'livre-07-masterclass_chaud_froid', 'livre-08-exploiter_psy_feminine')
    )),
    ('livre-07-masterclass_chaud_froid', jsonb_build_object(
        'name', 'Masterclass Chaud-Froid : Les Dynamiques Émotionnelles dans les Relations',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Vance Sterling',
        'price', 12000.0 / 610,
        'rating', 0,
        'reviewsCount', 0,
        'images', jsonb_build_array('formations/livre07_masterclass_chaud_froid.jpg'),
        'backgroundImage', 'formations/livre07_masterclass_chaud_froid.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#2563eb')),
        'description', 'Ebook JSON avec couverture et sommaire. Consultez l’aperçu pour déterminer si son contenu vous convient.',
        'preview', 'Un ouvrage sur les émotions et les rapports interpersonnels. L’aperçu et le sommaire permettent d’évaluer son approche.',
        'specifications', 'Livre numérique JSON • Lecture en ligne',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'formations/livre07_masterclass_chaud_froid.json',
        'theme', jsonb_build_object('background', '#172554', 'surface', '#1e3a8a', 'accent', '#60a5fa', 'title', '#dbeafe', 'text', '#eff6ff', 'glow', 'rgba(96,165,250,0.3)'),
        'relatedBookIds', jsonb_build_array('livre-02-inversion_roles', 'livre-03-art_frustration', 'livre-04-addiction_emotionnelle', 'livre-06-arme_du_silence', 'livre-08-exploiter_psy_feminine')
    )),
    ('livre-08-exploiter_psy_feminine', jsonb_build_object(
        'name', 'Psychologie Féminine et Relations',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Vance Sterling',
        'price', 12000.0 / 610,
        'rating', 0,
        'reviewsCount', 0,
        'images', jsonb_build_array('formations/livre08_exploiter_psy_feminine.jpg'),
        'backgroundImage', 'formations/livre08_exploiter_psy_feminine.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#c026d3')),
        'description', 'Ebook JSON avec couverture et sommaire. Consultez l’aperçu pour déterminer si son contenu vous convient.',
        'preview', 'Un ouvrage sur les relations et les différences de perspectives. L’aperçu et le sommaire permettent d’évaluer son approche.',
        'specifications', 'Livre numérique JSON • Lecture en ligne',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'formations/livre08_exploiter_psy_feminine.json',
        'theme', jsonb_build_object('background', '#4a044e', 'surface', '#701a75', 'accent', '#e879f9', 'title', '#fae8ff', 'text', '#fdf4ff', 'glow', 'rgba(232,121,249,0.28)'),
        'relatedBookIds', jsonb_build_array('livre-01-choc_emotionnel', 'livre-02-inversion_roles', 'livre-03-art_frustration', 'livre-05-psychologie_sombre', 'livre-07-masterclass_chaud_froid')
    ))
on conflict (id) do update set data = excluded.data;

update public.products
set data = jsonb_set(
    jsonb_set(data, '{images}', jsonb_build_array(
        case id
            when 'livre-09-liberte-financiere' then 'formations/livre09_de_0f_a_la_liberte.jpg'
            when 'livre-10-pourquoi-tu-es-pauvre' then 'formations/livre10_pourquoi_tu_es_pauvre.jpg'
            when 'livre-11-arrete-de-travailler-dur' then 'formations/livre11_arrete_de_travailler_dur.jpg'
        end
    )),
    '{backgroundImage}',
    to_jsonb(case id
        when 'livre-09-liberte-financiere' then 'formations/livre09_de_0f_a_la_liberte.jpg'
        when 'livre-10-pourquoi-tu-es-pauvre' then 'formations/livre10_pourquoi_tu_es_pauvre.jpg'
        when 'livre-11-arrete-de-travailler-dur' then 'formations/livre11_arrete_de_travailler_dur.jpg'
    end)
)
where id in (
    'livre-09-liberte-financiere',
    'livre-10-pourquoi-tu-es-pauvre',
    'livre-11-arrete-de-travailler-dur'
);

notify pgrst, 'reload schema';
commit;
