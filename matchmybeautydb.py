import pandas as pd
import nltk
import pymongo

nltk.download('punkt')
nltk.download('stopwords')

client = pymongo.MongoClient("mongodb://localhost:27017/") 
db = client["sephora_db"]  
collection = db["products"]

# Read the Excel file
excel_file = "Sephora Final.xlsx"
df = pd.read_excel(excel_file)
data = df.to_dict(orient="records")

collection.delete_many({})

collection.insert_many(data)

print(f"{len(data)} Products successfully uploaded to MongoDB!")

# List of keywords to search
search_keywords = ['concealer', 'light', 'dry', 'medium coverage', 'matte']

# Function to find up to 5 matching products
def find_matching_products(collection, keywords, max_results=5):
    matches = []
    cursor = collection.find({}) 
    for product in cursor:
        for field in ['product_highlights', 'product_about', 'product_ingredients']:
            description = str(product.get(field, "")).lower()  
            if any(keyword.lower() in description for keyword in keywords):
                matches.append(product)  
                break 
        if len(matches) >= max_results:  
            break
    return matches

# Get matching products
matching_products = find_matching_products(collection, search_keywords, max_results=5)

# Display product details
if matching_products:
    for i, product in enumerate(matching_products, start=1):
        print(f"Product {i}:")
        print(f"Name: {product['product_name']}")
        print(f"Brand: {product['product_brand']}")
        print(f"Shade: {product['shade_name']}")
        print(f"Price: {product['product_price']}")
        print(f"Image: {product['product_image-src']}")
        print(f"Link: {product['product-link-href']}")
        print("-" * 50)
else:
    print("No product found")