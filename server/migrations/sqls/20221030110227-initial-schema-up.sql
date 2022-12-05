create table users
(
	id bigserial primary key,
	username varchar not null unique,
	email varchar not null unique,
	password_hash varchar not null,
	firstname varchar not null,
	lastname varchar not null,
	lat double precision not null,
	lon double precision not null,
	location_string varchar not null default '',
	is_active boolean not null default false,
	created_at timestamptz not null default now(),
	activation_code varchar not null unique,
	birthday date,
	gender varchar,
	orientation varchar,
	bio varchar,
	tags varchar [],
	is_complete boolean not null default false
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

create table password_reset_requests
(
	token uuid default gen_random_uuid() primary key,
	user_id bigserial not null,
	expires_at timestamptz not null default now() + time '06:00'
);

create index password_reset_requests_user_id on password_reset_requests (user_id);

create table update_email_requests
(
	token uuid default gen_random_uuid() primary key,
	user_id bigserial not null,
	email varchar not null,
	expires_at timestamptz not null default now() + time '06:00'
);

create index update_email_requests_user_id on update_email_requests (user_id);

create table photos (
	id bigserial primary key,
	photo_type varchar not null,
	photo varchar not null,
	user_id bigserial not null
);

create index photos_user_id on photos (user_id);

create table visit_history (
	visited_user_id bigserial not null,
	visitor_user_id bigserial not null,
	primary key (visited_user_id, visitor_user_id)
);

create table likes_history (
	liked_user_id bigserial not null,
	liking_user_id bigserial not null,
	primary key (liked_user_id, liking_user_id)
);

create table matches (
	matched_user_one bigserial not null,
	matched_user_two bigserial not null,
	primary key (matched_user_one, matched_user_two)
);

create table users_online (
	user_id bigserial not null,
	active bigint not null,
	primary key (user_id)
);
