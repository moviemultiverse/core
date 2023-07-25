import requests
import psycopg2
import re
target_file_name = "randomfile.mp4"
toxic = re.sub(r'\.mp4$', '', target_file_name)
def get_link_by_name():
    api_url = 'https://doodapi.com/api/file/list?key=49943w31dwl3crvaz1tui'

    try:
        response = requests.get(api_url)
        response.raise_for_status()  

        data = response.json()  
        files = data['result']['files']
        for file in files:
            if file['title'] == toxic:
                return file['download_url']

        return None  

    except requests.exceptions.RequestException as error:
        print('Error:', error)
        return None 
    except ValueError as error:
        print('JSON Parsing Error:', error)
        return None 

link = get_link_by_name()
print(link)

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
values = (link , toxic)
try:
    cursor.execute(update_query, values)
    connection.commit()
    print("Update successful!")

except (Exception, psycopg2.Error) as error:
    connection.rollback()
    print("Error executing query:", error)
cursor.close()
connection.close()
