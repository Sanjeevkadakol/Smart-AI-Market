import mysql.connector
import random

db_config = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': 'Jeeva@123',
    'database': 'ai_sante'
}

def seed_20_products():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Get a farmer ID
        cursor.execute("SELECT user_id FROM users WHERE role = 'farmer' LIMIT 1")
        row = cursor.fetchone()
        if not row:
            print("No farmer found. Please register a farmer first.")
            return
        f_id = row[0]
        
        # 20 Diverse Products from Karnataka
        products_data = [
            ("Premium Basmati Paddy", 48.50, 2500, "Mysuru"),
            ("Golden Corn (Maize)", 22.00, 5000, "Davanagere"),
            ("Hybrid Red Onions", 32.00, 3000, "Chikkaballapur"),
            ("Organic Green Chillies", 45.00, 150, "Haveri"),
            ("Sugarcane (Co-86032)", 3.50, 10000, "Belagavi"),
            ("Tender Coconuts", 25.00, 1000, "Mandya"),
            ("Dried Arecanut", 450.00, 100, "Shimoga"),
            ("A-Grade Groundnuts", 85.00, 1200, "Tumakuru"),
            ("Pigeon Pea (Tur Dal)", 110.00, 800, "Kalaburagi"),
            ("Arabica Coffee Beans", 350.00, 500, "Chikkamagaluru"),
            ("Seedless Black Grapes", 70.00, 400, "Vijayapura"),
            ("Long Staple Cotton", 65.00, 2000, "Raichur"),
            ("Polished Turmeric", 95.00, 300, "Chamarajanagar"),
            ("Large Garlic Bulbs", 140.00, 200, "Bagalkot"),
            ("Robusta Bananas", 18.00, 1500, "Nanjangud"),
            ("Fresh Cauliflower", 25.00, 600, "Kolar"),
            ("Baby Carrots", 55.00, 300, "Kodagu"),
            ("Alphonso Mangoes", 180.00, 500, "Dharwad"),
            ("Green Tea Leaves", 250.00, 100, "Uttara Kannada"),
            ("Pearl Millet (Bajra)", 30.00, 1800, "Yadgir")
        ]
        
        # Clear existing to avoid duplicates if re-running, or Just Append? 
        # User asked to "add more", so I will append.
        
        cursor.executemany(
            "INSERT INTO products (farmer_id, name, base_price, quantity, region) VALUES (%s, %s, %s, %s, %s)",
            [(f_id, p[0], p[1], p[2], p[3]) for p in products_data]
        )
        
        conn.commit()
        print(f"✅ Successfully added {len(products_data)} more products to the marketplace.")
        
        conn.close()
    except Exception as e:
        print(f"Seeding error: {e}")

if __name__ == "__main__":
    seed_20_products()
