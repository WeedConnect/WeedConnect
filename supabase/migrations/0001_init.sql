-- Cannabis4All — schema inicial (Fase 2)
-- Ejecutar en el SQL Editor de Supabase tras crear el proyecto.
-- Requisitos previos: habilitar las extensiones postgis y pgcrypto desde
-- Database → Extensions en el panel de Supabase.

create extension if not exists "pgcrypto";
create extension if not exists "postgis";

-- ============================================================================
-- PROFILES (extiende auth.users)
-- ============================================================================
create type user_role as enum ('user', 'moderator', 'admin');

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null check (char_length(username) between 3 and 30),
  display_name  text,
  avatar_url    text,
  bio           text,
  role          user_role not null default 'user',
  points        integer not null default 0,
  age_verified  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index profiles_username_idx on public.profiles (lower(username));

-- Trigger: auto-crear profile al registrar usuario
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger: proteger columna role de modificaciones no autorizadas en updates
create or replace function public.check_role_change()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  -- Si la petición es de un usuario autenticado del cliente y hay un cambio de rol...
  if auth.role() = 'authenticated' and new.role <> old.role then
    -- Solo permitimos el cambio si el usuario ejecutor ya es admin
    if not exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    ) then
      new.role := old.role; -- Revertir el cambio silenciosamente
    end if;
  end if;
  return new;
end;
$$;

create trigger enforce_profile_roles
  before update on public.profiles
  for each row execute function public.check_role_change();


-- ============================================================================
-- STRAINS (catálogo)
-- ============================================================================
create type strain_type as enum ('indica', 'sativa', 'hybrid');

create table public.strains (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  type         strain_type not null,
  thc_pct      numeric(4,1),
  cbd_pct      numeric(4,1),
  flavors      text[] not null default '{}',
  effects      text[] not null default '{}',
  description  text not null,
  image_url    text,
  created_at   timestamptz not null default now()
);

create index strains_type_idx on public.strains (type);

-- ============================================================================
-- CLUBS / SPOTS (asociaciones y sitios chill con geolocalización)
-- ============================================================================
create type spot_category as enum ('asociacion', 'mirador', 'parque', 'banco', 'playa', 'spot_relax', 'otro');

create table public.clubs (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text unique not null,
  name                  text not null,
  category              spot_category not null default 'asociacion',
  description           text,
  address               text not null,
  city                  text not null,
  country               text not null default 'ES',
  location              geography(point, 4326) not null,
  membership_required   boolean not null default true,
  tags                  text[] not null default '{}',
  website               text,
  phone                 text,
  email                 text,
  verified              boolean not null default false,
  created_by            uuid references public.profiles(id) on delete set null,
  created_at            timestamptz not null default now()
);

create index clubs_location_idx on public.clubs using gist (location);
create index clubs_city_idx on public.clubs (lower(city));

-- ============================================================================
-- FORUM (threads + posts + votes)
-- ============================================================================
create table public.forum_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  position    integer not null default 0
);

create table public.forum_threads (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.forum_categories(id) on delete cascade,
  author_id    uuid not null references public.profiles(id) on delete cascade,
  slug         text not null,
  title        text not null,
  body         text not null,
  pinned       boolean not null default false,
  locked       boolean not null default false,
  view_count   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (category_id, slug)
);

create index forum_threads_category_idx on public.forum_threads (category_id, created_at desc);

create table public.forum_posts (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.forum_threads(id) on delete cascade,
  author_id   uuid not null references public.profiles(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index forum_posts_thread_idx on public.forum_posts (thread_id, created_at);

-- Votos polimórficos: pueden ser sobre thread, post, strain o club
create type vote_target as enum ('thread', 'post', 'strain', 'club');
create type vote_value as enum ('up', 'down');

create table public.votes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  target     vote_target not null,
  target_id  uuid not null,
  value      vote_value not null,
  created_at timestamptz not null default now(),
  unique (user_id, target, target_id)
);

create index votes_target_idx on public.votes (target, target_id);

-- ============================================================================
-- GROW LOGS (seguimiento de cultivo)
-- ============================================================================
create type grow_stage as enum (
  'germination', 'seedling', 'vegetative', 'flowering', 'harvest', 'curing'
);

create table public.grow_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  strain_id   uuid references public.strains(id) on delete set null,
  name        text not null,
  started_at  date not null,
  finished_at date,
  notes       text,
  created_at  timestamptz not null default now()
);

create index grow_logs_user_idx on public.grow_logs (user_id, started_at desc);

create table public.grow_log_entries (
  id            uuid primary key default gen_random_uuid(),
  grow_log_id   uuid not null references public.grow_logs(id) on delete cascade,
  entry_date    date not null,
  stage         grow_stage not null,
  notes         text,
  watering_ml   integer,
  watering_ph   numeric(3,1),
  nutrients     jsonb,
  photos        text[] not null default '{}',
  created_at    timestamptz not null default now()
);

create index grow_log_entries_log_idx on public.grow_log_entries (grow_log_id, entry_date);

-- ============================================================================
-- EVENTS (calendario)
-- ============================================================================
create table public.events (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  description text,
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  city        text,
  country     text not null default 'ES',
  location    geography(point, 4326),
  url         text,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index events_starts_at_idx on public.events (starts_at);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles            enable row level security;
alter table public.strains             enable row level security;
alter table public.clubs               enable row level security;
alter table public.forum_categories    enable row level security;
alter table public.forum_threads       enable row level security;
alter table public.forum_posts         enable row level security;
alter table public.votes               enable row level security;
alter table public.grow_logs           enable row level security;
alter table public.grow_log_entries    enable row level security;
alter table public.events              enable row level security;

-- Profiles: lectura pública, escritura solo el dueño
create policy "profiles read"   on public.profiles for select using (true);
create policy "profiles update" on public.profiles for update using (auth.uid() = id);

-- Strains: lectura pública, escritura solo admins/moderators
create policy "strains read"  on public.strains for select using (true);
create policy "strains write" on public.strains for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator')
  ))
  with check (exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator')
  ));

-- Clubs: lectura pública; insert por usuarios autenticados; update/delete por dueño o admin
create policy "clubs read"   on public.clubs for select using (true);
create policy "clubs insert" on public.clubs for insert with check (auth.uid() is not null);
create policy "clubs update" on public.clubs for update using (
  created_by = auth.uid() or exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator')
  )
);
create policy "clubs delete" on public.clubs for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator'))
);

-- Forum categories: read all, write admin
create policy "forum_categories read"  on public.forum_categories for select using (true);
create policy "forum_categories write" on public.forum_categories for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Forum threads: read all, write autores; mods pueden editar todo
create policy "forum_threads read"   on public.forum_threads for select using (true);
create policy "forum_threads insert" on public.forum_threads for insert with check (auth.uid() = author_id);
create policy "forum_threads update" on public.forum_threads for update using (
  author_id = auth.uid() or exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator')
  )
);
create policy "forum_threads delete" on public.forum_threads for delete using (
  author_id = auth.uid() or exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator')
  )
);

-- Forum posts: igual que threads
create policy "forum_posts read"   on public.forum_posts for select using (true);
create policy "forum_posts insert" on public.forum_posts for insert with check (auth.uid() = author_id);
create policy "forum_posts update" on public.forum_posts for update using (
  author_id = auth.uid() or exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator')
  )
);
create policy "forum_posts delete" on public.forum_posts for delete using (
  author_id = auth.uid() or exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator')
  )
);

-- Votes: read all, write solo el votante
create policy "votes read"   on public.votes for select using (true);
create policy "votes insert" on public.votes for insert with check (auth.uid() = user_id);
create policy "votes update" on public.votes for update using (auth.uid() = user_id);
create policy "votes delete" on public.votes for delete using (auth.uid() = user_id);

-- Grow logs: solo el dueño
create policy "grow_logs all"        on public.grow_logs        for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "grow_log_entries all" on public.grow_log_entries for all using (
  exists (select 1 from public.grow_logs where id = grow_log_id and user_id = auth.uid())
) with check (
  exists (select 1 from public.grow_logs where id = grow_log_id and user_id = auth.uid())
);

-- Events: read all, insert autenticados, update/delete dueño o admin
create policy "events read"   on public.events for select using (true);
create policy "events insert" on public.events for insert with check (auth.uid() is not null);
create policy "events update" on public.events for update using (
  created_by = auth.uid() or exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator')
  )
);
create policy "events delete" on public.events for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator'))
);

-- ============================================================================
-- SOCIAL FEED (muro social y likes)
-- ============================================================================
create table public.social_posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  content     text not null check (char_length(content) <= 500),
  media_urls  text[] not null default '{}',
  created_at  timestamptz not null default now()
);

create index social_posts_author_idx on public.social_posts (author_id, created_at desc);

create table public.social_likes (
  post_id     uuid not null references public.social_posts(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index social_likes_post_idx on public.social_likes (post_id);

alter table public.social_posts enable row level security;
alter table public.social_likes enable row level security;

-- Políticas social_posts: lectura pública, escritura solo el autor
create policy "social_posts read"   on public.social_posts for select using (true);
create policy "social_posts insert" on public.social_posts for insert with check (auth.uid() = author_id);
create policy "social_posts delete" on public.social_posts for delete using (auth.uid() = author_id);

-- Políticas social_likes: lectura pública, escritura solo el usuario
create policy "social_likes read"   on public.social_likes for select using (true);
create policy "social_likes insert" on public.social_likes for insert with check (auth.uid() = user_id);
create policy "social_likes delete" on public.social_likes for delete using (auth.uid() = user_id);


-- ============================================================================
-- SOCIAL FEED (comentarios y bookmarks)
-- ============================================================================

-- Comentarios
create table public.social_comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.social_posts(id) on delete cascade,
  author_id   uuid not null references public.profiles(id) on delete cascade,
  content     text not null check (char_length(content) <= 300),
  created_at  timestamptz not null default now()
);

create index social_comments_post_idx on public.social_comments (post_id, created_at asc);

alter table public.social_comments enable row level security;

create policy "social_comments read"   on public.social_comments for select using (true);
create policy "social_comments insert" on public.social_comments for insert with check (auth.uid() = author_id);
create policy "social_comments delete" on public.social_comments for delete using (auth.uid() = author_id);

-- Bookmarks (Publicaciones Guardadas)
create table public.social_bookmarks (
  post_id     uuid not null references public.social_posts(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index social_bookmarks_user_idx on public.social_bookmarks (user_id);

alter table public.social_bookmarks enable row level security;

create policy "social_bookmarks read"   on public.social_bookmarks for select using (auth.uid() = user_id);
create policy "social_bookmarks insert" on public.social_bookmarks for insert with check (auth.uid() = user_id);
create policy "social_bookmarks delete" on public.social_bookmarks for delete using (auth.uid() = user_id);


-- ============================================================================
-- STORAGE — políticas del bucket `social-photos` (Muro Social)
-- ============================================================================
-- El bucket `social-photos` debe crearse manualmente en Storage → New bucket
-- (público). Ver TODO_USUARIO.md. Estas políticas asumen que cada usuario sube
-- a una carpeta con su propio uid: `<auth.uid()>/<timestamp>-<rand>.<ext>`
-- (es el patrón que usa src/components/social/create-post-box.tsx).

-- Lectura pública: cualquiera puede ver las fotos del muro.
create policy "social-photos read"
  on storage.objects for select
  using ( bucket_id = 'social-photos' );

-- Subida: solo usuarios autenticados, y únicamente a su propia carpeta.
create policy "social-photos insert"
  on storage.objects for insert
  with check (
    bucket_id = 'social-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Borrado: cada usuario solo puede borrar sus propias fotos.
create policy "social-photos delete"
  on storage.objects for delete
  using (
    bucket_id = 'social-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );


