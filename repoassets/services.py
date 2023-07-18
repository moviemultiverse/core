import requests

def fetch_responses(file):
    responses = []

    urls = [
       # 'https://api.streamsb.com/api/upload/url?key=46443yy1674fu5ych9iq0&url=',#copies drive url to name of vid
        'https://doodapi.com/api/upload/url?key=49943w31dwl3crvaz1tui&new_title='+'randomfile.mp4'+'&url=',
       # 'https://upstream.to/api/upload/url?key=55196gnvzsjuwpss4ea1y&url=',
        'https://api.streamtape.com/remotedl/add?login=f65b540c475b9b7d4da8&key=268XaKDBLqTZ2kg&Name='+'randomfile.mp4'+'&url='
    ]

    for url in urls:
        full_url = url + file

        try:
            response = requests.get(full_url)
            if response.status_code == 200:
                data = response.json()
                responses.append(data)
        except requests.exceptions.RequestException as error:
            print('Error occurred during fetch:', error)

    return responses

responses = fetch_responses('randomfileid')

with open('response.txt', 'w') as file:
    for response in responses:
        file.write(str(response) + '\n')


for response in responses:
    print(response)