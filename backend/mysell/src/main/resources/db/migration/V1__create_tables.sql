CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    users_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    email_validated BOOLEAN DEFAULT false NOT NULL,
    role VARCHAR(10) DEFAULT 'USER' NOT NULL
);

CREATE TABLE categories (
    categories_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE units_of_measure (
    units_of_measure_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE products_units_of_measure (
    products_units_of_measure_id SERIAL PRIMARY KEY,
    quantity INT DEFAULT 0 NOT NULL,
    unit_of_measure_id BIGINT DEFAULT 1 NOT NULL
);

CREATE TABLE products (
    products_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category_id BIGINT DEFAULT 1 NOT NULL ,
    purchased_price DOUBLE PRECISION NOT NULL,
    price_to_sell DOUBLE PRECISION NOT NULL,
    brand VARCHAR(100) DEFAULT 'NONE' NOT NULL ,
    user_id UUID,
    product_unit_of_measure_id BIGINT DEFAULT 1 NOT NULL
);
