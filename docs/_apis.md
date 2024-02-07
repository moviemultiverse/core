<!-- _navbar.md -->

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