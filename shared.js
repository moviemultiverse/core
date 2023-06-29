const fetch = require('node-fetch');
const fs = require('fs');
const file = "https://drive.google.com/file/d/1wW7M1fqTe6WvTHM9xo8q1Rxk3aw9GW1B/view";
const urls = [
  'https://api.streamsb.com/api/upload/url?key=46443yy1674fu5ych9iq0&url=',
  'https://doodapi.com/api/upload/url?key=49943w31dwl3crvaz1tui&url=',
  'https://upstream.to/api/upload/url?key=55196gnvzsjuwpss4ea1y&url=',
  'https://api.streamtape.com/remotedl/add?login=f65b540c475b9b7d4da8&key=268XaKDBLqTZ2kg&url='
];

const fetchResponses = async () => {
  const responses = [];
  
  for (const url of urls) {
    try {
      const fullUrl = url.concat(file);
      const response = await fetch(fullUrl);
      const data = await response.json();
      responses.push(data);
    } catch (error) {
      console.log(`Error fetching ${url}:`, error);
      responses.push(null);
    }
  }
  
  return responses;
};

fetchResponses()
  .then(responses => {
    console.log('Responses:', responses);
    // Do something with the responses
  })
  .catch(error => {
    console.log('Error:', error);
  });
