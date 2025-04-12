CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    users_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    email_validated BOOLEAN DEFAULT false NOT NULL,
    role VARCHAR(25) DEFAULT 'USER' NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    categories_id SERIAL PRIMARY KEY,
    gpc_code INT UNIQUE,
    name VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS brick_codes(
	brick_codes_id BIGINT PRIMARY KEY,
	gpc_code INT NOT NULL 
);
CREATE TABLE IF NOT EXISTS units_of_measure (
    units_of_measure_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS products_units_of_measure (
    products_units_of_measure_id SERIAL PRIMARY KEY,
    quantity DOUBLE PRECISION DEFAULT 0 NOT NULL,
    unit_of_measure_id BIGINT DEFAULT 1 NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
    products_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category_id BIGINT DEFAULT 1 NOT NULL,
    purchased_price DOUBLE PRECISION NOT NULL,
    price_to_sell DOUBLE PRECISION NOT NULL,
    brand VARCHAR(100) DEFAULT 'NONE' NOT NULL,
    user_id UUID,
    product_unit_of_measure_id BIGINT DEFAULT 1 NOT NULL
);

CREATE TABLE IF NOT EXISTS sells (
    sells_id SERIAL PRIMARY KEY,
    quantity BIGINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id UUID NOT NULL,
    product_id BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
    events_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    color VARCHAR(50) NOT NULL,
    favorite BOOLEAN DEFAULT false NOT NULL,
    user_id UUID NOT NULL
);


CREATE TABLE IF NOT EXISTS sells_by_products (
    sells_by_products_id SERIAL PRIMARY KEY,
    sale_count BIGINT,
    profit DOUBLE PRECISION,
	gross_revenue DOUBLE PRECISION,
    product_id BIGINT,
    daily_report_id BIGINT
);

CREATE TABLE IF NOT EXISTS daily_reports (
	daily_reports_id SERIAL PRIMARY KEY,
    date DATE, 
    profit DOUBLE PRECISION,
    gross_revenue DOUBLE PRECISION,
    number_of_sales BIGINT,
    user_id UUID
);
CREATE TABLE IF NOT EXISTS weekly_reports (
    weekly_reports_id BIGSERIAL PRIMARY KEY,
    first_day DATE NOT NULL,
    last_day DATE NOT NULL,
    profit DOUBLE PRECISION,
    gross_revenue DOUBLE PRECISION,
    number_of_sales BIGINT,
    user_id UUID
);
