ALTER TABLE products
    ADD CONSTRAINT fk_category FOREIGN KEY (category_id)
    REFERENCES categories(categories_id);

ALTER TABLE products
    ADD CONSTRAINT fk_products_units_of_measure FOREIGN KEY (product_unit_of_measure_id)
    REFERENCES products_units_of_measure(products_units_of_measure_id);

ALTER TABLE products
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id)
    REFERENCES users(users_id);

ALTER TABLE products_units_of_measure
    ADD CONSTRAINT fk_units_of_measure FOREIGN KEY (unit_of_measure_id)
    REFERENCES units_of_measure(units_of_measure_id);
