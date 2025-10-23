# from pymongo import MongoClient
# from itertools import combinations
# import os
# from dotenv import load_dotenv

# # Load variables from .env file
# load_dotenv()

# def generate_frequently_bought():
#     # ✅ Get MongoDB URI from environment
#     mongo_uri = os.getenv("MONGODB_URI")
#     if not mongo_uri:
#         raise ValueError("❌ MONGODB_URI not found in .env file")

#     # ✅ Connect to MongoDB Atlas
#     client = MongoClient(mongo_uri)
    
#     # Replace with your actual database name
#     db = client["e-commerce-store"]
#     orders = db["orders"]

#     print("✅ Connected to MongoDB")

#     # Dictionary to count co-purchases
#     pair_count = {}

#     for order in orders.find():
#         product_ids = [str(p['product']) for p in order['products']]
        
#         # Generate all pairs of products in one order
#         for pair in combinations(sorted(product_ids), 2):
#             pair_count[pair] = pair_count.get(pair, 0) + 1

#     # Save results (or store in a collection)
#     result = []
#     for pair, count in pair_count.items():
#         result.append({
#             "productA": pair[0],
#             "productB": pair[1],
#             "count": count
#         })

#     # ✅ Save to MongoDB
#     db["frequently_bought"].delete_many({})
#     if result:  # avoid inserting empty list
#         db["frequently_bought"].insert_many(result)

#     print("✅ Frequently bought pairs updated successfully!")

# if __name__ == "__main__":
#     generate_frequently_bought()
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

# 4️⃣ One-hot encode transaction data
te = TransactionEncoder()
te_ary = te.fit(transactions).transform(transactions)
df = pd.DataFrame(te_ary, columns=te.columns_)

# 5️⃣ Apply Apriori algorithm
frequent_itemsets = apriori(df, min_support=0.01, use_colnames=True)

# 6️⃣ Generate association rules
rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1)

# 7️⃣ Prepare simplified output
recommendations = []
# for _, row in rules.iterrows():
#     base_items = list(row["antecedents"])
#     rec_items = list(row["consequents"])
#     if len(base_items) == 1 and len(rec_items) == 1:
#         recommendations.append({
#             "base": base_items[0],
#             "recommended": rec_items[0],
#             "support": round(row["support"], 3),
#             "confidence": round(row["confidence"], 3),
#             "lift": round(row["lift"], 3)
#         })

# # 8️⃣ Save to JSON (to use in Node backend)
# with open("recommendations.json", "w") as f:
#     json.dump(recommendations, f, indent=4)

# print("✅ ML-based recommendations.json generated successfully!")
# Fetch product details to map ID → name & image
products_col = db["products"]
product_map = {
    str(p["_id"]): {
        "name": p.get("productName", "Unknown"),
        "image": p.get("productImage", [""])[0] if p.get("productImage") else ""
    }
    for p in products_col.find({})
}

# Enhance recommendations with product names and images
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
            "support": round(row["support"], 3),
            "confidence": round(row["confidence"], 3),
            "lift": round(row["lift"], 3)
        })

# Save JSON
with open("recommendations.json", "w") as f:
    json.dump(recommendations, f, indent=4)

print("✅ ML-based recommendations.json generated successfully with product names!")
