// Shared Transaction Store utilizing LocalStorage with default mock records

export const DEFAULT_TRANSACTIONS = [
  { 
    id: 101, 
    date: '2026-09-26', 
    time: 'Today, 09:42', 
    name: 'Adobe Creative Cloud', 
    merchant: 'Adobe Creative Cloud', 
    category: 'Bills & Utilities', 
    amount: -1450.00, 
    method: 'VISA •••• 9286 (Smart Card)', 
    icon: '🎨', 
    isIncome: false, 
    notes: 'Monthly Creative Cloud All Apps subscription' 
  },
  { 
    id: 102, 
    date: '2026-09-26', 
    time: 'Today, 08:10', 
    name: 'Stripe Merchant Payout', 
    merchant: 'Stripe Payout', 
    category: 'Business & Sales', 
    amount: 18500.00, 
    method: 'Bank Direct Transfer', 
    icon: '💼', 
    isIncome: true, 
    notes: 'Web App Consulting retainer payout' 
  },
  { 
    id: 103, 
    date: '2026-09-25', 
    time: 'Sep 25, 10:22', 
    name: 'Office Supplies Inc', 
    merchant: 'Office Supplies Inc', 
    category: 'Shopping & Apparel', 
    amount: -750.00, 
    method: 'Mastercard •••• 4028 (Platinum)', 
    icon: '📎', 
    isIncome: false, 
    notes: 'Stationery and printer cartridges' 
  },
  { 
    id: 104, 
    date: '2026-09-24', 
    time: 'Sep 24, 18:30', 
    name: 'Nature Basket Supermarket', 
    merchant: 'Nature Basket Supermarket', 
    category: 'Food & Groceries', 
    amount: -3420.00, 
    method: 'VISA •••• 9286 (Smart Card)', 
    icon: '🛒', 
    isIncome: false, 
    notes: 'Weekly household groceries and organic produce' 
  },
  { 
    id: 105, 
    date: '2026-09-23', 
    time: 'Sep 23, 21:15', 
    name: 'Uber City Transit', 
    merchant: 'Uber City Transit', 
    category: 'Transport & Commute', 
    amount: -340.00, 
    method: 'UPI / Digital Wallet', 
    icon: '🚗', 
    isIncome: false, 
    notes: 'City center commute' 
  },
  { 
    id: 106, 
    date: '2026-09-22', 
    time: 'Sep 22, 13:40', 
    name: 'Blue Tokai Coffee Roasters', 
    merchant: 'Blue Tokai Coffee', 
    category: 'Entertainment & Leisure', 
    amount: -480.00, 
    method: 'VISA •••• 9286 (Smart Card)', 
    icon: '☕', 
    isIncome: false, 
    notes: 'Coffee with design client' 
  },
  { 
    id: 107, 
    date: '2026-09-21', 
    time: 'Sep 21, 16:00', 
    name: 'Nike Flagship Store', 
    merchant: 'Nike Flagship Store', 
    category: 'Shopping & Apparel', 
    amount: -4200.00, 
    method: 'Mastercard •••• 4028 (Platinum)', 
    icon: '👕', 
    isIncome: false, 
    notes: 'Running sneakers and training gear' 
  },
  { 
    id: 108, 
    date: '2026-09-20', 
    time: 'Sep 20, 11:20', 
    name: 'Cult.fit Gym Pass', 
    merchant: 'Cult.fit Gym Pass', 
    category: 'Health & Medical', 
    amount: -2500.00, 
    method: 'VISA •••• 9286 (Smart Card)', 
    icon: '🏋️', 
    isIncome: false, 
    notes: 'Monthly gym and fitness pass' 
  },
];

export function getStoredTransactions() {
  try {
    const saved = localStorage.getItem('smart_expenses_transactions');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse transactions from localStorage', err);
  }
  // Initialize localStorage with defaults if empty
  try {
    localStorage.setItem('smart_expenses_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
  } catch {}
  return DEFAULT_TRANSACTIONS;
}

export function saveTransaction(tx) {
  const current = getStoredTransactions();
  const updated = [tx, ...current];
  try {
    localStorage.setItem('smart_expenses_transactions', JSON.stringify(updated));
    // Trigger custom event for real-time reactivity
    window.dispatchEvent(new Event('smart_expenses_transactions_updated'));
  } catch (err) {
    console.error('Failed to save transaction to localStorage', err);
  }
  return updated;
}
