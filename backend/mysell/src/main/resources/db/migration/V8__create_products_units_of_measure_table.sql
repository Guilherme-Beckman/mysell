CREATE TABLE products_units_of_measure_table(
	products_units_of_measure_id SERIAL PRIMARY KEY,
	quantity INT NOT NULL DEFAULT 0,
	unit_of_measure_id BIGINT
);