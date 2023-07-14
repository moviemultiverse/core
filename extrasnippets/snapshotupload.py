import os
from googleapiclient.discovery import build
from google.oauth2 import service_account

# Load the service account credentials
credentials = service_account.Credentials.from_service_account_file(
    'client_secrets.json',
    scopes=['https://www.googleapis.com/auth/drive']
)

# Create a Google Drive service client
drive_service = build('drive', 'v3', credentials=credentials)

# Folder ID in Google Drive where the images will be uploaded
folder_id = '1Nk_Ni2Ja2AU0djwy4Io-ISHGRoR8Ktkt'

# Path to the folder containing the images
folder_path = 'snapshots'

# Iterate over the files in the folder
for filename in os.listdir(folder_path):
    if filename.endswith('.jpg') or filename.endswith('.png'):
        # Create the metadata for the file
        file_metadata = {
            'name': filename,
            'parents': [folder_id]
        }

        # Upload the file to Google Drive
        media = drive_service.files().create(
            body=file_metadata,
            media_body=folder_path + '/' + filename
        ).execute()

        print('Uploaded:', filename)
