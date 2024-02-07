## DATABASE FOR USERS
```SQL
CREATE TABLE users_login_dark_matter (
    name VARCHAR(255),
    email VARCHAR(255) PRIMARY KEY ,
    picture VARCHAR(255),
);
-- Set the starting value of the sequence to 10
ALTER SEQUENCE idd RESTART WITH 10;

ALTER TABLE your_table_name
ADD PRIMARY KEY (your_column_name);


SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'moviedata' AND constraint_type = 'PRIMARY KEY';
ALTER TABLE moviedata  DROP CONSTRAINT moviedata_pkey;

INSERT INTO users_login_dark_matter (name, email,picture) VALUES ($1, $2 ,$3 );
```