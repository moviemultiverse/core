var express = require('express');
var router = express.Router();



async function deleteMP4File(fileId) {
    try {
  
const SCOPES = ['https://www.googleapis.com/auth/drive'];
  
const credentials = require('../drive-download-389811-b229f2e27ed8.json');

  const authh = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    SCOPES
  );
  authh.authorize((err, tokens) => {
    if (err) {
      console.error('Authentication failed:', err);
      return;
    }
  
    console.log('Authentication successful!');
    
  });
  const drive = google.drive({ version: 'v3', auth: authh });
  
      // Delete the file
      await drive.files.delete({
        fileId: fileId,
      });
  
      console.log('File deleted successfully.');
    } catch (error) {
      console.error('Error deleting file:', error);
    }
}

router.deletefile = async function(req, res) {
    const file_id = req.query.file_id;
    const files = await deleteMP4File(file_id);
    res.json(files);
};




async function createrepopermission(file_id) {
  try {
    // Load thei  // Create an auth client using the service account credentials
    const authClient = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    // Authorize the client
    const auth = await authClient.getClient();

    // Specify the file ID, email address, and role for the permission
    const fileId = file_id;
    const role = 'writer';


    const drive = google.drive({ version: 'v3', auth: authClient });

    const permission = {
      role: role,
      type: 'anyone'
    };

    const response = await drive.permissions.create({
      fileId: fileId,
      requestBody: permission,
      fields: 'id'
    });
     console.log(`Permission created with ID: ${response.data.id}`);
     return response.data.id;
  } catch (error) {
    console.error('Error creating permission:', error);
  }
}
const createRepository = require('../createrepo.js');
router.createrepo = async function (req, res) {
  try {
    var file_id = req.query.fileid;
    await createrepopermission(file_id);
    res.json(createRepository(file_id , 0));
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during repository creation.' });
  }
};
/* used to create a repo with is_series = true config
app.get('/createreposeries', async function (req, res) {
  try {
    var file_id = req.query.fileid;
    await createrepopermission(file_id);
    res.json(createRepository(file_id , 1));
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during repository creation.' });
  }
});*/




async function getseriesfolder(folderId) {
  const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/drive']
  );

  const drive = google.drive({ version: 'v3', auth });

  try {
      const nameResponse = await drive.files.get({
          fileId: folderId,
          fields: 'name'
      });

      const childrenResponse = await drive.files.list({
          q: `'${folderId}' in parents and trashed = false`,
      });

      const folderName = nameResponse.data.name;
      const children = childrenResponse.data.files;

      return { folderName, children };
  } catch (error) {
      console.error("Error retrieving folder and children:", error.message);
      return null;
  }
}

router.createreposeries = async function (req, res) {
  try {
      const folderId = req.query.folderId; // Assuming you're passing folderId as a query parameter
      console.log('folderId', folderId);
      const result = await getseriesfolder(folderId);
      console.log('result', result);
      if (result) {
          const children = result.children;

          // Now you can use 'children' to perform subsequent actions
          for (const child of children) {
              await createrepopermission(child.id);
              await createRepository(child.id, 1);
          }

          // Extract the series name from the folder
          const seriesName = result.folderName;

          // Create the movie reference object
          const movieReference = {
              children: children.map(child => child.name.replace(/\.mp4$/, '')) // Remove ".mp4" from child names
          };
          console.log(movieReference);

          // Save the movie reference to the database
          const client = await pool.connect();
          const insertQuery = `
              INSERT INTO public.series(series_name, moviename_ref)
              VALUES ($1, $2);
          `;
          const values = [seriesName, JSON.stringify(movieReference)]; // Assuming your DB column expects JSON data
          await client.query(insertQuery, values);
          client.release();

          res.json({ message: 'Repository creation and database insertion completed successfully.' });
      } else {
          console.log("Folder not found or error occurred.");
          res.status(404).json({ error: 'Folder not found or error occurred.' });
      }
  } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({ error: 'An error occurred during repository creation and database insertion.' });
  }
};


module.exports = router;