-- Cannabis4All — datos semilla (ejecutar tras 0001_init.sql)

-- Categorías del foro
insert into public.forum_categories (slug, name, description, position) values
  ('cultivo',     'Cultivo',       'Indoor, outdoor, hidroponía, soluciones a problemas comunes.', 1),
  ('strains',     'Variedades',    'Discusión sobre genéticas, bancos de semillas y reviews.',     2),
  ('legal',       'Legal',         'Normativa, derechos y novedades legales en España y Europa.',  3),
  ('medicinal',   'Medicinal',     'Uso terapéutico, CBD, experiencias y evidencia.',              4),
  ('comunidad',   'Comunidad',     'Presentaciones, off-topic y cosas varias.',                    5);

-- Strains de muestra
insert into public.strains (slug, name, type, thc_pct, cbd_pct, flavors, effects, description) values
  ('white-widow',     'White Widow',     'hybrid', 19.0, 0.5, '{"térreo","floral","pino"}',         '{"energético","cerebral","creativo"}', 'Híbrido legendario de los 90, equilibrio sativa/indica con resina abundante.'),
  ('northern-lights', 'Northern Lights', 'indica', 18.0, 0.2, '{"dulce","especiado","cítrico"}',    '{"relajante","sedante","corporal"}',    'Indica clásica con efecto profundamente relajante. Ideal para final del día.'),
  ('amnesia-haze',    'Amnesia Haze',    'sativa', 22.0, 0.3, '{"cítrico","incienso","limón"}',     '{"eufórico","social","creativo"}',      'Sativa potente con efecto cerebral marcado. Premio Cannabis Cup.'),
  ('og-kush',         'OG Kush',         'hybrid', 23.0, 0.3, '{"pino","tierra","limón"}',          '{"relajante","feliz","hambriento"}',    'Híbrido californiano con notas terpenicas intensas y efecto equilibrado.'),
  ('blue-dream',      'Blue Dream',      'hybrid', 18.0, 0.1, '{"frutos rojos","arándano","dulce"}', '{"creativo","relajado","feliz"}',       'Cruce Blueberry × Haze. Muy popular en EEUU, sativa-dominante suave.'),
  ('charlottes-web',  'Charlotte''s Web', 'hybrid', 0.5, 17.0, '{"térreo","herbal","cítrico"}',    '{"calmante","claro","sin colocón"}',    'Variedad medicinal alta en CBD y baja en THC. Pensada para uso terapéutico.'),
  ('granddaddy-purple','Granddaddy Purple','indica', 20.0, 0.4, '{"uva","frutos del bosque","dulce"}','{"sedante","feliz","corporal"}',     'Indica púrpura, conocida por su efecto relajante intenso.'),
  ('sour-diesel',     'Sour Diesel',     'sativa', 22.0, 0.2, '{"diesel","cítrico","ácido"}',       '{"energético","focal","social"}',       'Sativa estimulante con perfil terpenico inconfundible.'),
  ('girl-scout-cookies','Girl Scout Cookies','hybrid', 25.0, 0.3, '{"dulce","menta","tierra"}',     '{"eufórico","corporal","creativo"}',     'Híbrido potente, ganador de varios premios. Originaria de California.'),
  ('jack-herer',      'Jack Herer',      'sativa', 20.0, 0.5, '{"pino","especias","cítrico"}',      '{"claro","creativo","funcional"}',      'Sativa funcional, ideal para uso diurno. Homenaje al activista cannábico.');

-- Clubs de muestra (España)
insert into public.clubs (slug, name, description, address, city, country, location, website, membership_required, verified) values
  ('club-barcelona-gracia', 'Asociación Gràcia',   'Asociación cannábica en el barrio de Gràcia.', 'Carrer de Verdi, 100', 'Barcelona', 'ES', st_setsrid(st_makepoint(2.1561, 41.4036), 4326)::geography, null, true, true),
  ('club-barcelona-raval',  'CSC Raval',           'Club social cannábico en el Raval.',            'Carrer Hospital, 56',  'Barcelona', 'ES', st_setsrid(st_makepoint(2.1689, 41.3812), 4326)::geography, null, true, true),
  ('club-barcelona-eixample','Eixample Cannabis',  'Asociación en el Eixample izquierdo.',          'Carrer Aragó, 220',    'Barcelona', 'ES', st_setsrid(st_makepoint(2.1543, 41.3892), 4326)::geography, null, true, true),
  ('club-madrid-malasana',  'Malasaña Cannabis Club','Asociación en Malasaña.',                     'Calle Velarde, 12',    'Madrid',    'ES', st_setsrid(st_makepoint(-3.7022, 40.4263), 4326)::geography, null, true, false),
  ('club-madrid-chueca',    'Chueca CSC',          'Club social cannábico en Chueca.',              'Calle Hortaleza, 75',  'Madrid',    'ES', st_setsrid(st_makepoint(-3.6991, 40.4225), 4326)::geography, null, true, false),
  ('club-valencia-ruzafa',  'Ruzafa Verde',        'Asociación cannábica en Ruzafa.',               'Carrer Cadis, 30',     'València',  'ES', st_setsrid(st_makepoint(-0.3737, 39.4633), 4326)::geography, null, true, true),
  ('club-bilbao-casco',     'CSC Bilbao Casco',    'Club en el Casco Viejo.',                        'Calle Somera, 22',     'Bilbao',    'ES', st_setsrid(st_makepoint(-2.9233, 43.2596), 4326)::geography, null, true, false),
  ('club-girona-centre',    'Girona Verda',        'Associació cannàbica del centre de Girona.',     'Carrer Nou, 9',        'Girona',    'ES', st_setsrid(st_makepoint(2.8214, 41.9831), 4326)::geography, null, true, true);
