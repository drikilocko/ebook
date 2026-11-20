begin;

with cover_paths (id, path) as (
    values
        ('livre-01-choc_emotionnel', 'ebooks/formations/livre01_choc_emotionnel.jpg'),
        ('livre-02-inversion_roles', 'ebooks/formations/livre02_inversion_roles.jpg'),
        ('livre-03-art_frustration', 'ebooks/formations/livre03_art_frustration.jpg'),
        ('livre-04-addiction_emotionnelle', 'ebooks/formations/livre04_addiction_emotionnelle.jpg'),
        ('livre-05-psychologie_sombre', 'ebooks/formations/livre05_psychologie_sombre.jpg'),
        ('livre-06-arme_du_silence', 'ebooks/formations/livre06_arme_du_silence.jpg'),
        ('livre-07-masterclass_chaud_froid', 'ebooks/formations/livre07_masterclass_chaud_froid.jpg'),
        ('livre-08-exploiter_psy_feminine', 'ebooks/formations/livre08_exploiter_psy_feminine.jpg'),
        ('livre-09-liberte-financiere', 'ebooks/formations/livre09_de_0f_a_la_liberte.jpg'),
        ('livre-10-pourquoi-tu-es-pauvre', 'ebooks/formations/livre10_pourquoi_tu_es_pauvre.jpg'),
        ('livre-11-arrete-de-travailler-dur', 'ebooks/formations/livre11_arrete_de_travailler_dur.jpg')
)
update public.products as products
set data = jsonb_set(
    jsonb_set(products.data, '{images}', jsonb_build_array(cover_paths.path), true),
    '{backgroundImage}',
    to_jsonb(cover_paths.path),
    true
)
from cover_paths
where products.id = cover_paths.id;

with ebook_paths (id, path) as (
    values
        ('ebook-cours-cash-ombre', 'formations/ebook.json'),
        ('ebook-1-mindset-succes', 'formations/ebook1.json'),
        ('ebook-2-discipline-fer', 'formations/ebook2.json'),
        ('ebook-3-habitudes-gagnantes', 'formations/ebook3.json'),
        ('ebook-4-leadership-interieur', 'formations/ebook4.json')
)
update public.products as products
set data = jsonb_set(products.data, '{ebookStoragePath}', to_jsonb(ebook_paths.path), true)
from ebook_paths
where products.id = ebook_paths.id;

notify pgrst, 'reload schema';
commit;
