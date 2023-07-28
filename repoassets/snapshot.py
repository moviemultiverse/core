from pyuploadcare import Uploadcare, File
import json
import psycopg2
import cv2
import re
import os
import random
import requests
from googleapiclient.discovery import build
from google.oauth2 import service_account
from googleapiclient.http import MediaFileUpload 


video_path = 'AvengersAgeofUltron.mp4'
num_frames = 8
output_dir = 'snapshots'
file_ids = {}
tox = re.sub(r'\.mp4$', '', video_path)


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
            output_path = f'{output_dir}/{tox}_{frame_index}.jpg'
            
            # Save the frame as an image
            cv2.imwrite(output_path, frame)
            print(f'Saved frame {frame_index} as {output_path}')
            file_ids[video_path] = frame_index
    
    # Release the video object
    video.release()




snapshot_random_frames(video_path, num_frames, output_dir)



# Replace 'YOUR_PUBLIC_KEY' and 'YOUR_SECRET_KEY' with your actual Uploadcare API keys
uploadcare = Uploadcare(public_key='10339913e606f80a91e1', secret_key='34cd2e8afd68497e7719')

# Function to upload a file and return the response UUID
def upload_file(file_path):
    with open(file_path, 'rb') as file_object:
        ucare_file = uploadcare.upload(file_object)
        return ucare_file.uuid  # Return the UUID instead of the whole response

# Function to upload a whole folder and store response UUIDs in a list
def upload_folder(folder_path):
    responses_uuids = []  # Initialize an empty list to store UUIDs
    for file in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file)
        if os.path.isfile(file_path):
            uuid = upload_file(file_path)  # Get the UUID of the uploaded file
            responses_uuids.append(uuid)   # Append the UUID to the list
    return responses_uuids

# Directory containing the files you want to upload
folder_path = 'snapshots/'

uploaded_uuids = upload_folder(folder_path)

file_ids_json = json.dumps(uploaded_uuids)
print(file_ids_json)
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
values = (file_ids_json , toxic)
try:
    cursor.execute(update_query, values)
    connection.commit()
    print("Update successful!")

except (Exception, psycopg2.Error) as error:
    connection.rollback()
    print("Error executing query:", error)
cursor.close()
connection.close()