const axios = require('axios');

function getLinkByName() {
  const apiUrl = 'https://doodapi.com/api/file/list?key=49943w31dwl3crvaz1tui';
  const targetFileName = "Evildeadrise1080p";

  return axios.get(apiUrl)
    .then(response => {
      // Handle the response data here
      const data = response.data; // No need to parse, as Axios has already done it
      const files = data.result.files;
      for (const file of files) {
        if (file.title === targetFileName) { // Fixed variable name from 'targetName' to 'targetFileName'
          return file.download_url;
        }
      }
      return null; // Return null if the file with the given name is not found
    })
    .catch(error => {
      // Handle errors here
      console.error('Error:', error.message);
      return null; // Return null in case of an error
    });
}

getLinkByName()
  .then(link => {
    console.log(link);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
