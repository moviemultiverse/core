import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Path to the service account key JSON file
KEY_PATH = 'client_secrets.json'

# File name to be deleted
FILE_NAME = 'example.txt'

# Authenticate with the Google Drive API using the service account key
credentials = service_account.Credentials.from_service_account_file(KEY_PATH, scopes=['https://www.googleapis.com/auth/drive'])
drive_service = build('drive', 'v3', credentials=credentials)

# Function to recursively search and delete files
def delete_files():
    query = f"name = '{FILE_NAME}'"
    response = drive_service.files().list(q=query, fields='files(id,name)').execute()
    files = response.get('files', [])
    
    for file in files:
        file_id = file['id']
        drive_service.files().delete(fileId=file_id).execute()
        print(f"Deleted file: {file['name']} ({file_id})")

# Start the deletion process
delete_files()
# README for bulk deleting files

