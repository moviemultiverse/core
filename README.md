I'm using macOS/Linux, the solution that works for me is

npx nodemon index.js 
##Used resources:

https://developers.google.com/drive/api/quickstart/nodejs

https://developers.google.com/drive/api/v3/reference

https://bretcameron.medium.com/how-to-use-the-google-drive-api-with-javascript-57a6cc9e5262

https://cloud.google.com/nodejs/docs/reference/google-auth-library/latest

https://developers.google.com/identity/gsi/web/guides/personalized-button

https://github.com/TeemuKoivisto/google-oauth-drive-example



DATABASE FOR USERS
CREATE TABLE users_login_dark_matter (
    name VARCHAR(255),
    email VARCHAR(255) PRIMARY KEY ,
    picture VARCHAR(255),
);

INSERT INTO users (name, email,picture) VALUES ($1, $2 ,$3 );
