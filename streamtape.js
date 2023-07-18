const axios = require('axios');

function getLinkByName() {
  const apiUrl = 'https://api.streamtape.com/file/listfolder?login=f65b540c475b9b7d4da8&key=268XaKDBLqTZ2kg';
  const targetFileName = "Fast_iX.mp4";

  return axios.get(apiUrl)
    .then(response => {
      // Handle the response data here
      const data = response.data; // No need to parse, as Axios has already done it
      const files = data.result.files;
      for (const file of files) {
        if (file.name === targetFileName) { // Fixed variable name from 'targetName' to 'targetFileName'
          return file.link;
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
