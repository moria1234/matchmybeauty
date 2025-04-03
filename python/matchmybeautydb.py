import pandas as pd
from pymongo import MongoClient

print("📌 התחלת ריצת הקובץ...")

# הגדרת הנתיב לקובץ
file_path = r"C:\Users\mormo\OneDrive\Desktop\python\Sephora Final.xlsx"

print("📂 קריאת קובץ אקסל...")
df = pd.read_excel(file_path)
print("✅ קובץ נטען בהצלחה!")

# חיבור ל-MongoDB
print("🔌 חיבור ל-MongoDB...")
client = MongoClient("mongodb://localhost:27017/")  # ודא שמונגו פועל
db = client["sephora_db"]
collection = db["products"]

print("📡 הכנסת נתונים למונגוDB...")
collection.insert_many(df.to_dict(orient="records"))

print("✅ הנתונים נשמרו בהצלחה!")

import pandas as pd
import nltk

# הורדת נתונים רלוונטיים ל-NLTK
nltk.download('punkt')

# קריאת קובץ האקסל
file_path = r"C:\Users\mormo\OneDrive\Desktop\python\Sephora Final.xlsx"
df = pd.read_excel(file_path)

# רשימת העמודות לחיפוש
columns_to_search = ["product_highlights", "product_about", "product_ingredients"]

# פונקציה לבדוק אם 'vegan' מופיעה בטקסט תוך שימוש ב-NLTK
def contains_vegan_nltk(text):
    if isinstance(text, str):  # בדיקה שהתא הוא טקסטואלי
        words = nltk.word_tokenize(text.lower())  # המרת טקסט לאותיות קטנות ופירוק למילים
        return any("vegan" in word for word in words)  # בדיקה אם המילה "vegan" מופיעה
    return False

# פונקציה לסינון מוצרים טבעוניים רק אם המשתמש מבקש
def get_vegan_products_nltk(vegan_only):
    if vegan_only:
        return df[df[columns_to_search].apply(lambda row: any(contains_vegan_nltk(cell) for cell in row), axis=1)]
    return df  # אם המשתמש לא ביקש vegan, נחזיר את כל הנתונים

# בחירת משתמש (True = רוצה רק מוצרים טבעוניים)
user_wants_vegan = True  # ניתן לשנות ל-False אם רוצים את כל המוצרים

# קבלת הנתונים הרלוונטיים
filtered_df = get_vegan_products_nltk(user_wants_vegan)

# הצגת התוצאות
import ace_tools as tools
tools.display_dataframe_to_user(name="Filtered Vegan Products (NLTK)", dataframe=filtered_df)
