-- ShelfLife books table and per-user access policies.
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(title) <= 80 and char_length(btrim(title)) > 0),
  author text not null check (char_length(author) <= 60 and char_length(btrim(author)) > 0),
  pages integer not null check (pages between 1 and 5000),
  status text not null default 'To Read' check (status in ('To Read', 'Reading', 'Finished')),
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

create policy "Users can read their own books"
  on public.books for select to authenticated using (auth.uid() = user_id);
create policy "Users can add their own books"
  on public.books for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update their own books"
  on public.books for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own books"
  on public.books for delete to authenticated using (auth.uid() = user_id);

create index if not exists books_user_created_at_idx on public.books (user_id, created_at desc);
