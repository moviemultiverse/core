from telethon.sync import TelegramClient
import sys
from dotenv import load_dotenv
import os

load_dotenv()
api_id = os.getenv("api_id")
api_hash = os.getenv("api_hash")

async def forward_saved_message(target_chat_username, saved_message_id):
    # Start the client
    await client.start()

    try:
        # Forward the saved message
        await client.forward_messages(target_chat_username, saved_message_id, 'me')
        print("Message forwarded successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Stop the client
        await client.disconnect()

# Run the forward_saved_message function
if __name__ == '__main__':
    import asyncio

    # Check if the correct number of command-line arguments are provided
    if len(sys.argv) != 3:
        print("Usage: python script_name.py <target_chat_username> <saved_message_id>")
        sys.exit(1)

    target_chat_username = sys.argv[1]
    saved_message_id = int(sys.argv[2])

    client = TelegramClient('session_name', api_id, api_hash)
    asyncio.run(forward_saved_message(target_chat_username, saved_message_id))


