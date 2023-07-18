#!/bin/bash
sudo apt-get install rename
rename 's/\.mp4$/\.txt/' *.mp4 
split -b 20m input.txt output_ --additional-suffix=.txt
rm -v input.txt
echo "cool it uploaded";
