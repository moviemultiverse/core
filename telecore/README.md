# Important Condition

- **This side of the core repository uses [Telethon](https://github.com/LonamiWebs/Telethon) library to use telegram as instant data storage**

- **The video must be under max(1.5GB) to upload to "me" chat**

- **To save it we need python3 and a manual installation of {api_id && api_hash}**

- **It cannot be used to to upload from servers**

- **It could end up banning your account**

### UPLOAD

```python upload.py /path/to/file "message"```
                                                                                                            
### FORWARD

```python forward.py abcuser 1791```

### FETCH SAVED MESSAGE

```python3 fetch_saved.py```

### UPLOAD SAVED JSON TO MONGODB

```python3 upload_saved.py```

Added unique key to message id for mongodb

## DATA SHARING

Data pairs for message_id and content is in `saved_messages.json`

for quick update database with new data from telegram to mongodb
```python3 fetch_saved.py && python3 upload_saved.py```

# INSTALLATION

```pip install -r requirements.txt```

### NEED api_id && api_hash

[Telegram Link](https://my.telegram.org/apps)