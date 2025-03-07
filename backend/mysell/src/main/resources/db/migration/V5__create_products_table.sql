CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category_id BIGINT,
    purchased_price DOUBLE PRECISION,
    price_to_sell DOUBLE PRECISION,
    brand VARCHAR(100),
    user_id UUID REFERENCES users(id),
    product_unit_of_measure_id BIGINT
);
