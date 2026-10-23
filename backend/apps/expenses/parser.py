"""
Python Bank SMS & Notification Parser for Smart Expenses Backend
Parses SMS messages forwarded from Android / Bank Webhooks and extracts
amounts, merchants, categories, dates, and payment methods.
"""
import re
from datetime import datetime

CATEGORY_MAP = {
    'Food': [
        'swiggy', 'zomato', 'blinkit', 'zepto', 'instamart', 'supermarket', 'groceries',
        'mcdonalds', 'kfc', 'dominos', 'pizza', 'starbucks', 'cafe', 'coffee',
        'blue tokai', 'restaurant', 'dining', 'bakery', 'subway', 'burger', 'bigbasket',
        'chai', 'eatclub', 'faasos'
    ],
    'Shopping': [
        'amazon', 'flipkart', 'myntra', 'zara', 'h&m', 'ajio', 'nike', 'adidas',
        'uniqlo', 'retail', 'clothing', 'fashion', 'mall', 'electronics', 'apple',
        'croma', 'reliance digital', 'shopping', 'store', 'meesho', 'nykaa'
    ],
    'Travel': [
        'uber', 'ola', 'rapido', 'metro', 'irctc', 'railways', 'indigo', 'air india',
        'flight', 'airline', 'fuel', 'petrol', 'diesel', 'shell', 'hpcl', 'bpcl',
        'indian oil', 'toll', 'fastag', 'transit', 'cab', 'makemytrip', 'redbus'
    ],
    'Healthcare': [
        'apollo', 'pharmeasy', '1mg', 'netmeds', 'medplus', 'pharmacy', 'hospital',
        'clinic', 'cult.fit', 'cultfit', 'gym', 'fitness', 'doctor', 'healthcare',
        'medical', 'dental', 'diagnostic'
    ],
    'Bills': [
        'bescom', 'electricity', 'power', 'water', 'gas', 'tata play', 'airtel',
        'jio', 'vi', 'vodafone', 'broadband', 'act fibernet', 'recharge', 'utility',
        'bill desk', 'billdesk', 'dth'
    ],
    'Entertainment': [
        'netflix', 'spotify', 'hotstar', 'disney', 'prime video', 'youtube', 'bookmyshow',
        'pvr', 'inox', 'cinema', 'theatre', 'steam', 'playstation', 'gaming'
    ],
    'Education': [
        'coursera', 'udemy', 'edx', 'upgrad', 'college', 'school', 'university',
        'tuition', 'fee', 'books', 'kindle', 'learning'
    ],
}

def detect_bank_name(text: str, sender: str = '') -> str:
    combined = f"{sender} {text}".lower()
    if 'sbi' in combined or 'state bank' in combined:
        return 'State Bank of India'
    elif 'icici' in combined:
        return 'ICICI Bank'
    elif 'axis' in combined:
        return 'Axis Bank'
    elif 'kotak' in combined:
        return 'Kotak Mahindra Bank'
    elif 'pnb' in combined or 'punjab national' in combined:
        return 'Punjab National Bank'
    elif 'bob' in combined or 'baroda' in combined:
        return 'Bank of Baroda'
    elif 'phonepe' in combined:
        return 'PhonePe UPI'
    elif 'gpay' in combined or 'google pay' in combined:
        return 'Google Pay'
    elif 'paytm' in combined:
        return 'Paytm'
    elif 'cred' in combined:
        return 'CRED Club'
    return 'Bank Alert'

def infer_category(text: str) -> str:
    lower = text.lower()
    for cat, keywords in CATEGORY_MAP.items():
        for kw in keywords:
            if kw in lower:
                return cat
    return 'Food'

def parse_bank_message(text: str, sender: str = '') -> dict:
    if not text or not isinstance(text, str):
        return {"success": False, "error": "Empty message"}

    clean = text.strip()
    lower = clean.lower()

    # 1. Income vs Expense
    is_income = (
        'credited' in lower or
        'credit of' in lower or
        'received' in lower or
        'deposited' in lower or
        'refund' in lower
    ) and 'debited' not in lower

    # 2. Extract Amount
    amount = 0.0
    amount_patterns = [
        r'(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)',
        r'debited\s+(?:by|with)?\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)',
        r'credited\s+(?:by|with)?\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)',
        r'spent\s+(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)',
        r'paid\s+(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)'
    ]
    for pattern in amount_patterns:
        match = re.search(pattern, clean, re.IGNORECASE)
        if match:
            raw_val = match.group(1).replace(',', '')
            try:
                val = float(raw_val)
                if val > 0:
                    amount = val
                    break
            except ValueError:
                continue

    # 3. Extract Merchant / Payee
    merchant = ""
    merchant_patterns = [
        r'(?:info|towards|at|to|transfer to|vpa)\s+([A-Za-z0-9\s._\-&]+?)(?:\.|\s+on|\s+using|\s+ref|\s+avl|\s+upi|$)',
        r'paid\s+.*?to\s+([A-Za-z0-9\s._\-&]+?)(?:\s+using|\s+for|\s+upi|\.|$)',
        r'spent\s+.*?at\s+([A-Za-z0-9\s._\-&]+?)(?:\s+on|\s+using|\.|$)'
    ]
    for pattern in merchant_patterns:
        match = re.search(pattern, clean, re.IGNORECASE)
        if match:
            cand = match.group(1).strip()
            cand = re.sub(r'^(upi[-_]|bil\*|pos\*|vpa[-_])', '', cand, flags=re.IGNORECASE)
            if len(cand) > 2 and not cand.lower().startswith('rs'):
                words = cand.split()[:4]
                merchant = " ".join(w.capitalize() for w in words)
                break

    if not merchant:
        merchant = "Direct Account Credit" if is_income else "Merchant Payment"

    # 4. Payment Method
    if 'card ending' in lower or 'card **' in lower or 'card *' in lower:
        payment_method = 'Card'
    elif 'a/c' in lower or 'acct' in lower or 'neft' in lower or 'imps' in lower:
        payment_method = 'Bank Transfer'
    elif 'cash' in lower:
        payment_method = 'Cash'
    else:
        payment_method = 'UPI'

    # 5. Reference number
    ref_match = re.search(r'(?:ref|utr|id|txn)\s*(?:no\.?|id|:)?\s*([A-Za-z0-9]{6,16})', clean, re.IGNORECASE)
    ref_number = ref_match.group(1) if ref_match else None

    # 6. Date
    date_match = re.search(r'(\d{1,2})[-/]([A-Za-z]{3}|\d{1,2})[-/](\d{2,4})', clean)
    tx_date = datetime.now().strftime("%Y-%m-%d")
    if date_match:
        day = date_match.group(1).zfill(2)
        month = date_match.group(2).lower()
        year = date_match.group(3)
        if len(year) == 2:
            year = f"20{year}"
        month_map = {
            'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
            'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
        }
        month_num = month_map.get(month, month.zfill(2) if month.isdigit() else '10')
        tx_date = f"{year}-{month_num}-{day}"

    bank_name = detect_bank_name(clean, sender)
    category = infer_category(f"{merchant} {clean}")

    return {
        "success": amount > 0,
        "amount": amount,
        "is_income": is_income,
        "merchant": merchant,
        "category": category,
        "payment_method": payment_method,
        "date": tx_date,
        "ref_number": ref_number,
        "bank_name": bank_name,
        "raw_message": clean,
        "sender": sender
    }
