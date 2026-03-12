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
    
    # 1. Get a valid farmer ID
    cursor.execute("SELECT user_id FROM users WHERE role = 'farmer' LIMIT 1")
    farmer = cursor.fetchone()
    if not farmer:
        print("No farmer found. Please register one first.")
        exit()
    farmer_id = farmer[0]

    # 2. Extract a variety of real commodities from market_prices
    # We'll take the most recent modal prices for a diverse set of commodities
    cursor.execute("""
        SELECT commodity, district, AVG(modal_price) 
        FROM market_prices 
        WHERE price_date IS NOT NULL 
        AND state LIKE '%Karnataka%'
        GROUP BY commodity, district 
        ORDER BY MAX(price_date) DESC 
        LIMIT 20
    """)
    market_data = cursor.fetchall()

    if not market_data:
        print("No market data found to seed from.")
        exit()

    # 3. Clear existing dummy products to avoid clutter if needed, 
    # but here we just append or use a fresh set.
    cursor.execute("DELETE FROM products") # Cleaning up previous dummy bits
    
    # 4. Prepare and Insert
    products_to_seed = []
    for item in market_data:
        commodity, district, price = item
        # We'll randomize quantity slightly for realism
        import random
        quantity = random.randint(50, 500)
        products_to_seed.append((farmer_id, f"Fresh {commodity}", float(price), quantity, district))

    cursor.executemany(
        "INSERT INTO products (farmer_id, name, base_price, quantity, region) VALUES (%s, %s, %s, %s, %s)",
        products_to_seed
    )
    
    conn.commit()
    print(f"✅ Successfully seeded {cursor.rowcount} products from the market datasets!")
    
    cursor.close()
    conn.close()

except Exception as e:
    print(f"❌ Error: {e}")
