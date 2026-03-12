import mysql.connector
import random

db_config = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': 'Jeeva@123',
    'database': 'ai_sante'
}

def seed_offers():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # 1. Get some products
        cursor.execute("SELECT product_id, base_price FROM products LIMIT 5")
        products = cursor.fetchall()

        if not products:
            print("No products found. Run product seeders first.")
            return

        # 2. Get some buyers (non-farmers if possible, or just any user)
        cursor.execute("SELECT user_id FROM users WHERE role != 'farmer' LIMIT 3")
        buyers = cursor.fetchall()
        
        if not buyers:
            # If no consumers, just use any user
            cursor.execute("SELECT user_id FROM users LIMIT 5")
            buyers = cursor.fetchall()

        if not buyers:
            print("No users found to act as buyers.")
            return

        # 3. Create some offers
        offers = []
        buyer_names = ["Reliance Retail", "BigBasket", "Nandini Milk Parlour", "Local Mandi Agent", "Export Corp"]
        
        # We need to insert buyers into users if we want realistic names, but for now let's just use existing IDs
        # and assume the UI joins with users table.
        
        for p_id, base_price in products:
            # Create 1-2 offers per product
            num_offers = random.randint(1, 2)
            for _ in range(num_offers):
                buyer = random.choice(buyers)
                # Offer price usually slightly lower or higher than base
                offered_price = float(base_price) * random.uniform(0.9, 1.1)
                offers.append((p_id, buyer[0], round(offered_price, 2), 'pending'))

        cursor.execute("DELETE FROM offers")
        cursor.executemany(
            "INSERT INTO offers (product_id, buyer_id, offered_price, status) VALUES (%s, %s, %s, %s)",
            offers
        )

        conn.commit()
        print(f"✅ Successfully seeded {len(offers)} offers.")
        conn.close()
    except Exception as e:
        print(f"❌ Seeding error: {e}")

if __name__ == "__main__":
    seed_offers()
