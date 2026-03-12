import mysql.connector

db_config = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': 'Jeeva@123',
    'database': 'ai_sante'
}

def fix_farmers():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        # 1. Update 'Ramu Uncle' to something more professional if he's the only one
        cursor.execute("UPDATE users SET name = 'Siddaramaiah K.' WHERE name = 'Ramu Uncle'")
        conn.commit()
        print("Updated 'Ramu Uncle' to 'Siddaramaiah K.'")

        # 2. Check if we need more farmers
        cursor.execute("SELECT * FROM users WHERE role = 'farmer'")
        farmers = cursor.fetchall()
        
        if len(farmers) < 3:
            more_farmers = [
                ('Nagula Gowda', 'nagula@example.com', 'pwd123', 'farmer'),
                ('Basavaraj Bommai', 'bashu@example.com', 'pwd123', 'farmer'),
                ('Chennamma H.', 'chen@example.com', 'pwd123', 'farmer'),
                ('Mallikarjun K.', 'malli@example.com', 'pwd123', 'farmer')
            ]
            cursor.executemany(
                "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
                more_farmers
            )
            conn.commit()
            print(f"Added {len(more_farmers)} realistic farmers.")

        # 3. Re-fetch all farmers
        cursor.execute("SELECT user_id FROM users WHERE role = 'farmer'")
        farmer_ids = [row['user_id'] for row in cursor.fetchall()]

        # 4. Distributed existing products among these farmers randomly
        cursor.execute("SELECT product_id FROM products")
        product_ids = [row['product_id'] for row in cursor.fetchall()]
        
        import random
        for p_id in product_ids:
            f_id = random.choice(farmer_ids)
            cursor.execute("UPDATE products SET farmer_id = %s WHERE product_id = %s", (f_id, p_id))
        
        conn.commit()
        print(f"Distributed {len(product_ids)} products among {len(farmer_ids)} farmers.")

        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_farmers()
