from telethon import TelegramClient, events, sync
import sys
from dotenv import load_dotenv
import os

load_dotenv()
api_id = os.getenv("api_id")
api_hash = os.getenv("api_hash")

async def main(file_path, message):
    client = TelegramClient('session_name', api_id, api_hash)

    # Start the client
    await client.start()

    try:
        # Send a file with a message
        file = await client.upload_file(file_path)
        await client.send_file('me', file, force_document=True, caption=message, progress_callback=upload_progress)

    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Stop the client
        await client.disconnect()

def upload_progress(current, total):
    print(f"Uploaded {current} out of {total} bytes")

# Run the main function
if __name__ == '__main__':
    import asyncio

    # Check if the correct number of command-line arguments are provided
    if len(sys.argv) != 3:
        print("Usage: python script_name.py <file_path> <message>")
        sys.exit(1)

    file_path = sys.argv[1]
    message = sys.argv[2]

    asyncio.run(main(file_path, message))

