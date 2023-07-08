import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import requests

def call_url_with_params(url, params):
    response = requests.get(url, params=params)
    # Check the response status code
    if response.status_code == requests.codes.ok:
        return response.text
    else:
        return f"Request failed with status code {response.status_code}"

def main():
    credentials = service_account.Credentials.from_service_account_file('client_secrets.json', scopes=['https://www.googleapis.com/auth/drive.file'])
    drive_service = build('drive', 'v3', credentials=credentials)

    folder_id = '13cPqUdKzJM4vuYX-GD0YvhtZgvZNa1aF'  # Replace with the target folder ID

    file_path = 'strangerthingss01e02.mp4'  # Replace with the path to your file

    file_metadata = {'name': os.path.basename(file_path), 'parents': [folder_id]}
    media = MediaFileUpload(file_path)

    file = drive_service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id'
    ).execute()

    print(f'File uploaded. ID: {file["id"]}')
    url = 'https://google-06xl.onrender.com/driveupdate'
    params = {'name': file_path, 'id': file["id"]}
    response_text = call_url_with_params(url, params)
    print(response_text)

if __name__ == '__main__':
    main()
    