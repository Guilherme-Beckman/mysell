ALTER TABLE units_of_measure_table
    ALTER COLUMN name SET NOT NULL;

ALTER TABLE categories
    ALTER COLUMN name SET NOT NULL;
