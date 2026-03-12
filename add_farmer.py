import mysql.connector

try:
    conn = mysql.connector.connect(
        host='localhost',
        port=3306,
        user='root',
        password='Jeeva@123',
        database='ai_sante'
    )
    cursor = conn.cursor()
    
    # Check if a farmer exists
    cursor.execute("SELECT user_id FROM users WHERE role = 'farmer' LIMIT 1")
    if not cursor.fetchone():
        cursor.execute("INSERT INTO users (name, email, password, role) VALUES ('Ramu Uncle', 'ramu@farmer.com', 'pwd123', 'farmer')")
        print("Inserted dummy farmer.")
        
    cursor.execute("SELECT user_id FROM users WHERE role = 'consumer' LIMIT 1")
    if not cursor.fetchone():
        cursor.execute("INSERT INTO users (name, email, password, role) VALUES ('City Buyer', 'buyer@city.com', 'pwd123', 'consumer')")
        print("Inserted dummy consumer.")
        
    conn.commit()
    cursor.close()
    conn.close()
    print("User setup complete.")
except Exception as e:
    print(f"Error: {e}")
