import psycopg2
import cv2
import os
import random
from googleapiclient.discovery import build
from google.oauth2 import service_account
from googleapiclient.http import MediaFileUpload 

def snapshot_random_frames(video_path, num_frames, output_dir):
    # Open the video file
    video = cv2.VideoCapture(video_path)
    
    # Get the total number of frames in the video
    total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    
    # Generate random frame indices
    frame_indices = random.sample(range(total_frames), num_frames)
    
    # Read the video and save the selected frames
    for frame_index in frame_indices:
        # Set the frame index
        video.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
        
        # Read the frame
        ret, frame = video.read()
        
        # Check if the frame was successfully read
        if ret:
            # Generate a unique filename for the frame
            output_path = f'{output_dir}/frame_{frame_index}.jpg'
            
            # Save the frame as an image
            cv2.imwrite(output_path, frame)
            print(f'Saved frame {frame_index} as {output_path}')
    
    # Release the video object
    video.release()

# Example usage
video_path = 'randomfile.mp4'
num_frames = 8
output_dir = 'snapshots'
file_ids = {}


def upload_images_to_google_drive(credentials_path, folder_path, folder_id):
    # Load the service account credentials
    creds = service_account.Credentials.from_service_account_file(credentials_path, scopes=['https://www.googleapis.com/auth/drive'])

    
    # Build the Drive API
    drive_service = build('drive', 'v3', credentials=creds)
    
    # Iterate over the files in the specified folder
    for file_name in os.listdir(folder_path):
        if file_name.lower().endswith('.jpg'):  # Only process JPG images
            image_path = os.path.join(folder_path, file_name)
            file_metadata = {
                'name': file_name,  # Use the same name for the file in Google Drive
                'parents': [folder_id],
            }
            media = MediaFileUpload(image_path, resumable=True)
            file = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()
            file_id = file.get('id')
            print(f'Successfully uploaded {file_name} to Google Drive. File ID: {file_id}')
            file_ids[file_name] = file_id

    #return file_ids




db_params = {
    "host": "satao.db.elephantsql.com",
    "port": 5432,
    "database": "iywyfbqc",
    "user": "iywyfbqc",
    "password": "qAGx55jepOzWXVmB2IZxn-F-rulL3zRR"
}
connection = psycopg2.connect(**db_params)
cursor = connection.cursor()
toxic = re.sub(r'\.mp4$', '', video_path)
update_query = """
    UPDATE moviedata 
    SET img_data = %s
    WHERE movie_name = %s;
"""
values = (file_ids , toxic)
try:
    cursor.execute(update_query, values)
    connection.commit()
    print("Update successful!")

except (Exception, psycopg2.Error) as error:
    connection.rollback()
    print("Error executing query:", error)
cursor.close()
connection.close()










snapshot_random_frames(video_path, num_frames, output_dir)
credentials_path = 'client_secrets.json'
folder_id = '1Nk_Ni2Ja2AU0djwy4Io-ISHGRoR8Ktkt'
upload_images_to_google_drive(credentials_path, output_dir, folder_id)