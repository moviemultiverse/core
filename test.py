from pyuploadcare import Uploadcare, File
import os
import json

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
folder_path = 'pics/'

# Upload the whole folder and get the response UUIDs in a list
uploaded_uuids = upload_folder(folder_path)

# Print the UUIDs of the uploaded files
for uuid in uploaded_uuids:
    print(uuid)
file_ids_json = json.dumps(uploaded_uuids)
print(file_ids_json)