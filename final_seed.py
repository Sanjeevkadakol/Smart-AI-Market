import mysql.connector

db_config = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': 'Jeeva@123',
    'database': 'ai_sante'
}

def seed():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Get column names for users
        cursor.execute("DESCRIBE users")
        user_cols = [col[0] for col in cursor.fetchall()]
        user_id_col = user_cols[0] # Usually the first is the primary key
        
        print(f"Using '{user_id_col}' as user ID column.")
        
        cursor.execute(f"SELECT {user_id_col} FROM users LIMIT 1")
        user_rows = cursor.fetchall()
        f_id = user_rows[0][0] if user_rows else 1
        
        products = [
            (f_id, "Organic Tomato", 25, 500, "Bangalore"),
            (f_id, "Fresh Onion", 35, 1000, "Mysore"),
            (f_id, "Green Chilli", 15, 200, "Belagavi"),
            (f_id, "Finger Millet (Ragi)", 45, 1500, "Tumkur"),
            (f_id, "Sandalwood Incense", 120, 50, "Shimoga")
        ]
        
        cursor.execute("DELETE FROM products")
        cursor.executemany(
            "INSERT INTO products (farmer_id, name, base_price, quantity, region) VALUES (%s, %s, %s, %s, %s)",
            products
        )
        
        conn.commit()
        print(f"Successfully seeded {len(products)} products.")
        
        # Check Indexes
        cursor.execute("SHOW INDEX FROM market_prices")
        print("\n--- Current Indexes on market_prices ---")
        for idx in cursor.fetchall():
            print(idx[2]) # Key_name
            
        conn.close()
    except Exception as e:
        print(f"Final seeding error: {e}")

if __name__ == "__main__":
    seed()
