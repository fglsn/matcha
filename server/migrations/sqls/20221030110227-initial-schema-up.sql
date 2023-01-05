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
	is_complete boolean not null default false,
	reports_count int not null default 0,
	fame_rating int not null default 40
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

-- create table matches (
-- 	matched_user_one bigserial not null,
-- 	matched_user_two bigserial not null,
-- 	primary key (matched_user_one, matched_user_two)
-- );

create table matches (
	match_id bigserial primary key,
	matched_user_one bigserial not null,
	matched_user_two bigserial not null,
	unique (matched_user_one, matched_user_two)
);

create table users_online (
	user_id bigserial not null,
	active bigint not null,
	primary key (user_id)
);

create table block_entries (
	blocked_user_id bigserial not null,
	blocking_user_id bigserial not null,
	primary key (blocked_user_id, blocking_user_id)
);

create table report_entries (
	reported_user_id bigserial not null,
	reporting_user_id bigserial not null,
	primary key (reported_user_id, reporting_user_id)
);

create table notification_entries (
	id bigserial primary key,
	notified_user_id bigserial not null,
	acting_user_id bigserial not null,
	type varchar not null
);

create table notifications_queue (
	id bigserial primary key,
	notified_user_id bigserial not null
);

create table chat_messages (
	message_id bigserial primary key,
	receiver_id bigserial not null,
	sender_id bigserial not null,
	message_text text not null,
	message_time timestamptz not null default now()
);

create table chat_notifications (
	id bigserial primary key,
	match_id bigserial not null,
	sender_id bigserial not null,
	receiver_id bigserial not null
);

create or replace function calculate_distance(lat1 double precision, lon1 double precision, lat2 double precision, lon2 double precision)
returns int as $dist$
	declare
		dist double precision = 0;
		radlat1 double precision;
		radlat2 double precision;
		theta double precision;
		radtheta double precision;
	begin
		if lat1 = lat2 and lon1 = lon2
			then return dist :: int;
		else
			radlat1 = pi() * lat1 / 180;
			radlat2 = pi() * lat2 / 180;
			theta = lon1 - lon2;
			radtheta = pi() * theta / 180;
			dist = sin(radlat1) * sin(radlat2) + cos(radlat1) * cos(radlat2) * cos(radtheta);

			if dist > 1 then dist = 1; end if;

			dist = acos(dist);
			dist = dist * 180 / pi();
			dist = dist * 60 * 1.1515 * 1.609344;

			if dist < 2 then dist = 2; end if;
			
			return floor(dist);
		end if;
	end;
$dist$ language plpgsql;

create function count_array_intersect(first anyarray, second anyarray)
	returns int as $res$
	declare
		res int;
	begin
		select array_length(array_agg(x), 1)
		into res
		from unnest(second) x
		where x = any (first);
		return coalesce(res, 0);
	end;
$res$ language plpgsql;
