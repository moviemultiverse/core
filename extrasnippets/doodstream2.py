import requests
import psycopg2
import re
import time

# Dictionary to store the API responses
api_responses = {}

def get_link_by_name(target_file_name, api_key):
    # Check if the API response is already available
    if api_key in api_responses:
        data = api_responses[api_key]
    else:
        api_url = f'https://doodapi.com/api/file/list?key={api_key}'
        try:
            response = requests.get(api_url)
            response.raise_for_status()
            data = response.json()
            api_responses[api_key] = data  # Save the response for future use
        except requests.exceptions.RequestException as error:
            print('Error:', error)
            return None
        except ValueError as error:
            print('JSON Parsing Error:', error)
            return None

    if 'result' in data and 'files' in data['result']:
        files = data['result']['files']
        for file in files:
            if file['title'] == target_file_name:
                return file['file_code']

    return None

def update_movie_doodstream_code(movie_name, link):
    db_params = {
        "host": "satao.db.elephantsql.com",
        "port": 5432,
        "database": "iywyfbqc",
        "user": "iywyfbqc",
        "password": "qAGx55jepOzWXVmB2IZxn-F-rulL3zRR"
    }
    connection = psycopg2.connect(**db_params)
    cursor = connection.cursor()
    update_query = """
        UPDATE moviedata 
        SET doodstream_code = %s
        WHERE movie_name = %s;
    """
    values = (link, movie_name)
    try:
        cursor.execute(update_query, values)
        connection.commit()
        print("Update successful for:", movie_name)

    except (Exception, psycopg2.Error) as error:
        connection.rollback()
        print("Error executing query for:", movie_name)
        print("Error message:", error)

    cursor.close()
    connection.close()

def fetch_all_movie_names():
    db_params = {
        "host": "satao.db.elephantsql.com",
        "port": 5432,
        "database": "iywyfbqc",
        "user": "iywyfbqc",
        "password": "qAGx55jepOzWXVmB2IZxn-F-rulL3zRR"
    }
    connection = psycopg2.connect(**db_params)
    cursor = connection.cursor()
    select_query = "SELECT movie_name FROM moviedata;"
    try:
        cursor.execute(select_query)
        movie_names = cursor.fetchall()
        return [movie_name[0] for movie_name in movie_names]

    except (Exception, psycopg2.Error) as error:
        print("Error fetching movie names:", error)
        return []

    cursor.close()
    connection.close()

def main(api_key):
    movie_names = fetch_all_movie_names()
    for index, movie_name in enumerate(movie_names, 1):
        toxic = re.sub(r'\.mp4$', '', movie_name)
        link = get_link_by_name(toxic, api_key)
        if link is not None:
            update_movie_doodstream_code(toxic, link)
        
        # Add a 1-second break every four API calls
        if index % 2 == 0:
            time.sleep(1)

if __name__ == "__main__":
    # Add the API keys you want to use in the list below
    api_keys = ['275776ox1z3ej7pxm6wci7', '49943w31dwl3crvaz1tui']

    for api_key in api_keys:
        main(api_key)
