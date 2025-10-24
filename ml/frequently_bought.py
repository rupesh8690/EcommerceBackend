
from pymongo import MongoClient
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules
import os
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()

# 1️⃣ Connect to MongoDB
client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("DB_NAME", "test")]
orders = db["orders"]

# 2️⃣ Fetch all orders
order_docs = list(orders.find({}, {"products.product": 1, "_id": 0}))

# 3️⃣ Extract list of products per order
transactions = []
for order in order_docs:
    product_list = [str(p["product"]) for p in order.get("products", [])]
    if len(product_list) > 1:
        transactions.append(product_list)

print(f"Total orders found: {len(transactions)}")

# One-hot encode transaction data
te = TransactionEncoder()
te_ary = te.fit(transactions).transform(transactions)
df = pd.DataFrame(te_ary, columns=te.columns_)

# Apply Apriori algorithm
frequent_itemsets = apriori(df, min_support=0.01, use_colnames=True)

#  Generate association rules
rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1)

# Prepare simplified output
recommendations = []

products_col = db["products"]
product_map = {
    str(p["_id"]): {
        "name": p.get("productName", "Unknown"),
        "image": p.get("productImage", [""])[0] if p.get("productImage") else "",
        "price": p.get("sellingPrice", 0),  # or 'price' depending on your schema
        "category": p.get("category", "Unknown")
    }
    for p in products_col.find({}, {"productName": 1, "productImage": 1, "sellingPrice": 1, "category": 1})
}

# Enhance recommendations with product names, images, prices, and categories
recommendations = []
for _, row in rules.iterrows():
    base_items = list(row["antecedents"])
    rec_items = list(row["consequents"])
    if len(base_items) == 1 and len(rec_items) == 1:
        base_id = base_items[0]
        rec_id = rec_items[0]
        recommendations.append({
            "base": base_id,
            "recommended": rec_id,
            "base_name": product_map.get(base_id, {}).get("name", base_id),
            "recommended_name": product_map.get(rec_id, {}).get("name", rec_id),
            "recommended_image": product_map.get(rec_id, {}).get("image", ""),
            "base_price": product_map.get(base_id, {}).get("price", 0),
            "recommended_price": product_map.get(rec_id, {}).get("price", 0),
            "base_category": product_map.get(base_id, {}).get("category", "Unknown"),
            "recommended_category": product_map.get(rec_id, {}).get("category", "Unknown"),
            "support": round(row["support"], 3),
            "confidence": round(row["confidence"], 3),
            "lift": round(row["lift"], 3)
        })

# Save JSON
with open("recommendations.json", "w") as f:
    json.dump(recommendations, f, indent=4)

print(" ML-based recommendations.json generated successfully with price & category!")
