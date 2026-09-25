import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ExpenseHistory() {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const mockExpenses = [
    { id: 101, date: 'Today, 09:42', category: 'Software & Design', merchant: 'Adobe Creative Cloud', amount: -1450.00, method: 'VISA •••• 9286', icon: '🎨' },
    { id: 102, date: 'Today, 08:10', category: 'Merchant Income', merchant: 'Stripe Payout', amount: 18500.00, method: 'Bank Transfer', icon: 'S', isIncome: true },
    { id: 103, date: 'Jan 28, 10:22', category: 'Workplace & Stationery', merchant: 'Office Supplies Inc', amount: -750.00, method: 'Mastercard •••• 4028', icon: '📎' },
    { id: 104, date: 'Jan 27, 18:30', category: 'Groceries', merchant: 'Nature Basket Supermarket', amount: -3420.00, method: 'VISA •••• 9286', icon: '🛒' },
    { id: 105, date: 'Jan 26, 21:15', category: 'Travel', merchant: 'Uber City Transit', amount: -340.00, method: 'UPI', icon: '🚗' },
    { id: 106, date: 'Jan 24, 13:40', category: 'Cafes and Restaurants', merchant: 'Blue Tokai Coffee', amount: -480.00, method: 'VISA •••• 9286', icon: '☕' },
    { id: 107, date: 'Jan 22, 16:00', category: 'Clothes and Shoes', merchant: 'Nike Flagship Store', amount: -4200.00, method: 'Mastercard •••• 4028', icon: '👕' },
    { id: 108, date: 'Jan 20, 11:20', category: 'Sport', merchant: 'Cult.fit Gym Pass', amount: -2500.00, method: 'VISA •••• 9286', icon: '🏋️' },
  ];

  const filteredExpenses = mockExpenses.filter((item) => {
    const matchCat = filterCategory === 'All' || item.category === filterCategory;
    const matchSearch = item.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          letterSpacing: '-0.02em', 
          marginBottom: '0.35rem',
          color: '#ffffff'
        }}>
          Recent Transactions
        </h1>
        <p style={{ color: 'var(--text-royal-muted)', fontSize: '0.95rem' }}>
          Real-time activity ledger linked to physical smart cards and connected bank feeds.
        </p>
      </div>

      {/* Porcelain Sheet Container */}
      <div className="sheet-porcelain" style={{ borderRadius: '28px' }}>
        {/* Search & Filter Pill Bar */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by merchant, note, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem', background: '#f1f5f9', border: '1px solid #e2e8f0' }}
            />
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
              🔍
            </span>
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
            >
              <option value="All">All Categories</option>
              <option value="Groceries">Groceries</option>
              <option value="Clothes and Shoes">Clothes and Shoes</option>
              <option value="Cafes and Restaurants">Cafes and Restaurants</option>
              <option value="Sport">Sport</option>
              <option value="Travel">Travel</option>
              <option value="Software & Design">Software & Design</option>
              <option value="Merchant Income">Merchant Income</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Category</th>
                <th>Payment Source</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: exp.isIncome ? '#eff6ff' : '#f1f5f9',
                        color: exp.isIncome ? '#2563eb' : '#0f172a',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem'
                      }}>
                        {exp.icon}
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{exp.merchant}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.65rem', 
                      borderRadius: '9999px', 
                      background: '#f1f5f9', 
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#475569'
                    }}>
                      {exp.category}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{exp.method}</td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{exp.date}</td>
                  <td>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.98rem',
                      color: exp.isIncome ? '#16a34a' : '#0f172a'
                    }}>
                      {exp.isIncome ? '+' : '-'}₹{Math.abs(exp.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
