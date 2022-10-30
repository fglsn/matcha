create table users
(
	id bigserial primary key,
	username varchar not null unique,
	email varchar not null unique,
	password_hash varchar not null,
	firstname varchar not null,
	surname varchar not null,
	created_at timestamptz not null default now()
);
