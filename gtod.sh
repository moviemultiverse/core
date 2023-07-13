#!/bin/bash

# List of folders to move contents from
folders=("folder1" "folder2" "folder3" "folder4")

# Iterate through each folder
for folder in "${folders[@]}"; do
  # Check if the folder exists
  if [ -d "$folder" ]; then
    # Move contents of the folder to the root directory
    mv "$folder"/* ./
  else
    echo "Folder '$folder' does not exist."
  fi
done

cat *.txt > randomfile.mp4
echo "cool it ended";
mkdir snapshots 
touch response.txt
 
