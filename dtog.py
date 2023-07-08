from google.oauth2 import service_account
from googleapiclient.discovery import build
import io
from googleapiclient.http import MediaIoBaseDownload
import os

# Path to the service account JSON key file
key_file_path = 'client_secrets.json'

# ID of the file you want to download
file_id = '1wW7M1fqTe6WvTHM9xo8q1Rxk3aw9GW1B'

# Destination folder to save the downloaded file
destination_folder ='/home/runner/work/my-new-repo/my-new-repo/'

# Authenticate with the service account
credentials = service_account.Credentials.from_service_account_file(key_file_path, scopes=['https://www.googleapis.com/auth/drive'])

# Build the Drive API client
drive_service = build('drive', 'v3', credentials=credentials)

# Request the file metadata
file_metadata = drive_service.files().get(fileId=file_id).execute()

# Get the original filename
original_filename = file_metadata['name']

# Construct the destination path
destination_path = os.path.join(destination_folder, "input.mp4")

# Create a writable file stream
file_stream = io.FileIO(destination_path, mode='wb')

# Download the file
request = drive_service.files().get_media(fileId=file_id)
media_request = MediaIoBaseDownload(file_stream, request)

done = False
while done is False:
    # Download the file in chunks
    _, done = media_request.next_chunk()

# Close the file stream
file_stream.close()

print(f'Successfully downloaded the file to: {destination_path}')

