-- Keep these catalog rows so existing paid orders retain their ebook access.
update public.products
set data = data || jsonb_build_object('isHidden', true)
where id in (
    'livre-08-exploiter_psy_feminine',
    'livre-09-liberte-financiere',
    'livre-10-pourquoi-tu-es-pauvre',
    'livre-11-arrete-de-travailler-dur'
);
