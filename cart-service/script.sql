CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS carts (
	id uuid not null default uuid_generate_v4() primary key,
	created_at timestamp not null default now(),
	updated_at timestamp not null default now()
)

-- DROP TABLE carts;


CREATE TABLE IF NOT EXISTS cart_items (
	cart_id uuid not null references carts(id),
 	product_id uuid not null,
 	count int4 not null default 0,
)

-- DROP TABLE cart_items;

INSERT INTO carts (id) VALUES
('d7327de5-19e4-426d-a2ee-0a8f6fc7dd59');

INSERT INTO cart_items (cart_id, product_id, count) VALUES
('d7327de5-19e4-426d-a2ee-0a8f6fc7dd59', '488b3a9f-fce6-4475-8dfd-d96509c68c52', 4),
('d7327de5-19e4-426d-a2ee-0a8f6fc7dd59', 'bb63f3d0-0c77-43e1-b8eb-60407b8622f9', 2);