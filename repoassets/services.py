import requests
import random

def fetch_responses(file, streamtape_tokens, dood_api_keys):
    responses = []

    streamtape_url = 'https://api.streamtape.com/remotedl/add?login={LOGIN}&token={TOKEN}&Name='+'randomfile.mp4'+'&url='

    # Choose a random token for api.streamtape.com
    random_streamtape_token = random.choice(streamtape_tokens)
    full_streamtape_url = streamtape_url.format(LOGIN=random_streamtape_token['USER'], TOKEN=random_streamtape_token['API_KEY']) + file

    try:
        response = requests.get(full_streamtape_url)
        if response.status_code == 200:
            data = response.json()
            responses.append(data)
    except requests.exceptions.RequestException as error:
        print('Error occurred during Streamtape fetch:', error)

    dood_url = 'https://doodapi.com/api/upload/url?key={api_key}&new_title='+'randomfile.mp4'+'&url=',

    # Choose a random API key for doodapi.com
    random_doodapi_key = random.choice(dood_api_keys)
    full_dood_url = dood_url.format(api_key=random_doodapi_key) + file

    try:
        response = requests.get(full_dood_url)
        if response.status_code == 200:
            data = response.json()
            responses.append(data)
    except requests.exceptions.RequestException as error:
        print('Error occurred during Doodapi fetch:', error)

    return responses

# List of tokens for api.streamtape.com (each token is a dictionary)
streamtape_tokens = [
    {'USER': '1354fac33684cb2d5687', 'API_KEY': '9yJx9aeKLofaxQV'},
    {'USER': 'f65b540c475b9b7d4da8', 'API_KEY': '268XaKDBLqTZ2kg'}
]

# List of doodapi keys
dood_api_keys = ['275776ox1z3ej7pxm6wci7', '49943w31dwl3crvaz1tui']

# Replace 'randomfileid' with the actual file ID you want to fetch
responses = fetch_responses('randomfileid', streamtape_tokens, dood_api_keys)

# Write responses to a file
with open('response.txt', 'w') as file:
    for response in responses:
        file.write(str(response) + '\n')

# Print the responses
for response in responses:
    print(response)
