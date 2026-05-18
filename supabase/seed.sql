-- Cannabis4All — datos semilla (ejecutar tras 0001_init.sql)

-- Categorías del foro
insert into public.forum_categories (slug, name, description, position) values
  ('cultivo',     'Cultivo',       'Indoor, outdoor, hidroponía, soluciones a problemas comunes.', 1),
  ('strains',     'Variedades',    'Discusión sobre genéticas, bancos de semillas y reviews.',     2),
  ('legal',       'Legal',         'Normativa, derechos y novedades legales en España y Europa.',  3),
  ('medicinal',   'Medicinal',     'Uso terapéutico, CBD, experiences y evidencia.',              4),
  ('comunidad',   'Comunidad',     'Presentaciones, off-topic y cosas varias.',                    5)
on conflict (slug) do nothing;


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
  ('jack-herer',      'Jack Herer',      'sativa', 20.0, 0.5, '{"pino","especias","cítrico"}',      '{"claro","creativo","funcional"}',      'Sativa funcional, ideal para uso diurno. Homenaje al activista cannábico.')
on conflict (slug) do nothing;


-- Clubs de muestra (España + WeedMaps)
insert into public.clubs (slug, name, category, description, address, city, country, location, website, phone, email, membership_required, verified, tags) values
  ('club-barcelona-gracia', 'Asociación Gràcia', 'asociacion', 'Asociación cannábica en el barrio de Gràcia.', 'Carrer de Verdi, 100', 'Barcelona', 'ES', st_setsrid(st_makepoint(2.1561, 41.4036), 4326)::geography, null, null, null, true, true, '{"Ambiente chill","Música en directo","Sofás"}'),
  ('club-barcelona-raval',  'CSC Raval', 'asociacion', 'Club social cannábico en el Raval.', 'Carrer Hospital, 56',  'Barcelona', 'ES', st_setsrid(st_makepoint(2.1689, 41.3812), 4326)::geography, null, null, null, true, true, '{"Céntrico","Mesa de billar","PlayStation"}'),
  ('club-barcelona-eixample','Eixample Cannabis', 'asociacion', 'Asociación en el Eixample izquierdo.', 'Carrer Aragó, 220', 'Barcelona', 'ES', st_setsrid(st_makepoint(2.1543, 41.3892), 4326)::geography, null, null, null, true, true, '{"Coworking","Tranquilo","Café top"}'),
  ('club-madrid-malasana',  'Malasaña Cannabis Club', 'asociacion', 'Asociación en Malasaña.', 'Calle Velarde, 12', 'Madrid', 'ES', st_setsrid(st_makepoint(-3.7022, 40.4263), 4326)::geography, null, null, null, true, false, '{"Alternativo","Arte local","Música urbana"}'),
  ('club-madrid-chueca',    'Chueca CSC', 'asociacion', 'Club social cannábico en Chueca.', 'Calle Hortaleza, 75', 'Madrid', 'ES', st_setsrid(st_makepoint(-3.6991, 40.4225), 4326)::geography, null, null, null, true, false, '{"Moderno","Buena ventilación","Diversidad"}'),
  ('club-valencia-ruzafa',  'Ruzafa Verde', 'asociacion', 'Asociación cannábica en Ruzafa.', 'Carrer Cadis, 30', 'València', 'ES', st_setsrid(st_makepoint(-0.3737, 39.4633), 4326)::geography, null, null, null, true, true, '{"Jardín interior","Eventos","Comunidad"}'),
  ('club-bilbao-casco',     'CSC Bilbao Casco', 'asociacion', 'Club en el Casco Viejo.', 'Calle Somera, 22', 'Bilbao', 'ES', st_setsrid(st_makepoint(-2.9233, 43.2596), 4326)::geography, null, null, null, true, false, '{"Acogedor","Juegos de mesa","Pintxos"}'),
  ('club-girona-centre',    'Girona Verda', 'asociacion', 'Associació cannàbica del centre de Girona.', 'Carrer Nou, 9', 'Girona', 'ES', st_setsrid(st_makepoint(2.8214, 41.9831), 4326)::geography, null, null, null, true, true, '{"Català","Misticismo","Tranquilo"}'),
  
  -- Barcelona (Nuevos de WeedMaps)
  ('club-barcelona-the-cut', 'The CUT Barcelona', 'asociacion', 'Asociación privada de usuarios de cannabis. La entrada es exclusiva para socios.', 'Floridablanca 134', 'Barcelona', 'ES', st_setsrid(st_makepoint(2.1601, 41.3804), 4326)::geography, null, '+34 607 93 06 45', 'thecutflorida@gmail.com', true, true, '{"Exclusivo","Privado","Elegante"}'),
  ('club-barcelona-dr-dou', 'Dr Dou', 'asociacion', 'Asociación sin ánimo de lucro en el Raval, que destaca por el arte, skate, y su ambiente acogedor.', 'Carrer del Doctor Dou 7 Local 2', 'Barcelona', 'ES', st_setsrid(st_makepoint(2.1691, 41.3822), 4326)::geography, 'http://drdou.es/', '+34 936 76 16 77', 'drdousocialclub@gmail.com', true, true, '{"Arte","Skate","Acogedor","Raval"}'),
  ('club-barcelona-choko', 'Choko Barcelona', 'asociacion', 'One of the most stunning private social cannabis clubs and art gallery in Europe.', 'Calle Jonqueres 13', 'Barcelona', 'ES', st_setsrid(st_makepoint(2.1742, 41.3878), 4326)::geography, null, '+34 932 50 71 03', 'reception@chokobarcelona.com', true, true, '{"Galería de arte","Diseño premium","Espacioso"}'),
  ('club-barcelona-carme-66', 'Carme 66 Cannabis Club', 'asociacion', 'Asociación privada sin ánimo de lucro exclusiva para socios avalados.', 'Carrer del Carme 66', 'Barcelona', 'ES', st_setsrid(st_makepoint(2.1673, 41.3813), 4326)::geography, null, '+34 651 07 61 85', 'recepcioncarme@gmail.com', true, true, '{"Privado","Céntrico","Tranquilo"}'),
  ('club-barcelona-mon-ami', 'Mon Ami', 'asociacion', 'Club social privado céntrico enfocado en arte, cine, música y concienciación sobre el consumo responsable de cannabis.', 'Ronda de Sant Pere 42', 'Barcelona', 'ES', st_setsrid(st_makepoint(2.1764, 41.3892), 4326)::geography, null, '+34 938 06 53 57', 'monamibcnweb@gmail.com', true, true, '{"Cine","Música","Arte","Responsable"}'),
  
  -- Madrid (Nuevos de WeedMaps)
  ('club-madrid-la-natura-cura', 'La Natura Cura', 'asociacion', 'Club privado medicinal sin ánimo de lucro especializado en medicina alternativa.', 'Calle Pizarro', 'Madrid', 'ES', st_setsrid(st_makepoint(-3.7058, 40.4233), 4326)::geography, null, '+34 910 46 11 70', 'newicemadrid@gmail.com', true, true, '{"Medicinal","Privado","Malasaña"}'),
  ('club-madrid-la-santa-boadilla', 'La Santa Boadilla', 'asociacion', 'Club social cannábico privado en la zona de Boadilla, Madrid.', 'Av. Isabel de Farnesio, 27', 'Boadilla del Monte', 'ES', st_setsrid(st_makepoint(-3.8821, 40.4074), 4326)::geography, null, '+34 614 17 98 02', 'lasantaboadilla@gmail.com', true, true, '{"Moderno","Amistoso","Social"}'),
  ('club-madrid-sweed-quality-labs', 'Sweed Quality Labs', 'asociacion', 'Sweed Quality Labs es una asociación privada en el corazón de Madrid.', 'Plaza de Tirso de Molina & Calle de la Espada', 'Madrid', 'ES', st_setsrid(st_makepoint(-3.7042, 40.4124), 4326)::geography, 'http://www.sweedqualitylabs.com', '+34 659 28 07 44', 'sweedqualitylabs@gmail.com', true, true, '{"Céntrico","Laboratorio","Calidad"}'),
  ('club-madrid-the-garden', 'T.G.C. (The Garden Club Madrid)', 'asociacion', 'Quiet and cosy private club close to Retiro''s Park. Requires booking in advance and minimum age of 27.', 'Plaza Mariano de Cavia', 'Madrid', 'ES', st_setsrid(st_makepoint(-3.6784, 40.4069), 4326)::geography, null, '+34 644 01 61 25', 'thegardenclubmadrid@gmail.com', true, true, '{"Cosy","+27 años","Tranquilo","Cerca Retiro"}'),
  ('club-madrid-diamond-smokers', 'Diamond Smokers Clubs', 'asociacion', 'Club social de cannabis privado en la zona de Embajadores, Madrid.', 'Glorieta Embajadores', 'Madrid', 'ES', st_setsrid(st_makepoint(-3.7024, 40.4049), 4326)::geography, null, '+34 651 87 46 51', 'diamondcscmadrid@gmail.com', true, true, '{"Embajadores","Premium","Comunidad"}'),
  
  -- Tenerife (Nuevos de WeedMaps)
  ('club-tenerife-araba-fenice', 'Araba Fenice', 'asociacion', 'Recreational cannabis club located in Guía de Isora, Tenerife.', 'Avenida los pescadores 15, Guía de Isora', 'Guía de Isora', 'ES', st_setsrid(st_makepoint(-16.8315, 28.2045), 4326)::geography, null, '+34 676 49 86 74', 'arabafenicealcala@hotmail.com', true, true, '{"Costa","Recreativo","Canarias"}'),
  ('club-tenerife-blue-diamond', 'BLUE DIAMOND', 'asociacion', 'Exclusive cannabis association in Adeje, Tenerife, offering premium quality products and a friendly club atmosphere.', 'Calle el Beril 12, Adeje', 'Adeje', 'ES', st_setsrid(st_makepoint(-16.7410, 28.0901), 4326)::geography, null, '+34 690 96 96 54', 'bluediamond.tenerife@gmail.com', true, true, '{"Exclusivo","Premium","Adeje"}'),
  ('club-tenerife-el-botanico', 'El Botanico 21', 'asociacion', 'Popular cannabis association in Guía de Isora, Tenerife, offering a comfortable space with a friendly atmosphere, air conditioning, and top-quality flowers.', 'C. Isla de Fuerteventura, 21, C Local 1, Guía de Isora', 'Guía de Isora', 'ES', st_setsrid(st_makepoint(-16.8291, 28.2036), 4326)::geography, null, '+34 922 69 39 61', 'elbotanico21@gmail.com', true, true, '{"Aire acondicionado","Buena vibra","Flores top"}'),
  
  -- Ibiza (Nuevos de WeedMaps)
  ('club-ibiza-sa-herba', 'Sa Herba', 'asociacion', 'Cozy cannabis social club in Ibiza with friendly staff and excellent vibes.', 'Navarra 19', 'Ibiza', 'ES', st_setsrid(st_makepoint(1.4239, 38.9056), 4326)::geography, null, null, 'Dangleibz@gmail.com', true, true, '{"Acogedor","Ibiza vibes","Amistoso"}'),
  ('club-ibiza-420', '420 Ibiza', 'asociacion', 'Famous and stylish cannabis association in Ibiza with premium organic flowers, highly friendly staff, and relaxed atmosphere.', 'Calle Antonio Machado 13', 'Ibiza', 'ES', st_setsrid(st_makepoint(1.4287, 38.9037), 4326)::geography, null, null, 'Contact@420ibiza.com', true, true, '{"Estiloso","Flores orgánicas","Lounge"}'),
  ('club-ibiza-green-panda', 'Green Panda Ibiza', 'asociacion', 'Top-rated cozy cannabis association in Santa Eulària des Riu, Ibiza. Features a beautifully decorated space with plants, fountains, and high-quality flowers and hash. Extremely friendly owners and great barista coffee.', 'Carrer de Sant Josep 42 B, Santa Eulària des Riu', 'Santa Eulària des Riu', 'ES', st_setsrid(st_makepoint(1.5307, 38.9839), 4326)::geography, null, null, 'Contactgreenplanetibiza@gmail.com', true, true, '{"Fuentes y plantas","Café barista","Top hash"}'),
  
  -- Malaga (Nuevos de WeedMaps)
  ('club-malaga-snsh', 'SNSH', 'asociacion', 'Cannabis association located in Malaga, offering a welcoming environment for its members.', 'calle carrito de la cruz 5, puerta 26', 'Málaga', 'ES', st_setsrid(st_makepoint(-4.4336, 36.7118), 4326)::geography, null, '+34 661 47 47 75', 'info@snsh.eu', true, true, '{"Málaga centro","Acogedor","Comunidad"}'),
  ('club-malaga-tranquility', 'Tranquility Social Weed Club', 'asociacion', 'Peaceful and modern cannabis social club located in Torremolinos, Málaga. Very clean, welcoming staff, great atmosphere.', 'Calle Río Subordán 1, Torremolinos', 'Málaga', 'ES', st_setsrid(st_makepoint(-4.5029, 36.6268), 4326)::geography, null, '+34 670 68 21 26', 'asociacion.tq@gmail.com', true, true, '{"Tranquilo","Muy limpio","Costa del Sol"}'),
  ('club-malaga-mo-faya', 'Mo Faya CSC', 'asociacion', 'Famous and welcoming cannabis social club in Marbella, Málaga, with a stunning sea view, multi-lingual friendly staff, and top-tier flowers and extracts.', 'Exclusivo para socios, Marbella', 'Marbella', 'ES', st_setsrid(st_makepoint(-4.8916, 36.5164), 4326)::geography, null, '+44 7943 725071', 'mofayacsc.marbella@gmail.com', true, true, '{"Vistas al mar","Multilingüe","Extractos"}'),
  
  -- Valencia (Nuevos de WeedMaps)
  ('club-valencia-canna-club', 'The Canna Club Valencia', 'asociacion', 'Famous and modern cannabis club in Valencia with high-quality products and great ambiance.', 'calle albalat dels tarongers', 'Valencia', 'ES', st_setsrid(st_makepoint(-0.3456, 39.4795), 4326)::geography, null, '+31 55 555 5555', 'cannaclubvlc@gmail.com', true, true, '{"Moderno","Ambiance","Calidad"}'),
  ('club-valencia-fourtwenty', 'FourTwenty', 'asociacion', 'Famous and cozy cannabis social club in Valencia with a great selection of flowers and products, welcoming staff, and games like billiards and PlayStation.', 'carretera de malilla 89', 'Valencia', 'ES', st_setsrid(st_makepoint(-0.3756, 39.4475), 4326)::geography, null, '+34 634 06 51 00', 'fourtwentycsc@gmail.com', true, true, '{"Billar","PlayStation","Amistoso","Malilla"}')
on conflict (slug) do nothing;

