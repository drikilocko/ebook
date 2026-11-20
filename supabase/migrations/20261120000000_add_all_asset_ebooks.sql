begin;

insert into storage.buckets (id, name, public)
values ('ebooks', 'ebooks', false)
on conflict (id) do update set public = false;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

insert into public.products (id, data)
values
    ('ebook-cours-cash-ombre', jsonb_build_object(
        'name', 'Le Cours Cash & Ombre',
        'category', 'ENTREPRENEURIAT',
        'brand', 'Vance Sterling',
        'price', 250.0 / 610,
        'rating', 0, 'reviewsCount', 0,
        'images', jsonb_build_array('ebooks/formations/ebook.jpg'),
        'backgroundImage', 'ebooks/formations/ebook.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#d4af37')),
        'description', 'Livre numerique au format JSON, disponible a la lecture dans l’application.',
        'preview', 'Decouvrez les strategies, principes et exercices presentes dans cet ouvrage.',
        'specifications', 'Livre numerique JSON • Lecture en ligne',
        'isNewIn', true, 'isHidden', false,
        'productType', 'Ebook de formation', 'ebookFormat', 'json',
        'ebookStoragePath', 'formations/ebook.json',
        'theme', jsonb_build_object('background', '#111827', 'surface', '#1f2937', 'accent', '#d4af37', 'title', '#fef3c7', 'text', '#e5e7eb', 'glow', 'rgba(212,175,55,0.35)')
    )),
    ('ebook-1-mindset-succes', jsonb_build_object(
        'name', 'Hypnose Sombre & Fascination Totale',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Vance Sterling', 'price', 250.0 / 610,
        'rating', 0, 'reviewsCount', 0,
        'images', jsonb_build_array('ebooks/formations/ebook1.jpg'),
        'backgroundImage', 'ebooks/formations/ebook1.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#e94560')),
        'description', 'Livre numerique au format JSON, disponible a la lecture dans l’application.',
        'preview', 'Un guide numerique sur l’influence, la communication et la presence personnelle.',
        'specifications', 'Livre numerique JSON • Lecture en ligne',
        'isNewIn', true, 'isHidden', false,
        'productType', 'Ebook de formation', 'ebookFormat', 'json',
        'ebookStoragePath', 'formations/ebook1.json',
        'theme', jsonb_build_object('background', '#1a1a2e', 'surface', '#16213e', 'accent', '#e94560', 'title', '#ffd700', 'text', '#eaeaea', 'glow', 'rgba(233,69,96,0.35)')
    )),
    ('ebook-2-discipline-fer', jsonb_build_object(
        'name', 'L’Art Obscur du Charisme Absolu',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Vance Sterling', 'price', 250.0 / 610,
        'rating', 0, 'reviewsCount', 0,
        'images', jsonb_build_array('ebooks/formations/ebook2.jpg'),
        'backgroundImage', 'ebooks/formations/ebook2.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#00b4d8')),
        'description', 'Livre numerique au format JSON, disponible a la lecture dans l’application.',
        'preview', 'Apprenez les bases du charisme, de l’expression personnelle et de l’impact relationnel.',
        'specifications', 'Livre numerique JSON • Lecture en ligne',
        'isNewIn', true, 'isHidden', false,
        'productType', 'Ebook de formation', 'ebookFormat', 'json',
        'ebookStoragePath', 'formations/ebook2.json',
        'theme', jsonb_build_object('background', '#0d1b2a', 'surface', '#1b263b', 'accent', '#00b4d8', 'title', '#90e0ef', 'text', '#caf0f8', 'glow', 'rgba(0,180,216,0.3)')
    )),
    ('ebook-3-habitudes-gagnantes', jsonb_build_object(
        'name', 'Le Cadre Suprême : Domination Psychologique & Monopole Mental',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Vance Sterling', 'price', 250.0 / 610,
        'rating', 0, 'reviewsCount', 0,
        'images', jsonb_build_array('ebooks/formations/ebook3.jpg'),
        'backgroundImage', 'ebooks/formations/ebook3.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#7c3aed')),
        'description', 'Livre numerique au format JSON, disponible a la lecture dans l’application.',
        'preview', 'Un ouvrage numerique consacre aux dynamiques mentales et aux interactions sociales.',
        'specifications', 'Livre numerique JSON • Lecture en ligne',
        'isNewIn', true, 'isHidden', false,
        'productType', 'Ebook de formation', 'ebookFormat', 'json',
        'ebookStoragePath', 'formations/ebook3.json',
        'theme', jsonb_build_object('background', '#0f0f23', 'surface', '#1a1a3e', 'accent', '#7c3aed', 'title', '#c4b5fd', 'text', '#e0e7ff', 'glow', 'rgba(124,58,237,0.35)')
    )),
    ('ebook-4-leadership-interieur', jsonb_build_object(
        'name', 'L’Art Ultime de la Conquête : Le Cours de Terrain',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Vance Sterling', 'price', 250.0 / 610,
        'rating', 0, 'reviewsCount', 0,
        'images', jsonb_build_array('ebooks/formations/ebook4.jpg'),
        'backgroundImage', 'ebooks/formations/ebook4.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#d4a843')),
        'description', 'Livre numerique au format JSON, disponible a la lecture dans l’application.',
        'preview', 'Un cours numerique portant sur la communication, les relations et l’attitude.',
        'specifications', 'Livre numerique JSON • Lecture en ligne',
        'isNewIn', true, 'isHidden', false,
        'productType', 'Ebook de formation', 'ebookFormat', 'json',
        'ebookStoragePath', 'formations/ebook4.json',
        'theme', jsonb_build_object('background', '#140f26', 'surface', '#1e1436', 'accent', '#d4a843', 'title', '#fef08a', 'text', '#fefce8', 'glow', 'rgba(212,168,67,0.35)')
    )),
    ('livre-01-choc_emotionnel', jsonb_build_object('name', 'Le Choc Émotionnel', 'category', 'DEVELOPPEMENT PERSONNEL', 'brand', 'Vance Sterling', 'price', 12000.0 / 610, 'rating', 0, 'reviewsCount', 0, 'images', jsonb_build_array('formations/livre01_choc_emotionnel.jpg'), 'backgroundImage', 'formations/livre01_choc_emotionnel.jpg', 'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#b45309')), 'description', 'Livre numerique au format JSON.', 'preview', 'Lisez l’ouvrage dans l’application.', 'specifications', 'Livre numerique JSON • Lecture en ligne', 'isNewIn', true, 'isHidden', false, 'productType', 'Ebook de formation', 'ebookFormat', 'json', 'ebookStoragePath', 'formations/livre01_choc_emotionnel.json')),
    ('livre-02-inversion_roles', jsonb_build_object('name', 'L’Inversion des Rôles', 'category', 'DEVELOPPEMENT PERSONNEL', 'brand', 'Vance Sterling', 'price', 12000.0 / 610, 'rating', 0, 'reviewsCount', 0, 'images', jsonb_build_array('formations/livre02_inversion_roles.jpg'), 'backgroundImage', 'formations/livre02_inversion_roles.jpg', 'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#7c3aed')), 'description', 'Livre numerique au format JSON.', 'preview', 'Lisez l’ouvrage dans l’application.', 'specifications', 'Livre numerique JSON • Lecture en ligne', 'isNewIn', true, 'isHidden', false, 'productType', 'Ebook de formation', 'ebookFormat', 'json', 'ebookStoragePath', 'formations/livre02_inversion_roles.json')),
    ('livre-03-art_frustration', jsonb_build_object('name', 'L’Art de la Frustration', 'category', 'DEVELOPPEMENT PERSONNEL', 'brand', 'Vance Sterling', 'price', 12000.0 / 610, 'rating', 0, 'reviewsCount', 0, 'images', jsonb_build_array('formations/livre03_art_frustration.jpg'), 'backgroundImage', 'formations/livre03_art_frustration.jpg', 'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#be123c')), 'description', 'Livre numerique au format JSON.', 'preview', 'Lisez l’ouvrage dans l’application.', 'specifications', 'Livre numerique JSON • Lecture en ligne', 'isNewIn', true, 'isHidden', false, 'productType', 'Ebook de formation', 'ebookFormat', 'json', 'ebookStoragePath', 'formations/livre03_art_frustration.json')),
    ('livre-04-addiction_emotionnelle', jsonb_build_object('name', 'Le Code de l’Addiction Émotionnelle', 'category', 'DEVELOPPEMENT PERSONNEL', 'brand', 'Vance Sterling', 'price', 12000.0 / 610, 'rating', 0, 'reviewsCount', 0, 'images', jsonb_build_array('formations/livre04_addiction_emotionnelle.jpg'), 'backgroundImage', 'formations/livre04_addiction_emotionnelle.jpg', 'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#0891b2')), 'description', 'Livre numerique au format JSON.', 'preview', 'Lisez l’ouvrage dans l’application.', 'specifications', 'Livre numerique JSON • Lecture en ligne', 'isNewIn', true, 'isHidden', false, 'productType', 'Ebook de formation', 'ebookFormat', 'json', 'ebookStoragePath', 'formations/livre04_addiction_emotionnelle.json')),
    ('livre-05-psychologie_sombre', jsonb_build_object('name', 'Psychologie Sombre', 'category', 'DEVELOPPEMENT PERSONNEL', 'brand', 'Vance Sterling', 'price', 12000.0 / 610, 'rating', 0, 'reviewsCount', 0, 'images', jsonb_build_array('formations/livre05_psychologie_sombre.jpg'), 'backgroundImage', 'formations/livre05_psychologie_sombre.jpg', 'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#4f46e5')), 'description', 'Livre numerique au format JSON.', 'preview', 'Lisez l’ouvrage dans l’application.', 'specifications', 'Livre numerique JSON • Lecture en ligne', 'isNewIn', true, 'isHidden', false, 'productType', 'Ebook de formation', 'ebookFormat', 'json', 'ebookStoragePath', 'formations/livre05_psychologie_sombre.json')),
    ('livre-06-arme_du_silence', jsonb_build_object('name', 'L’Arme du Silence', 'category', 'DEVELOPPEMENT PERSONNEL', 'brand', 'Vance Sterling', 'price', 12000.0 / 610, 'rating', 0, 'reviewsCount', 0, 'images', jsonb_build_array('formations/livre06_arme_du_silence.jpg'), 'backgroundImage', 'formations/livre06_arme_du_silence.jpg', 'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#059669')), 'description', 'Livre numerique au format JSON.', 'preview', 'Lisez l’ouvrage dans l’application.', 'specifications', 'Livre numerique JSON • Lecture en ligne', 'isNewIn', true, 'isHidden', false, 'productType', 'Ebook de formation', 'ebookFormat', 'json', 'ebookStoragePath', 'formations/livre06_arme_du_silence.json')),
    ('livre-07-masterclass_chaud_froid', jsonb_build_object('name', 'Masterclass Chaud-Froid', 'category', 'DEVELOPPEMENT PERSONNEL', 'brand', 'Vance Sterling', 'price', 12000.0 / 610, 'rating', 0, 'reviewsCount', 0, 'images', jsonb_build_array('formations/livre07_masterclass_chaud_froid.jpg'), 'backgroundImage', 'formations/livre07_masterclass_chaud_froid.jpg', 'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#2563eb')), 'description', 'Livre numerique au format JSON.', 'preview', 'Lisez l’ouvrage dans l’application.', 'specifications', 'Livre numerique JSON • Lecture en ligne', 'isNewIn', true, 'isHidden', false, 'productType', 'Ebook de formation', 'ebookFormat', 'json', 'ebookStoragePath', 'formations/livre07_masterclass_chaud_froid.json')),
    ('livre-08-exploiter_psy_feminine', jsonb_build_object('name', 'Psychologie Féminine et Relations', 'category', 'DEVELOPPEMENT PERSONNEL', 'brand', 'Vance Sterling', 'price', 12000.0 / 610, 'rating', 0, 'reviewsCount', 0, 'images', jsonb_build_array('formations/livre08_exploiter_psy_feminine.jpg'), 'backgroundImage', 'formations/livre08_exploiter_psy_feminine.jpg', 'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#c026d3')), 'description', 'Livre numerique au format JSON.', 'preview', 'Lisez l’ouvrage dans l’application.', 'specifications', 'Livre numerique JSON • Lecture en ligne', 'isNewIn', true, 'isHidden', true, 'productType', 'Ebook de formation', 'ebookFormat', 'json', 'ebookStoragePath', 'formations/livre08_exploiter_psy_feminine.json')),
    ('livre-09-liberte-financiere', jsonb_build_object('name', 'De 0 F à la Liberté Totale', 'category', 'FINANCES', 'brand', 'Vance Sterling', 'price', 14000.0 / 610, 'rating', 4.9, 'reviewsCount', 142, 'images', jsonb_build_array('formations/livre09_de_0f_a_la_liberte.jpg'), 'backgroundImage', 'formations/livre09_de_0f_a_la_liberte.jpg', 'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#6d28d9')), 'description', 'Le guide pratique consacre au développement des revenus et à la liberté financière.', 'preview', 'Construisez des revenus plus solides et une vraie autonomie financière.', 'specifications', 'Livre numerique JSON • Lecture en ligne', 'isNewIn', true, 'isHidden', true, 'productType', 'Ebook de formation', 'ebookFormat', 'json', 'ebookStoragePath', 'formations/livre09_de_0f_a_la_liberte.json')),
    ('livre-10-pourquoi-tu-es-pauvre', jsonb_build_object('name', 'Pourquoi tu Es Encore Pauvre', 'category', 'FINANCES', 'brand', 'Vance Sterling', 'price', 12000.0 / 610, 'rating', 4.8, 'reviewsCount', 138, 'images', jsonb_build_array('formations/livre10_pourquoi_tu_es_pauvre.jpg'), 'backgroundImage', 'formations/livre10_pourquoi_tu_es_pauvre.jpg', 'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#7c3aed')), 'description', 'Un livre sur les habitudes financières et les principes de gestion de l’argent.', 'preview', 'Comprenez les habitudes qui freinent la croissance de vos revenus.', 'specifications', 'Livre numerique JSON • Lecture en ligne', 'isNewIn', true, 'isHidden', true, 'productType', 'Ebook de formation', 'ebookFormat', 'json', 'ebookStoragePath', 'formations/livre10_pourquoi_tu_es_pauvre.json')),
    ('livre-11-arrete-de-travailler-dur', jsonb_build_object('name', 'Arrête de Travailler Dur', 'category', 'FINANCES', 'brand', 'Vance Sterling', 'price', 0, 'rating', 4.9, 'reviewsCount', 201, 'images', jsonb_build_array('formations/livre11_arrete_de_travailler_dur.jpg'), 'backgroundImage', 'formations/livre11_arrete_de_travailler_dur.jpg', 'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#16a34a')), 'description', 'Le livre numerique gratuit sur les strategies financieres et la creation de revenus.', 'preview', 'Découvrez comment creer de la valeur sans dépendre uniquement du temps.', 'specifications', 'Livre numerique JSON • Gratuit • Lecture en ligne', 'isNewIn', true, 'isHidden', true, 'productType', 'Ebook de formation', 'ebookFormat', 'json', 'ebookStoragePath', 'formations/livre11_arrete_de_travailler_dur.json'))
on conflict (id) do update set data = public.products.data || excluded.data;

update public.products
set data = jsonb_set(
    jsonb_set(
        data,
        '{images}',
        jsonb_build_array('ebooks/formations/' || case id
            when 'livre-01-choc_emotionnel' then 'livre01_choc_emotionnel.jpg'
            when 'livre-02-inversion_roles' then 'livre02_inversion_roles.jpg'
            when 'livre-03-art_frustration' then 'livre03_art_frustration.jpg'
            when 'livre-04-addiction_emotionnelle' then 'livre04_addiction_emotionnelle.jpg'
            when 'livre-05-psychologie_sombre' then 'livre05_psychologie_sombre.jpg'
            when 'livre-06-arme_du_silence' then 'livre06_arme_du_silence.jpg'
            when 'livre-07-masterclass_chaud_froid' then 'livre07_masterclass_chaud_froid.jpg'
            when 'livre-08-exploiter_psy_feminine' then 'livre08_exploiter_psy_feminine.jpg'
            when 'livre-09-liberte-financiere' then 'livre09_de_0f_a_la_liberte.jpg'
            when 'livre-10-pourquoi-tu-es-pauvre' then 'livre10_pourquoi_tu_es_pauvre.jpg'
            when 'livre-11-arrete-de-travailler-dur' then 'livre11_arrete_de_travailler_dur.jpg'
        end),
        true
    ),
    '{backgroundImage}',
    to_jsonb('ebooks/formations/' || case id
        when 'livre-01-choc_emotionnel' then 'livre01_choc_emotionnel.jpg'
        when 'livre-02-inversion_roles' then 'livre02_inversion_roles.jpg'
        when 'livre-03-art_frustration' then 'livre03_art_frustration.jpg'
        when 'livre-04-addiction_emotionnelle' then 'livre04_addiction_emotionnelle.jpg'
        when 'livre-05-psychologie_sombre' then 'livre05_psychologie_sombre.jpg'
        when 'livre-06-arme_du_silence' then 'livre06_arme_du_silence.jpg'
        when 'livre-07-masterclass_chaud_froid' then 'livre07_masterclass_chaud_froid.jpg'
        when 'livre-08-exploiter_psy_feminine' then 'livre08_exploiter_psy_feminine.jpg'
        when 'livre-09-liberte-financiere' then 'livre09_de_0f_a_la_liberte.jpg'
        when 'livre-10-pourquoi-tu-es-pauvre' then 'livre10_pourquoi_tu_es_pauvre.jpg'
        when 'livre-11-arrete-de-travailler-dur' then 'livre11_arrete_de_travailler_dur.jpg'
    end),
    true
)
where id in (
    'livre-01-choc_emotionnel',
    'livre-02-inversion_roles',
    'livre-03-art_frustration',
    'livre-04-addiction_emotionnelle',
    'livre-05-psychologie_sombre',
    'livre-06-arme_du_silence',
    'livre-07-masterclass_chaud_froid',
    'livre-08-exploiter_psy_feminine',
    'livre-09-liberte-financiere',
    'livre-10-pourquoi-tu-es-pauvre',
    'livre-11-arrete-de-travailler-dur'
);

notify pgrst, 'reload schema';
commit;
