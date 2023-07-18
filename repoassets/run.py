import subprocess
import os

folders = []

# Read the command from a file
with open('command.sh', 'r') as file:
    command = file.read().strip()

# Run the command
try:
    output = subprocess.check_output(command, shell=True).decode().strip()
    folderPaths = output.split('\n')

    # Add each folder path to the folders list
    for folderPath in folderPaths:
        folderPath = folderPath.replace("./", "")
        folders.append(folderPath)

    # Convert the folders list to a Python code string
    pyCode = f'folders = {folders}'

    # Save the Python code to a file
    with open('output.py', 'w') as file:
        file.write(pyCode)

    print('Output.py file saved successfully!')
except subprocess.CalledProcessError as e:
    print(f'Error executing command: {e}')
