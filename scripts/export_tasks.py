import csv
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT')
}

def export_to_csv():
    try:
        connection = psycopg2.connect(**DB_CONFIG)
        cursor = connection.cursor()
        
        cursor.execute("SELECT id, title, description, status, created_at FROM tasks ORDER BY id ASC;")
        rows = cursor.fetchall()
        
        filename = 'tasks_export.csv'
        with open(filename, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['id', 'title', 'description', 'status', 'created_at'])
            writer.writerows(rows)
            
        print(f"Экспорт завершен успешно! Создан файл: {filename}")
        
    except psycopg2.Error as e:
        print(f"Ошибка базы данных: {e}")
    finally:
        if 'connection' in locals() and connection:
            cursor.close()
            connection.close()

if __name__ == "__main__":
    export_to_csv()