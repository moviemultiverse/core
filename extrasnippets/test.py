from torrentp import TorrentDownloader
torrent_file = TorrentDownloader("magnet:?xt=urn:btih:db116c0cb2624832c9ade0f45aeaf638cc694c88&dn=%5BTenrai-Sensei%5D%20Demon%20Slayer%3A%20Swordsmith%20Village%20Arc%20Season%204%20%5BWeb%5D%5B1080p%5D%5BHEVC%2010bit%20x265%5D%5BDual%20Audio%5D%20Kimetsu%20no%20Yaiba%EA%9E%89%20Katanakaji%20no%20Sato-hen&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce", '.')
torrent_file.start_download()


import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

def upload_files_in_folder(folder_path, folder_id, credentials):
    drive_service = build('drive', 'v3', credentials=credentials)

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        
        if os.path.isfile(file_path):
            file_metadata = {'name': filename, 'parents': [folder_id]}
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

def main():
    credentials = service_account.Credentials.from_service_account_file('client_secrets.json', scopes=['https://www.googleapis.com/auth/drive.file'])
    
    folder_id = '15NnqIEGg6BtLZn2cfKjoCWirJnplfpm7'  # Replace with the target folder ID
    folder_path = 'Season 4/'  # Replace with the path to your folder containing files

    upload_files_in_folder(folder_path, folder_id, credentials)

if __name__ == '__main__':
    main()
