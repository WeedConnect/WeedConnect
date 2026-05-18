-- WeedConnect — Chat grupal en tiempo real (Fase 3)
-- Ejecutar en el SQL Editor de Supabase tras haber aplicado 0001_init.sql.

-- ============================================================================
-- CHAT MESSAGES
-- ============================================================================
create table public.chat_messages (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  content    text not null check (char_length(content) between 1 and 500),
  created_at timestamptz not null default now()
);

create index chat_messages_created_at_idx on public.chat_messages (created_at desc);

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.chat_messages enable row level security;

-- Lectura pública (cualquier visitante puede ver el historial)
create policy "chat_messages_select_all"
  on public.chat_messages for select
  using (true);

-- Solo usuarios autenticados pueden enviar mensajes propios
create policy "chat_messages_insert_own"
  on public.chat_messages for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ============================================================================
-- REALTIME — publicar INSERT en WebSocket
-- ============================================================================
alter publication supabase_realtime add table public.chat_messages;
