begin;

-- Bucket ebooks (privé pour fichiers JSON)
insert into storage.buckets (id, name, public)
values ('ebooks', 'ebooks', false)
on conflict (id) do update set public = false;

-- Policy lecture authentifiée pour ebooks
drop policy if exists "Authenticated users can read ebooks" on storage.objects;
create policy "Authenticated users can read ebooks"
    on storage.objects for select to authenticated
    using (bucket_id = 'ebooks');

insert into public.products (id, data)
values
    ('ebook-1-mindset-succes', jsonb_build_object(
        'name', 'Mindset du Succès : Reprogrammez votre Mental',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Dr. Kouadio',
        'price', 250.0 / 610,
        'rating', 4.9,
        'reviewsCount', 256,
        'images', jsonb_build_array('ebooks/formations/ebook1.jpg'),
        'backgroundImage', 'ebooks/formations/ebook1.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#e94560')),
        'description', 'Un guide complet pour transformer votre façon de penser et adopter les habitudes mentales des hauts performeurs. Basé sur la psychologie cognitive et les neurosciences.',
        'preview', 'Découvrez les 7 piliers mentaux qui séparent les gagnants de ceux qui abandonnent.',
        'specifications', 'Livre numérique JSON • 180 pages • Exercices pratiques inclus • Accès à vie',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'ebooks/formations/ebook1.json',
        'theme', jsonb_build_object('background', '#1a1a2e', 'surface', '#16213e', 'accent', '#e94560', 'title', '#ffd700', 'text', '#eaeaea', 'glow', 'rgba(233,69,96,0.35)'),
        'relatedBookIds', jsonb_build_array('ebook-2-discipline-fer', 'ebook-3-habitudes-gagnantes', 'ebook-4-leadership-interieur')
    )),
    ('ebook-2-discipline-fer', jsonb_build_object(
        'name', 'Discipline de Fer : Maîtrisez l''Art de la Consistance',
        'category', 'DEVELOPPEMENT PERSONNEL',
        'brand', 'Coach Marcus',
        'price', 250.0 / 610,
        'rating', 4.8,
        'reviewsCount', 189,
        'images', jsonb_build_array('ebooks/formations/ebook2.jpg'),
        'backgroundImage', 'ebooks/formations/ebook2.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#00b4d8')),
        'description', 'Méthode éprouvée pour développer une discipline inébranlable sans volonté surhumaine. Systèmes, routines, et environnement design.',
        'preview', 'La discipline n''est pas un don, c''est un système. Apprenez à le construire pas à pas.',
        'specifications', 'Livre numérique JSON • 156 pages • Templates de routines • Tracker d''habitudes inclus',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'ebooks/formations/ebook2.json',
        'theme', jsonb_build_object('background', '#0d1b2a', 'surface', '#1b263b', 'accent', '#00b4d8', 'title', '#90e0ef', 'text', '#caf0f8', 'glow', 'rgba(0,180,216,0.3)'),
        'relatedBookIds', jsonb_build_array('ebook-1-mindset-succes', 'ebook-3-habitudes-gagnantes', 'ebook-4-leadership-interieur')
    )),
    ('ebook-3-habitudes-gagnantes', jsonb_build_object(
        'name', 'Habitudes Gagnantes : La Science du Changement Durable',
        'category', 'COMPETENCES NUMERIQUES',
        'brand', 'Prof. Amadou Diallo',
        'price', 250.0 / 610,
        'rating', 4.9,
        'reviewsCount', 312,
        'images', jsonb_build_array('ebooks/formations/ebook3.jpg'),
        'backgroundImage', 'ebooks/formations/ebook3.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#7c3aed')),
        'description', 'La science complète de la formation d''habitudes : boucles de rétroaction, design d''environnement, identity shift. Avec protocoles 21/66/90 jours.',
        'preview', 'Basé sur les dernières recherches en sciences du comportement. Créez des habitudes qui tiennent.',
        'specifications', 'Livre numérique JSON • 220 pages • Protocoles étape par étape • Feuilles de travail téléchargeables',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'ebooks/formations/ebook3.json',
        'theme', jsonb_build_object('background', '#0f0f23', 'surface', '#1a1a3e', 'accent', '#7c3aed', 'title', '#c4b5fd', 'text', '#e0e7ff', 'glow', 'rgba(124,58,237,0.35)'),
        'relatedBookIds', jsonb_build_array('ebook-1-mindset-succes', 'ebook-2-discipline-fer', 'ebook-4-leadership-interieur')
    )),
    ('ebook-4-leadership-interieur', jsonb_build_object(
        'name', 'Leadership Intérieur : Devenez le Leader de votre Vie',
        'category', 'ENTREPRENEURIAT',
        'brand', 'Mme. Aïssatou Fall',
        'price', 250.0 / 610,
        'rating', 5.0,
        'reviewsCount', 143,
        'images', jsonb_build_array('ebooks/formations/ebook4.jpg'),
        'backgroundImage', 'ebooks/formations/ebook4.jpg',
        'colors', jsonb_build_array(jsonb_build_object('name', 'Ebook JSON', 'hex', '#d4a843')),
        'description', 'Guide de leadership personnel pour entrepreneurs et cadres : intelligence émotionnelle, prise de décision sous pression, vision stratégique, influence éthique.',
        'preview', 'Le vrai leadership commence par soi. Maîtrisez vos émotions, décisions et impact.',
        'specifications', 'Livre numérique JSON • 198 pages • Études de cas africaines • Cahier de réflexion inclus',
        'isNewIn', true,
        'productType', 'Ebook de formation',
        'ebookFormat', 'json',
        'ebookStoragePath', 'ebooks/formations/ebook4.json',
        'theme', jsonb_build_object('background', '#140f26', 'surface', '#1e1436', 'accent', '#d4a843', 'title', '#fef08a', 'text', '#fefce8', 'glow', 'rgba(212,168,67,0.35)'),
        'relatedBookIds', jsonb_build_array('ebook-1-mindset-succes', 'ebook-2-discipline-fer', 'ebook-3-habitudes-gagnantes')
    ))
on conflict (id) do update set data = excluded.data;

notify pgrst, 'reload schema';
commit;