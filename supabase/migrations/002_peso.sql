-- Peso (kg) usado em cada série. Rode uma vez no SQL Editor do Supabase.
alter table session_sets
  add column if not exists weight numeric(6, 2) check (weight >= 0);
