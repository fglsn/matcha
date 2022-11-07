create table users
(
	id bigserial primary key unique,
	username varchar not null unique,
	email varchar not null unique,
	password_hash varchar not null,
	firstname varchar not null,
	lastname varchar not null,
	is_active boolean not null default false,
	created_at timestamptz not null default now(),
	activation_code varchar not null unique
);

create table user_sessions
(
	session_id uuid default gen_random_uuid() primary key,
	user_id bigserial not null,
	username varchar not null,
	email varchar not null,
	expires_at timestamptz not null default now() + time '24:00'
);

create index user_sessions_user_id on user_sessions (user_id);