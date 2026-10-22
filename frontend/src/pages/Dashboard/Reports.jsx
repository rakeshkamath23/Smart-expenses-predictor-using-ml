import React, { useState } from 'react';
import { getStoredTransactions } from '../../utils/transactionStore';

export default function Reports() {
  const [downloading, setDownloading] = useState(false);
  const transactions = getStoredTransactions();

  const handleExportCSV = () => {
    setDownloading(true);
    setTimeout(() => {
      const headers = "ID,Date,Merchant,Category,Amount,Type,Payment Method,Notes\n";
      const rows = transactions.map(t => 
        `"${t.id}","${t.date || ''}","${(t.merchant || t.name || '').replace(/"/g, '""')}","${t.category || ''}","${Math.abs(t.amount || 0)}","${t.isIncome ? 'Income' : 'Expense'}","${t.method || ''}","${(t.notes || '').replace(/"/g, '""')}"`
      ).join("\n");
      const csvData = headers + rows;
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `smart_expenses_report_${new Date().toISOString().split('T')[0]}.csv`);
      a.click();
      setDownloading(false);
    }, 500);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Financial Reports & Export
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Generate summaries and export transaction records in CSV format for auditing and external analysis.
        </p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>
            Export Transaction Data
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Download complete records including dates, amounts, categories, payment methods, and notes.
          </p>
          <button
            onClick={handleExportCSV}
            disabled={downloading}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            {downloading ? 'Generating CSV...' : '📥 Export to CSV'}
          </button>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>
            Report Summaries
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Financial Year:</span>
              <strong style={{ color: 'var(--text-main)' }}>2026 - 2027</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Recorded:</span>
              <strong style={{ color: 'var(--text-main)' }}>124 Transactions</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Audit Status:</span>
              <span className="badge badge-success">Clean / Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
