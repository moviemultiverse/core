from google.oauth2 import service_account
from googleapiclient.discovery import build
import io
from googleapiclient.http import MediaIoBaseDownload
import os

# Path to the service account JSON key file
key_file_path = 'client_secrets.json'
file_id = '18FVpRnYxto5hv9nHOXGKDDL03MjV9fmE'
destination_folder ='/home/runner/work/AvengersAgeofUltron/AvengersAgeofUltron/'
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

def rename_file(old_name, new_name):
    try:
        os.rename(old_name, new_name)
        print("File renamed successfully.")
    except FileNotFoundError:
        print("File not found.")
    except OSError as e:
        print(f"Error occurred: {e}")

os.remove(".github/workflows/dtog.yml")
rename_file( ".github/workflows/gtod.ymml" , ".github/workflows/gtod.yml")


    
    
