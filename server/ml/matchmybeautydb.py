# server/ml/matchmybeautydb.py
import pandas as pd
import nltk
import pymongo
import json
import sys
import re

# הורדת משאבי NLTK במידת הצורך
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

# עזרי נרמול
def norm_text(x):
    if not isinstance(x, str):
        return ""
    # הורדת תווים מיוחדים מיותרים, רווחים כפולים, lowercase
    x = x.lower()
    x = re.sub(r'\s+', ' ', x)
    return x.strip()

# חיבור ל-MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["sephora_db"]
collection = db["products"]

# קריאת קובץ אקסל
excel_file = "ml/Sephora Final.xlsx"
df = pd.read_excel(excel_file, engine='openpyxl', dtype=str)  # ערכים כמחרוזות כדי למנוע בעיות
df = df.fillna("")  # מלא ערכי NaN בריקים

# הכנסה למונגו (מנקה קודם כדי לא לצבור כפילויות)
try:
    collection.delete_many({})
    # השתמשי בזה רק אם את רוצה להכניס כל פעם מחדש
    collection.insert_many(df.to_dict(orient="records"))
except Exception as e:
    print(f"Mongo insert warning: {e}", file=sys.stderr)

# פונקציה לבדיקת התאמה של שאלה אחת למוצר
def matches_question(row, q_lower):
    # בדיקה ברחבי שדות רלוונטיים
    fields = [
        row.get("shade_name", ""),
        row.get("product_highlights", ""),
        row.get("product_about", ""),
        row.get("product_name", ""),
        row.get("product_brand", "")
    ]
    for f in fields:
        f_norm = norm_text(f)
        if q_lower in f_norm:
            return True
    return False

# פונקציית דירוג: מחזירה רשימת תוצאות ממוינת לפי score
def filter_and_score(user_choices, top_n=5):
    # יצירת עותק עבודה
    df_local = df.copy()

    # אם יש productType -> עדיפות לחיפוש לפי subcategory (גלוי בדאטה שלך)
    pt = user_choices.get("productType", "")
    if pt:
        pt_lower = pt.lower()
        mask = df_local["subcategory"].astype(str).str.lower().str.contains(pt_lower, na=False)
        df_local = df_local[mask]

    # קבלת שאלות ספציפיות (אפשר שחלק מהשאלות יהיו ריקות)
    questions = user_choices.get("productQuestions", []) or []

    # נרמול שאלות
    questions_norm = [norm_text(q) for q in questions if q and norm_text(q)]

    results = []
    # עבור כל מוצר - חשב ציון
    for _, row in df_local.iterrows():
        score = 0
        # לתת משקל גדול אם subcategory תואמת בדיוק
        if pt and pt.lower() in str(row.get("subcategory", "")).lower():
            score += 2

        for q_lower in questions_norm:
            # אם השאלה מופיעה ב-shade -> משקל גדול
            shade = norm_text(row.get("shade_name", ""))
            if q_lower in shade:
                score += 3
                continue  # אם מצאנו ב-shade לא צריך לבדוק שדות קטנים יותר לאותה שאלה

            # בדיקה ב-highlights (שדה יכול להיות JSON או טקסט)
            highlights = row.get("product_highlights", "")
            if isinstance(highlights, (list, dict)):
                highlights_text = " ".join([str(x) for x in highlights])
            else:
                highlights_text = str(highlights)
            if q_lower in norm_text(highlights_text):
                score += 2
                continue

            # בדיקה ב-about / name / brand
            about = norm_text(row.get("product_about", ""))
            name = norm_text(row.get("product_name", ""))
            brand = norm_text(row.get("product_brand", ""))
            if q_lower in about or q_lower in name or q_lower in brand:
                score += 1

        if score > 0:
            results.append({
                "score": score,
                "name": row.get("product_name", ""),
                "brand": row.get("product_brand", ""),
                "shade": row.get("shade_name", ""),
                "price": str(row.get("product_price", "")).strip(),
                "image": row.get("product_image-src", "") or row.get("product_image_src", ""),
                "link": row.get("product-link-href", "") or row.get("product_link_href", "")
            })

    # מיון לפי ציון יורד והחזרת top_n
    results_sorted = sorted(results, key=lambda x: x["score"], reverse=True)
    return results_sorted[:top_n]

# קריאת קלט (תומך גם ב־argv[1] וגם ב־stdin)
def read_user_input():
    user_input = None
    if len(sys.argv) > 1:
        user_input = sys.argv[1]
    else:
        # קריאה מ-stdin (אפשרי גם עם PythonShell אם שולחים דרך stdin)
        try:
            user_input = sys.stdin.read()
        except:
            user_input = None
    if not user_input:
        return {}
    try:
        return json.loads(user_input)
    except Exception as e:
        # ייתכן שה־JSON הועבר כמחרוזת מוטבעת; נסה לפרס אותו פעם שניה
        try:
            return json.loads(user_input.strip())
        except Exception as e2:
            print(f"Invalid JSON input: {e} / {e2}", file=sys.stderr)
            return {}

# MAIN
if __name__ == "__main__":
    user_choices = read_user_input()
    print(f"DEBUG: received user_choices keys: {list(user_choices.keys())}", file=sys.stderr)
    print(f"DEBUG: total products in df: {len(df)}", file=sys.stderr)

    try:
        products = filter_and_score(user_choices, top_n=5)
        print(f"DEBUG: matched products count: {len(products)}", file=sys.stderr)
        # הדפסת התוצאה היחידה ל־stdout כ־JSON (Node/Angular יראו את זה)
        print(json.dumps(products))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        print(f"Exception during processing: {e}", file=sys.stderr)
