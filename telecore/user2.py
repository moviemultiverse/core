from telethon.sync import TelegramClient
from telethon.tl.functions.messages import GetMessagesRequest
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os
import json

load_dotenv()
api_id = os.getenv("api_id_shah")
api_hash = os.getenv("api_hash_shah")

client = TelegramClient('session_name', api_id, api_hash)

async def get_saved_messages():
    # Start the client
    await client.start()

    try:
        # Get all saved messages
        saved_messages = await client.get_messages('blackhole_movie_bot', limit=None)

        # Create a list to store message data
        messages_data = []

        # Append information about each saved message to the list
        for message in saved_messages:
            message_data = {
                "id": message.id,
                "text": message.text,
            }
            if(message.text != None):
                messages_data.append(message_data)

        # Serialize the list to JSON and save it to a file
        with open("jsonfiles/user2.json", "w", encoding="utf-8") as json_file:
            json.dump(messages_data, json_file, ensure_ascii=False, indent=4)

    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Stop the client
        await client.disconnect()

# Run the get_saved_messages function
if __name__ == '__main__':
    import asyncio
    asyncio.run(get_saved_messages())

    
    load_dotenv()
    DB_URI = os.getenv("DB_URI")
    
    # Specify the path to your local file
    file_path = 'jsonfiles/user2.json'
    
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
        target_collection = client['CORE']['user2']
    
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
    
    