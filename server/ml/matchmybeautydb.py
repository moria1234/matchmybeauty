# server/ml/matchmybeautydb.py
import pandas as pd
import nltk
import pymongo
import json
import sys
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

def norm_text(x):
    if not isinstance(x, str):
        return ""
    x = x.lower()
    x = re.sub(r'\s+', ' ', x)
    return x.strip()

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["sephora_db"]
collection = db["products"]

excel_file = "ml/Sephora Final.xlsx"
df = pd.read_excel(excel_file, engine='openpyxl', dtype=str)
df = df.fillna("")

try:
    collection.delete_many({})
    collection.insert_many(df.to_dict(orient="records"))
except Exception as e:
    print(f"Mongo insert warning: {e}", file=sys.stderr)

def create_product_text(row):
    fields = [
        row.get("shade_name", ""),
        row.get("product_highlights", ""),
        row.get("product_about", ""),
        row.get("product_name", ""),
        row.get("product_brand", "")
    ]
    text_parts = []
    for f in fields:
        if isinstance(f, (list, dict)):
            f_text = " ".join([str(x) for x in f])
        else:
            f_text = str(f)
        text_parts.append(norm_text(f_text))
    return " ".join(text_parts)

df['combined_text'] = df.apply(create_product_text, axis=1)
tfidf_vectorizer = TfidfVectorizer(stop_words=nltk.corpus.stopwords.words('english'))
tfidf_matrix = tfidf_vectorizer.fit_transform(df['combined_text'])

def filter_and_score(user_choices, top_n=5):
    df_local = df.copy()
    pt = user_choices.get("productType", "")
    if pt:
        pt_lower = pt.lower()
        mask = df_local["subcategory"].astype(str).str.lower().str.contains(pt_lower, na=False)
        df_local = df_local[mask]

    questions = user_choices.get("answers", []) or []
    questions_norm = [norm_text(q) for q in questions if q and norm_text(q)]
    if not questions_norm:
        return []

    query_text = " ".join(questions_norm)
    query_vec = tfidf_vectorizer.transform([query_text])

    df_text_matrix = tfidf_vectorizer.transform(df_local['combined_text'])
    similarities = cosine_similarity(query_vec, df_text_matrix).flatten()


    shade_weights = []
    for _, row in df_local.iterrows():
        shade = norm_text(row.get("shade_name", ""))
        weight = 0
        for q in questions_norm:
            if q in shade:
                weight = 1.5  
                break
        shade_weights.append(weight)

    df_local['score'] = similarities + shade_weights

    seen_names = set()
    results = []
    df_sorted = df_local.sort_values(by='score', ascending=False)
    for _, row in df_sorted.iterrows():
        if row['score'] <= 0:
            continue
        name = row['product_name']
        if name not in seen_names:
            seen_names.add(name)
            results.append({
                "score": float(row['score']),
                "name": name,
                "brand": row.get("product_brand", ""),
                "shade": row.get("shade_name", ""),
                "price": f"${str(row.get('product_price', '')).strip()}",
                "link": row.get("product-link-href", "") or row.get("product_link_href", "")
            })
        if len(results) >= top_n:
            break
    return results

def read_user_input():
    user_input = None
    if len(sys.argv) > 1:
        user_input = sys.argv[1]
    else:
        try:
            user_input = sys.stdin.read()
        except:
            user_input = None
    if not user_input:
        return {}
    try:
        return json.loads(user_input)
    except Exception as e:
        try:
            return json.loads(user_input.strip())
        except Exception as e2:
            print(f"Invalid JSON input: {e} / {e2}", file=sys.stderr)
            return {}

if __name__ == "__main__":
    user_choices = read_user_input()
    print(f"DEBUG: received user_choices keys: {list(user_choices.keys())}", file=sys.stderr)
    print(f"DEBUG: total products in df: {len(df)}", file=sys.stderr)

    try:
        products = filter_and_score(user_choices, top_n=5)
        print(f"DEBUG: matched products count: {len(products)}", file=sys.stderr)
        print(json.dumps(products))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        print(f"Exception during processing: {e}", file=sys.stderr)