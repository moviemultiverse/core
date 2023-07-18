  const axios = require('axios');
function getLinkByName() {

const apiUrl = 'https://api.streamtape.com/file/listfolder?login=f65b540c475b9b7d4da8&key=268XaKDBLqTZ2kg';
const targetFileName = "Fast_iX.mp4";

axios.get(apiUrl)
  .then(response => {
    // Handle the response data here
    console.log('Response data:', response.data);

  const data = JSON.parse(response.data); // Parse the JSON data into a JavaScript object
  const files = data.result.files;
  for (const file of files) {
    if (file.name === targetName) {
      return file.link;
    }
  }
  })
  .catch(error => {
    // Handle errors here
    console.error('Error:', error.message);
  });
  return null; // Return null if the file with the given name is not found
}

const link = getLinkByName();
console.log(link);
