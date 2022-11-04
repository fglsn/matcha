create table users
(
	id bigserial primary key,
	username varchar not null unique,
	email varchar not null unique,
	password_hash varchar not null,
	firstname varchar not null,
	lastname varchar not null,
	is_active boolean not null default false,
	created_at timestamptz not null default now(),
	activation_code varchar not null unique
);
