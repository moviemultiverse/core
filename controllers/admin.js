var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});


async function searchRepositories(username, token) {
  const apiUrl = `https://api.github.com/search/repositories?q=user:${username}`;
  const headers = {
    Authorization: `token ${token}`,
  };

  try {
    const response = await axios.get(apiUrl, { headers });
    return response.data.items.map((repo) => repo.name);
  } catch (error) {
    console.error('Error fetching repositories:', error.message);
    return [];
  }
}

async function getvidFiles() {
  try {
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/drive']
    );

    const drive = google.drive({ version: 'v3', auth });
    const response = await drive.files.list({
      q: "mimeType='video/mp4' or mimeType='video/x-matroska'",
    });

    const mp4Files = response.data.files;

    if (mp4Files.length) {
      // console.log(mp4Files);
      return mp4Files;
    } else {
      console.log('No mp4 files found');
      return [];
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

router.workflow = async function(req, res) {
    const workflowrepo = req.query.workflowrepo;
    const rerunworkflow = require('../rerunworkflows.js');
    const files = await rerunworkflow(workflowrepo);
    res.json(files);
  };
  /*
  app.get('/sharefile', async function(req, res) {
    const file_id = req.query.file_id;
    const files = await fetchResponses(file_id);
    res.json(files);
  });*/
router.deletefile =  async function(req, res) {
    const file_id = req.query.file_id;
    const files = await deleteMP4File(file_id);
    res.json(files);
  };
  
  router.artifact = async (req , res) => {
  const getWorkflowArtifacts = require('../artifact.js'); 
    var reponame = req.query.reponame;
  res.json(await getWorkflowArtifacts(reponame));
  };
  
  async function getfiles() {
    try {
      const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/drive']
      );
  
      const drive = google.drive({ version: 'v3', auth });
      const response = await drive.files.list({});
      const files = response.data.files;
  
      if (files.length) {
       // console.log(files);
        return files;
      } else {
        console.log('No files found');
        return [];
      }
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
  
  router.getfiles = async (req, res) => {
    try {
      const files = await getfiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  router.getvidfiles = async (req, res) => {
    try {
      const files = await getvidFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  router.size = (req, res) => {
    var movie = req.query.movie;
    pool.query('SELECT SUM(size_mb) as total_size FROM moviedata', (error, results) => {
      if (error) {
        console.error('Error executing query', error);
        res.status(500).send('Error retrieving data');
      } else {
        // `results.rows` will contain an array with a single object
        // representing the sum of the 'size_mb' column as 'total_size'.
        // We can extract it and send it in the response.
        const totalSize = results.rows[0].total_size;
        res.json({ totalSize });
      }
    });
  };
  async function Mappeddata(jsonFiles, fileNamesArray) {
    const resultMap = {};
  
    for (const file of jsonFiles) {
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, ''); // Remove .mp4 extension
      const found = fileNamesArray.includes(fileNameWithoutExtension);
      resultMap[fileNameWithoutExtension] = found;
    }
  
    // Convert resultMap to JSON using JSON.stringify()
    const resultMapJSON = JSON.stringify(resultMap);
  
    return resultMapJSON;
  }
  
function addDataToJSON(mainJSON, newDataJSON) {
  for (const newDataObj of newDataJSON) {
    for (const name in newDataObj) {
      const matchingData = mainJSON.find((data) => data.name.replace(/\.[^/.]+$/, '') === name);
      if (matchingData) {
        matchingData.check = newDataObj[name];
      }
    }
  }
  return mainJSON;
}


  router.getmappeddata = async function(req, res) {
    try {
      const files = await getvidFiles();
      const repos = await searchRepositories("ss08090", githubToken);
      const result = await Mappeddata(files, repos);
      try{
      const updatedJSON = addDataToJSON(files, [JSON.parse(result)]);
      res.json(updatedJSON);
      }
      catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "An error occurred" });
    }
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "An error occurred" });
    }
  };
  
  router.getrepo = async (req, res) => {
    searchRepositories("ss08090", githubToken)
  .then((repos) => {
    //console.log( repos);
    res.json(repos);
  })
  .catch((err) => {
    console.error('Error:', err);
  });
};





module.exports = router;