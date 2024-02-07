from telethon.sync import TelegramClient
from telethon.tl.functions.messages import GetMessagesRequest
from dotenv import load_dotenv
import os
import json

load_dotenv()
api_id = os.getenv("api_id")
api_hash = os.getenv("api_hash")

client = TelegramClient('session_name', api_id, api_hash)

async def get_saved_messages():
    # Start the client
    await client.start()

    try:
        # Get all saved messages
        saved_messages = await client.get_messages('me', limit=None)

        # Create a list to store message data
        messages_data = []

        # Append information about each saved message to the list
        for message in saved_messages:
            message_data = {
                "Message ID": message.id,
                "Message Text": message.text,
            }
            if(message.text != None):
                messages_data.append(message_data)

        # Serialize the list to JSON and save it to a file
        with open("saved_messages.json", "w", encoding="utf-8") as json_file:
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
