const {google} = require('googleapis');
const fs = require('fs');



// Specify the ID of the file you want to add permissions to
const fileId = '1Jhd5m4cwefWZjTv_aSm7_H509Y8YBFhs';

// Define the permission to be created
const permission = {
  role: 'writer', // Can be 'owner', 'writer', 'commenter', or 'reader'
  type: 'user', // Can be 'user', 'group', 'domain', or 'anyone'
  emailAddress: 'saurabh45215@gmail.com', // Email address of the user or group
};

// Create a new JWT client using the service account credentials
const auth = new google.auth.GoogleAuth({credentials: '{"type": "service_account","project_id": "drive-download-389811","private_key_id": "1563f008c8825e9de067b9204cb9f254b8b4fb95","private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyLcvFgY3e3WYj\ngG+SzCi2r/DhiYjvkznm8r1yLuLVLMn7Bjxj2cSvk7jKs5SBEuICSRmohd7k7WBY\n5II+/hAOkhTX6Hgy6zTL5JIVdjEG4tXBHhssdDvlCRNbvdb8TuRXOvOs5cuGj735\nkOg/OaA709cotjSrPj7SzNrKpFxZicQv0BYe9D383HXmyOl2dCFx+P3ea2x7On/W\nvDVJ3CvsnzP9fF9ji1B+uSIUSiWgAAXQGkm9O7ncwQ49mgQmM/hWx9mE50EuwLno\nqQGOUktVWH1VN3QDKNhJKt5fRJrTIa6/r5xBVpSalkd95vY3nPe9MTKJtjWH0RnC\n+lolEAeVAgMBAAECggEACdVgXYrddSXjvRoEQ7Db9Ah97eXs27NU0CkS6Vzq52gf\nUJONnIF4Vav8gvFfb4fcLH3zeiXDQVVUH9Z4AA5+Uojfjh1AxFH5+gu9aoz5PopL\n0OqUBi4htRhSYW820M9w0jCed1W/rQeSAkFBVBCehiwWP+NdwPAAlcU5CP3XsULt\ntgeloKbIlneXIaEiEtThql9WxMGWQjANLtQPzLeVpAM8AHzlG/++pY4LGmM1VdIM\nAO+dfeXcxYYx/48nNnjzKP12UjEPJ+jqlv4/3r4NglTYxxBv6qcQJuWOSkDKhtNZ\nivJuJQ6IXfo41H7sSN8KaAfQEDkL9FAJYAap4axe2QKBgQDuvN7O7bIoumkSsXKE\nhne2WywywzrqOFyrHB69RAVjgRDUbLS53CXoCvenvqoJSqUTTBdP+Cas/TAKofQW\nvoM3zcGgN6UB/Il9x0OZFYkIbUw2604VAYz4oSPKc5dxNmhR/pca0daIseayMV7R\nUDVvtpKFydN8wuIIgpwhCIe+SQKBgQC/D/T9HQWS9lDaOX0hk5T5yL+na9QHnjOz\nS2wlFIQbH7VG4Kqn6dLwcxfwum1pXi5yK/14yvMQickFm2/YWfEmsk2ZgiaNwzNQ\nBo8QpeaxfQX5VJYPbVvbRVwHP0ETZCtCmq07+Sbe+EG5l8lvaC++fybkqXz9GqW0\nNuwa7JXu7QKBgQCYuk83xiyBja+Ge+qtCXEwQedmmiroiCIQfS7VGdzwqTLhEqIT\nfNjrN4jz0S/qPcyZKcaILFJhvJ+tTapfmoVLf9/s5Ww0dyBmTMHb/0DpGTL2t1X+\nbj2HGV9SNtydWpcmTV7Rk4hRbq4NNTRZZ5yn2P6nhFQ9rlb35saHA3QDsQKBgANe\nwK+GR4bkGWEACpkBBWuygs7tM/w+aiMLfYjZ58qisIvjgp8bnMDpBs8UOsHVC3Sw\nGfR7f/YWuBkFON/UFlDcbEn85bkybEFJHFTq2DrhPa28NDlpcGlZu9nU38z7w1eV\nauDX8DuWnXIsnzz71XvCumjmJHJCehHHtjpzWeGxAoGBAKEfmkOLRm2EJnkOPomu\nGlWkHDjCNT4iaz+ZtlYBF6zVmA3jHzjlPnzaOUhst7/BtxtAgRxQ4Y4Z1ddmdDT6\nCnfDE+uXFY6i2Nl7Bt1l8n7KQHJDa6kAwwIosiZo6gjrVife01JYfX5+qlChQLL1\nPMyuPXuCcZ7JERrwKzgvCEeK\n-----END PRIVATE KEY-----\n","client_email": "drivedownload@drive-download-389811.iam.gserviceaccount.com","client_id": "110870413695766637488","auth_uri": "https://accounts.google.com/o/oauth2/auth","token_uri": "https://oauth2.googleapis.com/token","auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/drivedownload%40drive-download-389811.iam.gserviceaccount.com","universe_domain": "googleapis.com"}',
  scopes: ['https://www.googleapis.com/auth/drive'],
});

// Authorize the client
const drive = google.drive({ version: 'v3', auth });

// Function to create the permission on the file
async function createPermission() {
  try {
    // Send the request to create the permission
    const response = await drive.permissions.create({
      fileId: fileId,
      requestBody: permission,
    });

    console.log('Permission created:', response.data);
  } catch (error) {
    console.error('Error creating permission:', error.message);
  }
}

// Call the function to create the permission
createPermission();

