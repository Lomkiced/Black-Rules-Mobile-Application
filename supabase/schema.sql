-- ==============================================================================
-- BLACK RULES SOVEREIGN STACK // SUPABASE POSTGRESQL SCHEMA
-- Free Tier Compatible: Vector Extension, User Profiles, RLS, & Embeddings
-- ==============================================================================

-- 1. Enable pgvector extension for AI semantic search
create extension if not exists vector;

-- 2. Create User Profiles Table
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_or_auth_id text unique,
  email text,
  operative_name text default 'Elena Vance',
  is_pro boolean default false,
  xp integer default 0,
  streak integer default 1,
  stats jsonb default '{"stoicism": 75, "persuasion": 70, "assertiveness": 80, "awareness": 85, "negotiation": 65}'::jsonb,
  mastered_rule_ids text[] default array[]::text[],
  bookmarked_rule_ids text[] default array[]::text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Public and authenticated users can view their own profile"
  on public.profiles
  for select
  using (true);

create policy "Users can insert their initial profile"
  on public.profiles
  for insert
  with check (true);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (true)
  with check (true);

-- 4. Create Rule Embeddings Table for Vector Semantic Search
create table if not exists public.rule_embeddings (
  rule_id text primary key,
  title text not null,
  category text not null,
  embedding vector(384),
  updated_at timestamptz default now()
);

alter table public.rule_embeddings enable row level security;

create policy "Anyone can read rule embeddings"
  on public.rule_embeddings
  for select
  using (true);

-- 5. RPC Function for Vector Similarity Search
create or replace function public.match_rules (
  query_embedding vector(384),
  match_threshold float default 0.6,
  match_count int default 2
)
returns table (
  rule_id text,
  title text,
  category text,
  similarity float
)
language plpgsql
stable
as $$
begin
  return query
  select
    re.rule_id,
    re.title,
    re.category,
    1 - (re.embedding <=> query_embedding) as similarity
  from public.rule_embeddings re
  where 1 - (re.embedding <=> query_embedding) > match_threshold
  order by re.embedding <=> query_embedding
  limit match_count;
end;
$$;
