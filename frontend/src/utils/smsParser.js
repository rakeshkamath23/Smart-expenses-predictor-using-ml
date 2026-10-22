/**
 * Smart Expenses - Bank SMS & UPI Alert Parser Engine
 * Handles real-world banking SMS formats (HDFC, SBI, ICICI, Axis, Kotak, Paytm, PhonePe, GPay, etc.)
 */

// Keyword mappings for auto-categorization
const CATEGORY_KEYWORDS = {
  'Food & Groceries': [
    'swiggy', 'zomato', 'blinkit', 'zepto', 'instamart', 'supermarket', 'groceries',
    'nature basket', 'mcdonalds', 'kfc', 'dominos', 'pizza', 'starbucks', 'cafe',
    'coffee', 'blue tokai', 'restaurant', 'dining', 'bakery', 'subway', 'burger',
    'bigbasket', 'food', 'eats'
  ],
  'Shopping & Apparel': [
    'amazon', 'flipkart', 'myntra', 'zara', 'h&m', 'ajio', 'nike', 'adidas',
    'uniqlo', 'retail', 'clothing', 'fashion', 'mall', 'electronics', 'apple',
    'croma', 'reliance digital', 'shopping', 'store'
  ],
  'Transport & Commute': [
    'uber', 'ola', 'rapido', 'metro', 'irctc', 'railways', 'indigo', 'air india',
    'flight', 'airline', 'fuel', 'petrol', 'diesel', 'shell', 'hpcl', 'bpcl',
    'indian oil', 'toll', 'fastag', 'transit', 'cab'
  ],
  'Health & Medical': [
    'apollo', 'pharmeasy', '1mg', 'netmeds', 'medplus', 'pharmacy', 'hospital',
    'clinic', 'cult.fit', 'cultfit', 'gym', 'fitness', 'doctor', 'healthcare', 'medical', 'dental'
  ],
  'Bills & Utilities': [
    'bescom', 'electricity', 'power', 'water', 'gas', 'tata play', 'airtel',
    'jio', 'vi', 'vodafone', 'broadband', 'act fibernet', 'recharge', 'utility',
    'bill desk', 'billdesk', 'dth'
  ],
  'Entertainment & Leisure': [
    'netflix', 'spotify', 'hotstar', 'disney', 'prime video', 'youtube', 'bookmyshow',
    'pvr', 'inox', 'cinema', 'theatre', 'steam', 'playstation', 'gaming'
  ],
  'Education & Courses': [
    'coursera', 'udemy', 'edx', 'upgrad', 'college', 'school', 'university',
    'tuition', 'fee', 'books', 'kindle', 'learning'
  ],
  'Salary / Payroll': [
    'salary', 'payroll', 'wages', 'stipend', 'employer', 'infosys', 'tcs', 'wipro'
  ],
  'Business & Sales': [
    'client payout', 'retainer', 'consulting', 'invoice payment', 'stripe payout', 'razorpay'
  ],
  'Investments & Returns': [
    'zerodha', 'groww', 'dividend', 'mutual fund', 'sip', 'interest credited', 'kuvera'
  ]
};


// Ready-made realistic bank SMS samples for user testing
export const BANK_SMS_SAMPLES = [
  {
    bank: 'HDFC Bank',
    tag: 'UPI Food Delivery',
    sms: 'Rs 540.00 debited from HDFC Bank A/c **9286 on 11-OCT-26 info UPI-SWIGGY-BANGALORE. Avl bal: Rs 38,420.00'
  },
  {
    bank: 'State Bank of India',
    tag: 'Fitness / Health',
    sms: 'Dear SBI Customer, A/c *4028 debited by Rs 2,500.00 on 10-Oct-26 transfer to CULT.FIT HEALTHCARE. Ref: 4892019'
  },
  {
    bank: 'PhonePe / GPay',
    tag: 'Cafe / Dining',
    sms: 'Paid ₹380.00 to Blue Tokai Coffee Roasters using UPI. UPI transaction ID 428910283. Google Pay ref 9283.'
  },
  {
    bank: 'ICICI Bank',
    tag: 'Utility Bill',
    sms: 'Acct XX102 debited with INR 3,420.00 on 09-Oct-26. Info: BESCOM ELECTRICITY BILL. Avl Bal: INR 78,500.00'
  },
  {
    bank: 'Axis Bank Card',
    tag: 'Ride Transit',
    sms: 'Alert: INR 340.00 spent on Axis Bank Card ending 9286 at UBER TRIP on 08-Oct-26. Avl limit: INR 1,24,500.'
  },
  {
    bank: 'Salary Credit',
    tag: 'Income (Credit)',
    sms: 'Your A/c **9286 is credited by INR 68,500.00 on 01-Oct-26 towards MONTHLY SALARY PAYROLL from TECH LABS PVT LTD.'
  }
];

/**
 * Automatically infers category based on text and merchant tokens
 */
export function inferCategory(text, isIncome = false) {
  const clean = text.toLowerCase();

  if (isIncome) {
    if (clean.includes('salary') || clean.includes('payroll')) return 'Salary / Payroll';
    if (clean.includes('dividend') || clean.includes('interest')) return 'Investments & Returns';
    if (clean.includes('client') || clean.includes('consulting') || clean.includes('stripe')) return 'Business & Sales';
    return 'Other Income';
  }

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category.includes('Salary') || category.includes('Business') || category.includes('Investments')) continue;
    for (const kw of keywords) {
      if (clean.includes(kw)) {
        return category;
      }
    }
  }

  return 'Food & Groceries'; // Sensible default discretionary category
}

/**
 * Extracts and formats the transaction date from SMS text
 */
function extractDate(text) {
  // Matches 11-OCT-26, 11-10-2026, 11/10/26, 10Oct26, etc.
  const datePatterns = [
    /(\d{1,2})[-/]([A-Za-z]{3}|\d{1,2})[-/](\d{2,4})/,
    /(\d{1,2})\s*([A-Za-z]{3})\s*(\d{2,4})?/
  ];

  const months = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      let day = match[1].padStart(2, '0');
      let month = match[2].toLowerCase();
      let year = match[3] || '2026';

      if (year.length === 2) year = `20${year}`;
      if (months[month]) {
        month = months[month];
      } else if (!isNaN(parseInt(month, 10))) {
        month = month.padStart(2, '0');
      } else {
        month = '10';
      }

      return `${year}-${month}-${day}`;
    }
  }

  return new Date().toISOString().split('T')[0];
}

/**
 * Main Bank SMS Parser
 */
export function parseBankSMS(rawText) {
  if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
    return null;
  }

  const text = rawText.trim();
  const lower = text.toLowerCase();

  // 1. Determine Income vs Expense
  const isIncome = (
    lower.includes('credited') ||
    lower.includes('credit of') ||
    lower.includes('received') ||
    lower.includes('deposited') ||
    lower.includes('refund')
  ) && !lower.includes('debited');

  // 2. Extract Amount
  // Matches: "Rs 1,450.00", "Rs. 450", "INR 340.00", "₹540.00", "by Rs 2,500"
  let amount = 0;
  const amountRegexes = [
    /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /debited\s+(?:by|with)?\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /credited\s+(?:by|with)?\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /spent\s+(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /paid\s+(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i
  ];

  for (const regex of amountRegexes) {
    const match = text.match(regex);
    if (match && match[1]) {
      const rawNum = match[1].replace(/,/g, '');
      const parsed = parseFloat(rawNum);
      if (!isNaN(parsed) && parsed > 0) {
        amount = parsed;
        break;
      }
    }
  }

  // 3. Extract Merchant or Beneficiary
  let merchant = '';
  const merchantPatterns = [
    /(?:info|towards|at|to|transfer to|vpa)\s+([A-Za-z0-9\s._\-&]+?)(?:\.|\s+on|\s+using|\s+ref|\s+avl|\s+upi|$)/i,
    /paid\s+.*?to\s+([A-Za-z0-9\s._\-&]+?)(?:\s+using|\s+for|\s+upi|\.|$)/i,
    /spent\s+.*?at\s+([A-Za-z0-9\s._\-&]+?)(?:\s+on|\s+using|\.|$)/i
  ];

  for (const pattern of merchantPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      let candidate = match[1].trim();
      // Clean up common prefixes like UPI-, BIL*
      candidate = candidate.replace(/^(upi[-_]|bil\*|pos\*|vpa[-_])/i, '');
      if (candidate.length > 2 && !candidate.toLowerCase().startsWith('rs')) {
        // Capitalize merchant name nicely
        merchant = candidate.split(' ')
          .slice(0, 4) // Keep reasonable length
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        break;
      }
    }
  }

  if (!merchant) {
    merchant = isIncome ? 'Direct Account Credit' : 'Merchant Payment';
  }

  // 4. Extract Payment Method
  let method = 'UPI / Digital Wallet (GPay, PhonePe, Paytm)';
  if (lower.includes('card ending') || lower.includes('card **')) {
    const cardMatch = text.match(/(?:ending|card\s*\*+)\s*(\d{4})/i);
    const last4 = cardMatch ? cardMatch[1] : '9286';
    method = `Smart Card •••• ${last4}`;
  } else if (lower.includes('a/c') || lower.includes('acct') || lower.includes('neft') || lower.includes('imps')) {
    method = 'Bank Direct Transfer (NEFT / IMPS)';
  } else if (lower.includes('cash')) {
    method = 'Cash / In-Hand';
  }

  // 5. Extract Reference / UTR Number
  let refNumber = null;
  const refMatch = text.match(/(?:ref|utr|id|txn)\s*(?:no\.?|id|:)?\s*([A-Za-z0-9]{6,16})/i);
  if (refMatch) {
    refNumber = refMatch[1];
  }

  // 6. Infer Category
  const category = inferCategory(merchant + ' ' + text, isIncome);

  // 7. Extract Date
  const date = extractDate(text);

  return {
    success: amount > 0,
    amount: amount,
    isIncome: isIncome,
    merchant: merchant,
    category: category,
    method: method,
    date: date,
    refNumber: refNumber,
    rawText: text
  };
}
