/**
 * Smart Expenses - Bank SMS & UPI Alert Parser Engine
 * Handles real-world banking SMS formats (SBI, ICICI, Axis, Kotak, Paytm, PhonePe, GPay, CRED, etc.)
 * Provides audio chimes, native desktop notification helpers, and smart bank detection.
 */

// Keyword mappings for auto-categorization
export const CATEGORY_KEYWORDS = {
  'Food & Groceries': [
    'swiggy', 'zomato', 'blinkit', 'zepto', 'instamart', 'supermarket', 'groceries',
    'nature basket', 'mcdonalds', 'kfc', 'dominos', 'pizza', 'starbucks', 'cafe',
    'coffee', 'blue tokai', 'restaurant', 'dining', 'bakery', 'subway', 'burger',
    'bigbasket', 'food', 'eats', 'chai', 'eatclub', 'faasos', 'haldiram'
  ],
  'Shopping & Apparel': [
    'amazon', 'flipkart', 'myntra', 'zara', 'h&m', 'ajio', 'nike', 'adidas',
    'uniqlo', 'retail', 'clothing', 'fashion', 'mall', 'electronics', 'apple',
    'croma', 'reliance digital', 'shopping', 'store', 'meesho', 'nykaa', 'tata cliq'
  ],
  'Transport & Commute': [
    'uber', 'ola', 'rapido', 'metro', 'irctc', 'railways', 'indigo', 'air india',
    'flight', 'airline', 'fuel', 'petrol', 'diesel', 'shell', 'hpcl', 'bpcl',
    'indian oil', 'toll', 'fastag', 'transit', 'cab', 'makemytrip', 'redbus'
  ],
  'Health & Medical': [
    'apollo', 'pharmeasy', '1mg', 'netmeds', 'medplus', 'pharmacy', 'hospital',
    'clinic', 'cult.fit', 'cultfit', 'gym', 'fitness', 'doctor', 'healthcare',
    'medical', 'dental', 'diagnostic', 'pathology'
  ],
  'Bills & Utilities': [
    'bescom', 'electricity', 'power', 'water', 'gas', 'tata play', 'airtel',
    'jio', 'vi', 'vodafone', 'broadband', 'act fibernet', 'recharge', 'utility',
    'bill desk', 'billdesk', 'dth', 'adani electricity', 'cesc', 'indane'
  ],
  'Entertainment & Leisure': [
    'netflix', 'spotify', 'hotstar', 'disney', 'prime video', 'youtube', 'bookmyshow',
    'pvr', 'inox', 'cinema', 'theatre', 'steam', 'playstation', 'gaming', 'audible'
  ],
  'Education & Courses': [
    'coursera', 'udemy', 'edx', 'upgrad', 'college', 'school', 'university',
    'tuition', 'fee', 'books', 'kindle', 'learning', 'unacademy', 'byju'
  ],
  'Salary / Payroll': [
    'salary', 'payroll', 'wages', 'stipend', 'employer', 'infosys', 'tcs', 'wipro', 'google', 'microsoft'
  ],
  'Business & Sales': [
    'client payout', 'retainer', 'consulting', 'invoice payment', 'stripe payout', 'razorpay', 'upwork'
  ],
  'Investments & Returns': [
    'zerodha', 'groww', 'dividend', 'mutual fund', 'sip', 'interest credited', 'kuvera', 'coinbase', 'binance'
  ]
};

// Known banks and payment providers metadata
export const BANK_DIRECTORY = {
  sbi: { name: 'State Bank of India', code: 'SBIINB', icon: '🏦', color: '#0369a1', badgeColor: '#0ea5e9' },
  icici: { name: 'ICICI Bank', code: 'ICICIB', icon: '💎', color: '#9a3412', badgeColor: '#f97316' },
  axis: { name: 'Axis Bank', code: 'AXISBK', icon: '🔴', color: '#881337', badgeColor: '#f43f5e' },
  kotak: { name: 'Kotak Mahindra Bank', code: 'KOTAKB', icon: '🟡', color: '#854d0e', badgeColor: '#eab308' },
  pnb: { name: 'Punjab National Bank', code: 'PNBSMS', icon: '🏛️', color: '#713f12', badgeColor: '#ca8a04' },
  bob: { name: 'Bank of Baroda', code: 'BOBSMS', icon: '🟠', color: '#c2410c', badgeColor: '#fb923c' },
  phonepe: { name: 'PhonePe UPI', code: 'PHONEPE', icon: '🟣', color: '#581c87', badgeColor: '#a855f7' },
  gpay: { name: 'Google Pay', code: 'GPAY', icon: '🔵', color: '#1d4ed8', badgeColor: '#60a5fa' },
  paytm: { name: 'Paytm Payments Bank', code: 'PAYTM', icon: '🔷', color: '#0e7490', badgeColor: '#06b6d4' },
  cred: { name: 'CRED Club', code: 'CREDPAY', icon: '⚡', color: '#111827', badgeColor: '#6366f1' },
};

// Ready-made realistic bank SMS samples for user testing & instant live simulation
export const BANK_SMS_SAMPLES = [
  {
    bankKey: 'sbi',
    bank: 'State Bank of India',
    sender: 'AD-SBIINB',
    tag: 'UPI Food Delivery (Swiggy)',
    icon: '🍔',
    category: 'Food & Groceries',
    amount: 540.00,
    merchant: 'Swiggy Bangalore',
    sms: 'Dear SBI Customer, A/c *4028 debited by Rs 540.00 on 23-Oct-26 info UPI-SWIGGY-BANGALORE. Avl Bal Rs 38,420.00. Ref 482910.'
  },
  {
    bankKey: 'sbi',
    bank: 'State Bank of India',
    sender: 'AD-SBIINB',
    tag: 'Fitness / Gym Pass',
    icon: '🏋️',
    category: 'Health & Medical',
    amount: 2500.00,
    merchant: 'Cult.fit Healthcare',
    sms: 'Dear SBI Customer, A/c *4028 debited by Rs 2,500.00 on 22-Oct-26 transfer to CULT.FIT HEALTHCARE. Avl Bal Rs 52,100.00. Ref: 4892019'
  },
  {
    bankKey: 'phonepe',
    bank: 'PhonePe / GPay',
    sender: 'BP-PHONEPE',
    tag: 'Artisan Cafe Dining',
    icon: '☕',
    category: 'Food & Groceries',
    amount: 380.00,
    merchant: 'Blue Tokai Coffee Roasters',
    sms: 'Paid ₹380.00 to Blue Tokai Coffee Roasters using UPI. UPI transaction ID 428910283. Google Pay ref 9283.'
  },
  {
    bankKey: 'icici',
    bank: 'ICICI Bank',
    sender: 'BZ-ICICIB',
    tag: 'Electricity Utility Bill',
    icon: '💡',
    category: 'Bills & Utilities',
    amount: 3420.00,
    merchant: 'Bescom Electricity Bill',
    sms: 'Acct XX102 debited with INR 3,420.00 on 21-Oct-26. Info: BESCOM ELECTRICITY BILL. Avl Bal: INR 78,500.00. UTR: 89301928'
  },
  {
    bankKey: 'axis',
    bank: 'Axis Bank Card',
    sender: 'CP-AXISBK',
    tag: 'Ride Transit / Commute',
    icon: '🚗',
    category: 'Transport & Commute',
    amount: 340.00,
    merchant: 'Uber Trip',
    sms: 'Alert: INR 340.00 spent on Axis Bank Card ending 9286 at UBER TRIP on 20-Oct-26. Avl limit: INR 1,24,500. Ref 928104.'
  },
  {
    bankKey: 'axis',
    bank: 'Amazon / Axis',
    sender: 'CP-AXISBK',
    tag: 'E-Commerce Shopping',
    icon: '📦',
    category: 'Shopping & Apparel',
    amount: 1899.00,
    merchant: 'Amazon India Retail',
    sms: 'Transaction Alert: Rs 1,899.00 spent on Card ending 9286 at AMAZON INDIA RETAIL on 19-Oct-26. Ref: 82019482.'
  },
  {
    bankKey: 'kotak',
    bank: 'Kotak Mahindra Bank',
    sender: 'VK-KOTAKB',
    tag: 'Weekend Dining Pizza',
    icon: '🍕',
    category: 'Food & Groceries',
    amount: 620.00,
    merchant: 'Dominos Pizza',
    sms: 'Your Kotak Bank A/c XX4028 is debited for Rs 620.00 towards DOMINOS PIZZA on 18-Oct-26. Bal: Rs 19,450.00'
  },
  {
    bankKey: 'icici',
    bank: 'Salary Payroll Credit',
    sender: 'BZ-ICICIB',
    tag: 'Income (Credit)',
    icon: '💼',
    category: 'Salary / Payroll',
    amount: 68500.00,
    merchant: 'Tech Labs Pvt Ltd Payroll',
    sms: 'Your ICICI Bank A/c **9286 is credited by INR 68,500.00 on 01-Oct-26 towards MONTHLY SALARY PAYROLL from TECH LABS PVT LTD. Avl bal: Rs 1,06,920.00'
  }
];

/**
 * Detects bank identity from text or SMS sender ID
 */
export function detectBank(text = '', sender = '') {
  const combined = `${sender} ${text}`.toLowerCase();

  if (combined.includes('sbi') || combined.includes('state bank')) return BANK_DIRECTORY.sbi;
  if (combined.includes('icici')) return BANK_DIRECTORY.icici;
  if (combined.includes('axis')) return BANK_DIRECTORY.axis;
  if (combined.includes('kotak')) return BANK_DIRECTORY.kotak;
  if (combined.includes('pnb') || combined.includes('punjab national')) return BANK_DIRECTORY.pnb;
  if (combined.includes('bob') || combined.includes('baroda')) return BANK_DIRECTORY.bob;
  if (combined.includes('phonepe')) return BANK_DIRECTORY.phonepe;
  if (combined.includes('gpay') || combined.includes('google pay')) return BANK_DIRECTORY.gpay;
  if (combined.includes('paytm')) return BANK_DIRECTORY.paytm;
  if (combined.includes('cred')) return BANK_DIRECTORY.cred;

  return {
    name: 'Bank Notification Alert',
    code: 'BANK-ALERT',
    icon: '⚡',
    color: '#1e293b',
    badgeColor: '#38bdf8'
  };
}

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
 * Extracts transaction date from SMS text
 */
function extractDate(text) {
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
 * Main Bank SMS & Notification Parser
 */
export function parseBankSMS(rawText, sender = '') {
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
      candidate = candidate.replace(/^(upi[-_]|bil\*|pos\*|vpa[-_])/i, '');
      if (candidate.length > 2 && !candidate.toLowerCase().startsWith('rs')) {
        merchant = candidate.split(' ')
          .slice(0, 4)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        break;
      }
    }
  }

  if (!merchant) {
    merchant = isIncome ? 'Direct Account Credit' : 'Merchant Payment';
  }

  // 4. Extract Payment Method and Card/Account number
  let cardOrAccount = null;
  const acctMatch = text.match(/(?:a\/c|acct|card|ending)\s*[*xX]*(\d{4})/i);
  if (acctMatch) {
    cardOrAccount = acctMatch[1];
  }

  let method = 'UPI / Digital Wallet (GPay, PhonePe, Paytm)';
  if (lower.includes('card ending') || lower.includes('card **') || lower.includes('card *')) {
    method = `Smart Card •••• ${cardOrAccount || '9286'}`;
  } else if (lower.includes('a/c') || lower.includes('acct') || lower.includes('neft') || lower.includes('imps')) {
    method = `Bank Direct Transfer (A/c •••• ${cardOrAccount || '9286'})`;
  } else if (lower.includes('cash')) {
    method = 'Cash / In-Hand';
  }

  // 5. Extract Reference / UTR Number
  let refNumber = null;
  const refMatch = text.match(/(?:ref|utr|id|txn)\s*(?:no\.?|id|:)?\s*([A-Za-z0-9]{6,16})/i);
  if (refMatch) {
    refNumber = refMatch[1];
  }

  // 6. Extract Available Balance if present
  let availBalance = null;
  const balMatch = text.match(/(?:avl|avail|available)?\s*(?:bal|balance|limit)\s*(?:is|:)?\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (balMatch && balMatch[1]) {
    const b = parseFloat(balMatch[1].replace(/,/g, ''));
    if (!isNaN(b)) {
      availBalance = b;
    }
  }

  // 7. Detect Bank Identity
  const bankInfo = detectBank(text, sender);

  // 8. Infer Category
  const category = inferCategory(merchant + ' ' + text, isIncome);

  // 9. Extract Date
  const date = extractDate(text);

  // 10. Confidence Score
  let confidence = 80;
  if (amount > 0) confidence += 10;
  if (merchant && merchant !== 'Merchant Payment') confidence += 5;
  if (refNumber || cardOrAccount) confidence += 4;

  return {
    success: amount > 0,
    amount: amount,
    isIncome: isIncome,
    merchant: merchant,
    category: category,
    method: method,
    date: date,
    refNumber: refNumber,
    cardOrAccount: cardOrAccount,
    availBalance: availBalance,
    bankName: bankInfo.name,
    bankIcon: bankInfo.icon,
    bankColor: bankInfo.color,
    bankBadgeColor: bankInfo.badgeColor,
    confidence: Math.min(confidence, 99),
    rawText: text,
    timestamp: new Date().toISOString()
  };
}

/**
 * Web Audio API synthesizer for playing a subtle luxury crystal chime
 * Triggered automatically when bank message arrives
 */
export function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // First tone (880 Hz - A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.25, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.36);

    // Second chime overtone (1318.5 Hz - E6) slightly delayed
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.5, now + 0.09);
    gain2.gain.setValueAtTime(0, now + 0.09);
    gain2.gain.linearRampToValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.09);
    osc2.stop(now + 0.56);
  } catch (err) {
    // Audio context may be restricted by autoplay policy before first gesture
    console.warn('Audio chime notice:', err);
  }
}

/**
 * Requests browser permission for desktop push notifications
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

/**
 * Fires a native browser system notification for incoming bank transactions
 */
export function showNativeBankNotification(parsed) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const sign = parsed.isIncome ? '+' : '-';
    const title = `${parsed.bankIcon || '⚡'} ${parsed.bankName || 'Bank Alert'}: ${sign}₹${parsed.amount.toLocaleString('en-IN')}`;
    const body = `${parsed.merchant} • Auto-categorized as ${parsed.category} (Logged to Smart Expenses)`;

    new Notification(title, {
      body: body,
      icon: '/favicon.ico',
      tag: parsed.refNumber || `bank_tx_${Date.now()}`
    });
  } catch (err) {
    console.warn('Native notification failed:', err);
  }
}

/**
 * Scans clipboard for bank SMS message
 */
export async function scanClipboardForBankSMS() {
  if (!navigator.clipboard || !navigator.clipboard.readText) {
    throw new Error('Clipboard API not supported in this browser');
  }
  const text = await navigator.clipboard.readText();
  if (!text || text.trim().length === 0) {
    return null;
  }
  const parsed = parseBankSMS(text);
  return {
    rawText: text,
    parsed: parsed
  };
}
