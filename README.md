# Dark Matter
A platform to store movies at mega large scale
## Start Command
```javascript
npx nodemon index.js 
```
## Used resources:

https://developers.google.com/drive/api/quickstart/nodejs
https://developers.google.com/drive/api/v3/reference
https://bretcameron.medium.com/how-to-use-the-google-drive-api-with-javascript-57a6cc9e5262
https://cloud.google.com/nodejs/docs/reference/google-auth-library/latest
https://developers.google.com/identity/gsi/web/guides/personalized-button
https://github.com/TeemuKoivisto/google-oauth-drive-example

## Api Public Endpoints
```
.get('/deletefile') with query param file_id(drive)
.get('/workflow') with query param workflowrepo(github reponame)
.get('/createrepo') with query param file_id(drive)
.get('/getfiles') returns total files owned by service account
.get('/getvidfiles') returns total vid files owned by service account
.get('/getmappeddata')(check if github exists for file in drive){mutant of getvidfiles}
.get('/noti') with query param url (domain/post)
.get('/movie_data') get movie_data from database
.get('/api') with query param id && fileid (share file with user from service account)
.get('/login')(general login working...)
```
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