import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

def main():
    credentials = service_account.Credentials.from_service_account_file('client_secrets.json', scopes=['https://www.googleapis.com/auth/drive.file'])
    drive_service = build('drive', 'v3', credentials=credentials)

    folder_id = '15NnqIEGg6BtLZn2cfKjoCWirJnplfpm7'  # Replace with the target folder ID

    file_path = 'randomfile.mp4'  # Replace with the path to your file

    file_metadata = {'name': os.path.basename(file_path), 'parents': [folder_id]}
    media = MediaFileUpload(file_path, resumable=True)

    try:
        file = drive_service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()

        print(f'File uploaded. ID: {file["id"]}')

    except Exception as e:
        print(f'Error occurred during file upload: {str(e)}')

if __name__ == '__main__':
    main()
        
#TODO
#media = MediaFileUpload('pig.png', mimetype='image/png', resumable=True)
#request = farm.animals().insert(media_body=media, body={'name': 'Pig'})
#response = None
#while response is None:
#  status, response = request.next_chunk()
#  if status:
#    print "Uploaded %d%%." % int(status.progress() * 100)
#print "Upload Complete!"
