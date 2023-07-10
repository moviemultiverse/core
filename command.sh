split -b 1m input.txt output_ --additional-suffix=.txt

count=0
folder_count=1
mkdir -p folder$folder_count

for file in output_*; do
  if [ $count -eq 10 ]; then
    count=0
    folder_count=$((folder_count + 1))
    mkdir -p folder$folder_count
  fi
  mv "$file" folder$folder_count/
  count=$((count + 1))
done

find . -type d -name "folder*"
#subprogramm