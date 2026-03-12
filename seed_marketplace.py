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
        
        cursor.execute("SELECT user_id FROM users LIMIT 1")
        user_rows = cursor.fetchall()
        f_id = user_rows[0][0] if user_rows else 1
        
        products = [
            (f_id, "Organic Tomato", 25, 500, "Bangalore"),
            (f_id, "Fresh Onion", 35, 1000, "Mysore"),
            (f_id, "Green Chilli", 15, 200, "Belagavi"),
            (f_id, "Finger Millet (Ragi)", 45, 1500, "Tumkur"),
            (f_id, "Premium Potato", 20, 2000, "Hassan"),
            (f_id, "Mandya Garlic", 120, 300, "Mandya"),
            (f_id, "Organic Ginger", 80, 400, "Shimoga"),
            (f_id, "Sweet Carrot", 40, 600, "Ooty"),
            (f_id, "Fresh Capsicum", 60, 250, "Kolar"),
            (f_id, "Red Beetroot", 30, 800, "Bagalkot"),
            (f_id, "Yelakki Banana", 50, 1200, "Channapatna"),
            (f_id, "Shimla Apple", 180, 500, "Shimla"),
            (f_id, "Gokak Grapes", 70, 900, "Belagavi"),
            (f_id, "Ratnagiri Mango", 250, 150, "Ratnagiri")
        ]
        
        cursor.execute("DELETE FROM products")
        cursor.executemany(
            "INSERT INTO products (farmer_id, name, base_price, quantity, region) VALUES (%s, %s, %s, %s, %s)",
            products
        )
        
        conn.commit()
        print(f"Successfully seeded {len(products)} products.")
        conn.close()
    except Exception as e:
        print(f"Seeding error: {e}")

if __name__ == "__main__":
    seed()
