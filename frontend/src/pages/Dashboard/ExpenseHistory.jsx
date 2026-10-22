import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoredTransactions } from '../../utils/transactionStore';

export default function ExpenseHistory() {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expenses, setExpenses] = useState(() => getStoredTransactions());

  useEffect(() => {
    const handleUpdate = () => {
      setExpenses(getStoredTransactions());
    };
    window.addEventListener('smart_expenses_transactions_updated', handleUpdate);
    return () => window.removeEventListener('smart_expenses_transactions_updated', handleUpdate);
  }, []);

  const filteredExpenses = expenses.filter((item) => {
    const matchCat = filterCategory === 'All' || item.category === filterCategory || item.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchSearch = (item.merchant || item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (item.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (item.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
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
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ flex: '1 1 180px', minWidth: 0, position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by merchant, note, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem', background: '#f1f5f9', border: '1px solid #e2e8f0', width: '100%' }}
            />
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
              🔍
            </span>
          </div>

          <div style={{ flex: '1 1 140px', minWidth: 0 }}>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', width: '100%' }}
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
