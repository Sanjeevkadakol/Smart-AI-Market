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
    
    # Check for farmer
    cursor.execute("SELECT user_id, name FROM users WHERE role = 'farmer' LIMIT 1")
    farmer = cursor.fetchone()
    
    if farmer:
        farmer_id = farmer[0]
        print(f"Found farmer: {farmer[1]} (ID: {farmer_id})")
        
        # Seed products
        products = [
            (farmer_id, 'Fresh Organic Tomatoes', 45.00, 150, 'Bangalore Urban'),
            (farmer_id, 'Red Onions', 35.00, 400, 'Chikkaballapur'),
            (farmer_id, 'Green Chilies', 28.00, 80, 'Hassan'),
            (farmer_id, 'Carrots', 50.00, 200, 'Ooty/Mysuru')
        ]
        
        cursor.executemany(
            "INSERT INTO products (farmer_id, name, base_price, quantity, region) VALUES (%s, %s, %s, %s, %s)",
            products
        )
        conn.commit()
        print(f"Successfully seeded {cursor.rowcount} products.")
        
        # Verify
        cursor.execute("SELECT COUNT(*) FROM products")
        count = cursor.fetchone()[0]
        print(f"Total products in database: {count}")
    else:
        print("No farmer found in the database. Please register a farmer first.")
        
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
