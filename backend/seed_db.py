import pandas as pd
import mysql.connector
import os

def seed_database():
    try:
        # Connect to MySQL
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Jeeva@123",
            database="ai_sante"
        )
        cursor = conn.cursor()

        # 1. Create a default farmer user if not exists
        cursor.execute("SELECT user_id FROM users WHERE email = 'farmer@sante.com'")
        farmer = cursor.fetchone()
        if not farmer:
            cursor.execute(
                "INSERT INTO users (name, email, password, role) VALUES ('Farmer Jeeva', 'farmer@sante.com', 'password123', 'farmer')"
            )
            conn.commit()
            farmer_id = cursor.lastrowid
        else:
            farmer_id = farmer[0]

        # 2. Read products from ai_deep_forecast.csv
        csv_path = r'd:\AI_Sante\ai_module\ai_deep_forecast.csv'
        if not os.path.exists(csv_path):
            print(f"❌ CSV not found at {csv_path}")
            return

        df = pd.read_csv(csv_path)
        
        # Clear existing products to avoid duplicates during resync
        cursor.execute("DELETE FROM products")
        conn.commit()

        print(f"🌱 Seeding {len(df)} products...")

        for index, row in df.iterrows():
            name = row['commodity']
            base_price = row['current']
            quantity = 500  # Default quantity for seeding
            region = "Karnataka" # Default region
            
            cursor.execute(
                "INSERT INTO products (farmer_id, name, base_price, quantity, region) VALUES (%s, %s, %s, %s, %s)",
                (farmer_id, name, base_price, quantity, region)
            )
        
        conn.commit()
        print("✅ Database seeded successfully!")

    except mysql.connector.Error as err:
        print(f"❌ Error: {err}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    seed_database()
