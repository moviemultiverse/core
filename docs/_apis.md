<!-- _navbar.md -->

## Api Public Endpoints
```
.get('/deletefile') with query param file_id(drive)
.get('/workflow') with query param workflowrepo(github reponame)
.get('/createrepo') with query param file_id(drive)
.get('/createreposeries') with query param folderId(drive)
.get('/getfiles') returns total files owned by service account
.get('/getvidfiles') returns total vid files owned by service account
.get('/getmappeddata')(check if github exists for file in drive){mutant of getvidfiles}
.get('/noti') with query param url (domain/post)
.get('/movie_data') get movie_data from database
.get('/api') with query param id && fileid (share file with user from service account)
.get('/login')(general login working...)
.get('/size')(size of the movie heap)
.get('/get_telecore_data')(get telegram document via mongodb)
```

# Movie API

The Movie API provides information about movies and series. It allows users to query for details about specific movies, series, and perform various operations.

## Getting Started

To get started, ensure you have the required environment variables set up in a `.env` file. These variables include `DB_URI`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USER`, and `DB_PASSWORD`.

## API Endpoints

### Query Endpoints

#### 1. Get Movie Details

Get details about a specific movie.

- **Endpoint:**
  - `GET /movie/:movie_name`

- **Example Request:**
  ```graphql
  query {
    movie(movie_name: "Inception") {
      _id
      drive_code
      movie_name
      size_mb
      streamtape_code
      doodstream_code
      is_series
      img_data
      is_reported
      telegram
    }
  }
// TODO





















* Getting started

  * [Quick start](quickstart.md)
  
  * workflow
   >workflow
  
  * size
   >size
  
  * getvidfiles
   >getvidfiles
  
  * getfiles
   >getfiles
   
  * getrepo
   >getrepo
  
  * deletefile
   >deletefile
  
  * artifact
   >artifact
  
  * getmappeddata
   >getmappeddata
