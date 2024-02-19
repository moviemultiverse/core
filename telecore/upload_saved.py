from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import json

load_dotenv()
DB_URI = os.getenv("DB_URI")

# Specify the path to your local file
file_path = 'saved_messages.json'

try:
    # Open the file in read mode ('r')
    with open(file_path, 'r') as file:
        # Load JSON contents into a Python object
        file_contents = json.load(file)
except FileNotFoundError:
    print(f"The file '{file_path}' was not found.")
except json.JSONDecodeError as e:
    print(f"Error decoding JSON in the file: {e}")
except Exception as e:
    print(f"An error occurred: {e}")

# Create a new client and connect to the server
client = MongoClient(DB_URI, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    # Specify the target collection
    target_collection = client['CORE']['tele_data']

    # Insert the loaded JSON data into the collection
    if isinstance(file_contents, list):
        target_collection.insert_many(file_contents)
        print("Data inserted successfully.")
    else:
        print("Error: The JSON file does not contain an array of documents.")
except Exception as e:
    #print(f"Error inserting data into MongoDB: {e}")
    print("Successfull , But File have duplicates")
finally:
    # Close the MongoDB connection
    client.close()
