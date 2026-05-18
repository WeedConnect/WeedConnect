-- WeedConnect — Motor de Gamificación (Fase 3)
-- Triggers PL/pgSQL que actualizan public.profiles.points automáticamente.
-- Ejecutar en el SQL Editor de Supabase después de 0001_init.sql.
--
-- Regla de seguridad: todas las funciones son SECURITY DEFINER para poder
-- actualizar profiles.points saltando RLS (el owner del perfil no es quien
-- ejecuta el trigger en operaciones de moderación o cascada).

-- ============================================================================
-- FUNCIÓN AUXILIAR: sumar/restar puntos sin bajar de 0
-- ============================================================================
create or replace function public.adjust_points(p_user_id uuid, p_delta integer)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  update public.profiles
     set points = greatest(0, points + p_delta)
   where id = p_user_id;
end;
$$;

-- ============================================================================
-- 1. HILOS DEL FORO  (+15 INSERT / -15 DELETE)
-- ============================================================================
create or replace function public.trg_points_forum_threads()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    perform public.adjust_points(NEW.author_id, 15);
  elsif TG_OP = 'DELETE' then
    perform public.adjust_points(OLD.author_id, -15);
  end if;
  return coalesce(NEW, OLD);
end;
$$;

create trigger gamification_forum_threads
  after insert or delete on public.forum_threads
  for each row execute function public.trg_points_forum_threads();

-- ============================================================================
-- 2. RESPUESTAS DEL FORO  (+5 INSERT / -5 DELETE)
-- ============================================================================
create or replace function public.trg_points_forum_posts()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    perform public.adjust_points(NEW.author_id, 5);
  elsif TG_OP = 'DELETE' then
    perform public.adjust_points(OLD.author_id, -5);
  end if;
  return coalesce(NEW, OLD);
end;
$$;

create trigger gamification_forum_posts
  after insert or delete on public.forum_posts
  for each row execute function public.trg_points_forum_posts();

-- ============================================================================
-- 3. MURO SOCIAL  (+10 INSERT / -10 DELETE)
-- ============================================================================
create or replace function public.trg_points_social_posts()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    perform public.adjust_points(NEW.author_id, 10);
  elsif TG_OP = 'DELETE' then
    perform public.adjust_points(OLD.author_id, -10);
  end if;
  return coalesce(NEW, OLD);
end;
$$;

create trigger gamification_social_posts
  after insert or delete on public.social_posts
  for each row execute function public.trg_points_social_posts();

-- ============================================================================
-- 4. COMENTARIOS SOCIALES  (+5 INSERT / -5 DELETE)
-- ============================================================================
create or replace function public.trg_points_social_comments()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    perform public.adjust_points(NEW.author_id, 5);
  elsif TG_OP = 'DELETE' then
    perform public.adjust_points(OLD.author_id, -5);
  end if;
  return coalesce(NEW, OLD);
end;
$$;

create trigger gamification_social_comments
  after insert or delete on public.social_comments
  for each row execute function public.trg_points_social_comments();

-- ============================================================================
-- 5. CULTIVOS  (+20 INSERT / -20 DELETE)
-- ============================================================================
create or replace function public.trg_points_grow_logs()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    perform public.adjust_points(NEW.user_id, 20);
  elsif TG_OP = 'DELETE' then
    perform public.adjust_points(OLD.user_id, -20);
  end if;
  return coalesce(NEW, OLD);
end;
$$;

create trigger gamification_grow_logs
  after insert or delete on public.grow_logs
  for each row execute function public.trg_points_grow_logs();

-- ============================================================================
-- 6. ENTRADAS DE CULTIVO  (+10 INSERT / -10 DELETE)
-- grow_log_entries no tiene user_id → JOIN hacia grow_logs para obtenerlo.
-- El JOIN se hace con la fila que todavía existe en ambos casos (INSERT: NEW,
-- DELETE: la fila del padre sigue existiendo porque la FK es ON DELETE CASCADE
-- y el padre aún no se ha borrado; si el padre ya no existe, v_user_id será
-- NULL y la función simplemente no hace nada).
-- ============================================================================
create or replace function public.trg_points_grow_log_entries()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_user_id uuid;
begin
  if TG_OP = 'INSERT' then
    select user_id into v_user_id
      from public.grow_logs
     where id = NEW.grow_log_id;
    if v_user_id is not null then
      perform public.adjust_points(v_user_id, 10);
    end if;

  elsif TG_OP = 'DELETE' then
    select user_id into v_user_id
      from public.grow_logs
     where id = OLD.grow_log_id;
    if v_user_id is not null then
      perform public.adjust_points(v_user_id, -10);
    end if;
  end if;

  return coalesce(NEW, OLD);
end;
$$;

create trigger gamification_grow_log_entries
  after insert or delete on public.grow_log_entries
  for each row execute function public.trg_points_grow_log_entries();

-- ============================================================================
-- 7. VOTOS  (+2 INSERT / -2 DELETE)
-- ============================================================================
create or replace function public.trg_points_votes()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    perform public.adjust_points(NEW.user_id, 2);
  elsif TG_OP = 'DELETE' then
    perform public.adjust_points(OLD.user_id, -2);
  end if;
  return coalesce(NEW, OLD);
end;
$$;

create trigger gamification_votes
  after insert or delete on public.votes
  for each row execute function public.trg_points_votes();

-- ============================================================================
-- 8. COMPLETAR PERFIL - AVATAR (+15 al añadir avatar, -15 al quitarlo)
-- Modifica NEW.points directamente para evitar recursión infinita de triggers.
-- ============================================================================
create or replace function public.trg_points_profile_avatar()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_had_avatar boolean;
  v_has_avatar boolean;
begin
  v_had_avatar := (OLD.avatar_url is not null and OLD.avatar_url <> '');
  v_has_avatar := (NEW.avatar_url is not null and NEW.avatar_url <> '');

  if not v_had_avatar and v_has_avatar then
    -- Añadió avatar por primera vez
    NEW.points := greatest(0, NEW.points + 15);
  elsif v_had_avatar and not v_has_avatar then
    -- Quitó el avatar
    NEW.points := greatest(0, NEW.points - 15);
  end if;

  return NEW;
end;
$$;

create trigger gamification_profile_avatar
  before update of avatar_url on public.profiles
  for each row execute function public.trg_points_profile_avatar();

