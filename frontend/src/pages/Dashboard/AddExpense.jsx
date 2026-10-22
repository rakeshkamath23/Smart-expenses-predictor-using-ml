import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveTransaction } from '../../utils/transactionStore';
import { parseBankSMS, BANK_SMS_SAMPLES } from '../../utils/smsParser';
import { performReceiptOCR, parseReceiptText, SAMPLE_RECEIPTS } from '../../utils/receiptParser';

export default function AddExpense() {
  const navigate = useNavigate();

  // Active Collection Mode: 'sms' (Bank SMS/UPI), 'ocr' (AI Receipt OCR), 'manual' (Manual Form)
  const [collectionMode, setCollectionMode] = useState('sms');

  // Transaction Type: 'expense' or 'income'
  const [transactionType, setTransactionType] = useState('expense');

  // Form State (Manual / Editable)
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Groceries');
  const [paymentMethod, setPaymentMethod] = useState('VISA •••• 9286 (Smart Debit Card)');
  const [merchant, setMerchant] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);

  // Status & Validation Messages
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Bank SMS Mode State
  const [smsInput, setSmsInput] = useState(BANK_SMS_SAMPLES[0].sms);
  const [parsedSmsResult, setParsedSmsResult] = useState(() => parseBankSMS(BANK_SMS_SAMPLES[0].sms));

  // 2. Receipt OCR Mode State
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState({ status: '', progress: 0 });
  const [ocrResult, setOcrResult] = useState(() => parseReceiptText(SAMPLE_RECEIPTS[0].simulatedText));
  const [activeSampleReceipt, setActiveSampleReceipt] = useState(SAMPLE_RECEIPTS[0]);

  // Dynamic Payment Sources (Combining saved cards from profile + standard methods)
  const [paymentMethods, setPaymentMethods] = useState([
    'UPI / Digital Wallet (GPay, PhonePe, Paytm)',
    'VISA •••• 9286 (Smart Debit Card)',
    'Mastercard •••• 4028 (Platinum Credit)',
    'Bank Direct Transfer (NEFT / IMPS)',
    'Cash / In-Hand'
  ]);

  useEffect(() => {
    try {
      const savedCards = localStorage.getItem('smart_expenses_cards');
      if (savedCards) {
        const cards = JSON.parse(savedCards);
        if (Array.isArray(cards) && cards.length > 0) {
          const cardOptions = cards.map(
            (c) => `${c.network || 'Card'} •••• ${c.last4 || '0000'} (${c.cardType || 'Card'})`
          );
          setPaymentMethods([
            'UPI / Digital Wallet (GPay, PhonePe, Paytm)',
            ...cardOptions,
            'Bank Direct Transfer (NEFT / IMPS)',
            'Cash / In-Hand'
          ]);
          setPaymentMethod(cardOptions[0] || 'UPI / Digital Wallet (GPay, PhonePe, Paytm)');
        }
      }
    } catch {}
  }, []);

  // Update SMS parsing in real time
  const handleSmsChange = (text) => {
    setSmsInput(text);
    const res = parseBankSMS(text);
    setParsedSmsResult(res);
  };

  const loadSmsSample = (sample) => {
    setSmsInput(sample.sms);
    const res = parseBankSMS(sample.sms);
    setParsedSmsResult(res);
    setErrorMessage('');
  };

  // Handle OCR upload
  const handleOcrFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Receipt image must be under 8MB');
      return;
    }

    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = async () => {
      setReceiptPreview(reader.result);
      setOcrScanning(true);
      setOcrProgress({ status: 'Starting Neural Vision Scanner...', progress: 15 });

      try {
        const res = await performReceiptOCR(reader.result, (prog) => {
          setOcrProgress(prog);
        });
        setOcrResult(res);
      } catch (err) {
        console.error('OCR failed', err);
      } finally {
        setOcrScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const loadSampleReceipt = (receipt) => {
    setActiveSampleReceipt(receipt);
    setReceiptFile(null);
    setReceiptPreview(null);
    setOcrProgress({ status: 'Simulating instant scan...', progress: 100 });
    const res = parseReceiptText(receipt.simulatedText);
    setOcrResult(res);
  };

  // Commit Parsed SMS Transaction to Store
  const handleSaveSmsTransaction = () => {
    if (!parsedSmsResult || !parsedSmsResult.success) {
      setErrorMessage('Could not extract a valid amount from the SMS text.');
      return;
    }

    const signedAmount = parsedSmsResult.isIncome ? Math.abs(parsedSmsResult.amount) : -Math.abs(parsedSmsResult.amount);
    const icon = parsedSmsResult.isIncome ? '💰' : '⚡';

    const newTx = {
      id: Date.now(),
      date: parsedSmsResult.date,
      time: 'Auto-Collected (SMS)',
      name: parsedSmsResult.merchant,
      merchant: parsedSmsResult.merchant,
      category: parsedSmsResult.category,
      amount: signedAmount,
      method: parsedSmsResult.method,
      icon: icon,
      isIncome: parsedSmsResult.isIncome,
      notes: `Auto-parsed from bank SMS${parsedSmsResult.refNumber ? ` (Ref: ${parsedSmsResult.refNumber})` : ''}`,
      receiptFileName: null,
    };

    saveTransaction(newTx);

    setStatusMessage({
      type: parsedSmsResult.isIncome ? 'income' : 'expense',
      amount: parsedSmsResult.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
      category: parsedSmsResult.category,
      merchant: parsedSmsResult.merchant,
      method: parsedSmsResult.method,
      source: 'Bank SMS Alert'
    });
  };

  // Commit Parsed OCR Receipt Transaction to Store
  const handleSaveOcrTransaction = () => {
    if (!ocrResult || !ocrResult.success) {
      setErrorMessage('Could not extract a valid amount from the receipt.');
      return;
    }

    const signedAmount = -Math.abs(ocrResult.amount);
    const itemsSummary = ocrResult.items && ocrResult.items.length > 0 ? ocrResult.items.slice(0, 3).join(', ') : '';

    const newTx = {
      id: Date.now(),
      date: ocrResult.date,
      time: 'Auto-Collected (AI Receipt OCR)',
      name: ocrResult.merchant,
      merchant: ocrResult.merchant,
      category: ocrResult.category,
      amount: signedAmount,
      method: ocrResult.method,
      icon: '📸',
      isIncome: false,
      notes: `Scanned Receipt${itemsSummary ? `: ${itemsSummary}` : ''}`,
      receiptFileName: receiptFile ? receiptFile.name : `${ocrResult.merchant}_Receipt.png`,
    };

    saveTransaction(newTx);

    setStatusMessage({
      type: 'expense',
      amount: ocrResult.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
      category: ocrResult.category,
      merchant: ocrResult.merchant,
      method: ocrResult.method,
      source: 'AI Receipt OCR Scanner'
    });
  };

  // Transfer Parsed Data into Manual Form for Editing
  const transferToManualForm = (data, isFromSms = true) => {
    setTransactionType(data.isIncome ? 'income' : 'expense');
    setAmount(data.amount.toString());
    setCategory(data.category);
    setMerchant(data.merchant);
    setDate(data.date);
    setPaymentMethod(data.method);
    setNotes(isFromSms ? `SMS: ${data.rawText.slice(0, 100)}...` : `Receipt scanned: ${data.merchant}`);
    setCollectionMode('manual');
  };

  // Expense Categories
  const expenseCategories = [
    { label: 'Food & Groceries', icon: '🛒', color: '#38bdf8' },
    { label: 'Shopping & Apparel', icon: '🛍', color: '#818cf8' },
    { label: 'Transport & Commute', icon: '🚗', color: '#34d399' },
    { label: 'Health & Medical', icon: '💖', color: '#f43f5e' },
    { label: 'Bills & Utilities', icon: '💡', color: '#60a5fa' },
    { label: 'Entertainment & Leisure', icon: '🎬', color: '#fbbf24' },
    { label: 'Education & Courses', icon: '📚', color: '#a78bfa' },
    { label: 'Other Expenses', icon: '📦', color: '#94a3b8' },
  ];

  // Income Categories
  const incomeCategories = [
    { label: 'Salary / Payroll', icon: '💼', color: '#34d399' },
    { label: 'Freelance & Consulting', icon: '💻', color: '#38bdf8' },
    { label: 'Business & Sales', icon: '🏬', color: '#fbbf24' },
    { label: 'Investments & Returns', icon: '📈', color: '#818cf8' },
    { label: 'Rental & Real Estate', icon: '🏡', color: '#60a5fa' },
    { label: 'Gifts & Grants', icon: '🎁', color: '#f43f5e' },
    { label: 'Other Income', icon: '💵', color: '#10b981' },
  ];

  const currentCategories = transactionType === 'expense' ? expenseCategories : incomeCategories;

  // Handle Manual Form Submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than ₹0.00');
      return;
    }

    if (!category) {
      setErrorMessage('Please select a category for this transaction');
      return;
    }

    const isIncome = transactionType === 'income';
    const signedAmount = isIncome ? Math.abs(parsedAmount) : -Math.abs(parsedAmount);

    const activeCatObj = currentCategories.find((c) => c.label === category);
    const categoryIcon = activeCatObj?.icon || (isIncome ? '💰' : '💳');

    const newTransaction = {
      id: Date.now(),
      date: date || new Date().toISOString().split('T')[0],
      time: 'Manual Entry',
      name: merchant.trim() || category,
      merchant: merchant.trim() || category,
      category: category,
      amount: signedAmount,
      method: paymentMethod,
      icon: categoryIcon,
      isIncome: isIncome,
      notes: notes.trim(),
      receiptFileName: receiptFile ? receiptFile.name : null,
    };

    saveTransaction(newTransaction);

    setStatusMessage({
      type: transactionType,
      amount: parsedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
      category: category,
      merchant: merchant.trim() || category,
      method: paymentMethod,
      source: 'Manual Form'
    });

    setAmount('');
    setMerchant('');
    setNotes('');
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '860px', margin: '0 auto', width: '100%', minWidth: 0 }}>
      {/* Mode Selector Navigation Tabs (Top Horizontal Layout) */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        width: '100%'
      }}>
        <div className="add-expense-tabs" role="tablist" aria-label="Transaction Entry Mode">
          <button
            type="button"
            role="tab"
            aria-selected={collectionMode === 'sms'}
            onClick={() => { setCollectionMode('sms'); setErrorMessage(''); }}
            className={`add-expense-tab-btn ${collectionMode === 'sms' ? 'active-sms' : ''}`}
          >
            <span>⚡</span>
            <span>Bank SMS & UPI</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={collectionMode === 'ocr'}
            onClick={() => { setCollectionMode('ocr'); setErrorMessage(''); }}
            className={`add-expense-tab-btn ${collectionMode === 'ocr' ? 'active-ocr' : ''}`}
          >
            <span>📸</span>
            <span>AI Receipt OCR</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={collectionMode === 'manual'}
            onClick={() => { setCollectionMode('manual'); setErrorMessage(''); }}
            className={`add-expense-tab-btn ${collectionMode === 'manual' ? 'active-manual' : ''}`}
          >
            <span>✍️</span>
            <span>Manual Entry</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {statusMessage && (
        <div style={{
          padding: '1.1rem 1.4rem',
          borderRadius: '18px',
          backgroundColor: statusMessage.type === 'income' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(37, 99, 235, 0.2)',
          border: `1px solid ${statusMessage.type === 'income' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          animation: 'fadeIn 0.3s ease',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: statusMessage.type === 'income' ? '#6ee7b7' : '#7dd3fc' }}>
              ✅ {statusMessage.type === 'income' ? 'Income' : 'Expense'} of ₹{statusMessage.amount} Logged Successfully!
            </div>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
              Merchant: <strong>{statusMessage.merchant}</strong> • Category: <strong>{statusMessage.category}</strong> • Method: <strong>{statusMessage.method}</strong> • Source: <span style={{ color: '#fcd34d' }}>{statusMessage.source}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Link
              to="/dashboard/history"
              style={{
                fontSize: '0.85rem',
                padding: '0.45rem 1rem',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              View in Ledger &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div style={{
          padding: '0.85rem 1.2rem',
          borderRadius: '14px',
          backgroundColor: 'rgba(244, 63, 94, 0.18)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          color: '#fca5a5',
          fontSize: '0.88rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Main Glassmorphic Container */}
      <div className="add-expense-card">

        {/* ============================================================== */}
        {/* MODE 1: BANK SMS & UPI ALERT PARSER                            */}
        {/* ============================================================== */}
        {collectionMode === 'sms' && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.92rem', fontWeight: 700, color: '#e2e8f0' }}>
                  Paste Bank SMS or UPI Notification Alert
                </label>
                <span style={{ fontSize: '0.78rem', color: '#93c5fd' }}>
                  Supports HDFC, SBI, ICICI, Axis, PhonePe, GPay, Paytm, etc.
                </span>
              </div>
              <textarea
                rows={3}
                value={smsInput}
                onChange={(e) => handleSmsChange(e.target.value)}
                placeholder="e.g. Rs 540.00 debited from HDFC Bank A/c **9286 on 11-OCT-26 info UPI-SWIGGY. Avl bal: Rs 38,420."
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '16px',
                  background: 'rgba(7, 21, 46, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                }}
              />
            </div>

            {/* Quick Test Bank Templates */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                Or try 1-Click Real-World Bank Templates:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {BANK_SMS_SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadSmsSample(sample)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '0.45rem 0.85rem',
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                  >
                    <span>🏦</span>
                    <span>{sample.bank}</span>
                    <span style={{ color: '#93c5fd', fontSize: '0.75rem' }}>({sample.tag})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Real-Time Extraction Preview Card */}
            {parsedSmsResult && (
              <div style={{
                background: parsedSmsResult.success ? 'rgba(8, 22, 48, 0.85)' : 'rgba(30, 20, 30, 0.6)',
                borderRadius: '20px',
                border: `1px solid ${parsedSmsResult.success ? 'rgba(56, 189, 248, 0.35)' : 'rgba(244, 63, 94, 0.4)'}`,
                padding: '1.5rem',
                marginBottom: '1.5rem',
                position: 'relative',
                boxShadow: '0 12px 35px rgba(0,0,0,0.35)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>{parsedSmsResult.isIncome ? '💰' : '⚡'}</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                      {parsedSmsResult.success ? 'Real-Time Parsed Transaction' : 'Parsing Alert'}
                    </h3>
                  </div>
                  {parsedSmsResult.success && (
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.7rem',
                      borderRadius: '9999px',
                      background: parsedSmsResult.isIncome ? 'rgba(16, 185, 129, 0.25)' : 'rgba(37, 99, 235, 0.3)',
                      color: parsedSmsResult.isIncome ? '#6ee7b7' : '#93c5fd',
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}>
                      Confidence: 98% (Regex & NLP Match)
                    </span>
                  )}
                </div>

                {parsedSmsResult.success ? (
                  <div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1.4rem'
                    }}>
                      {/* Amount */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.9rem', borderRadius: '14px' }}>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                          Amount ({parsedSmsResult.isIncome ? 'Credit' : 'Debit'})
                        </div>
                        <div style={{
                          fontSize: '1.4rem',
                          fontWeight: 800,
                          color: parsedSmsResult.isIncome ? '#34d399' : '#f43f5e',
                          marginTop: '0.2rem'
                        }}>
                          {parsedSmsResult.isIncome ? '+' : '-'}₹{parsedSmsResult.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      {/* Merchant */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.9rem', borderRadius: '14px' }}>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                          Merchant / Payee
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {parsedSmsResult.merchant}
                        </div>
                      </div>

                      {/* Category */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.9rem', borderRadius: '14px' }}>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                          Auto-Category
                        </div>
                        <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.2rem' }}>
                          🏷️ {parsedSmsResult.category}
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.9rem', borderRadius: '14px' }}>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                          Payment Method
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          💳 {parsedSmsResult.method}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={handleSaveSmsTransaction}
                        style={{
                          flex: 1,
                          minWidth: '220px',
                          padding: '0.85rem 1.6rem',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                          color: '#ffffff',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          border: '1px solid rgba(255,255,255,0.25)',
                          boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span>⚡ Approve & Save to Ledger</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => transferToManualForm(parsedSmsResult, true)}
                        style={{
                          padding: '0.85rem 1.4rem',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.09)',
                          color: '#e2e8f0',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          border: '1px solid rgba(255,255,255,0.18)',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️ Edit in Form
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#fca5a5', fontSize: '0.9rem' }}>
                    Could not identify amount or merchant format. Paste a standard bank SMS or try a 1-click sample above.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE 2: AI RECEIPT & BILL OCR SCANNER                          */}
        {/* ============================================================== */}
        {collectionMode === 'ocr' && (
          <div>
            {/* Upload Area */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1.5rem',
                borderRadius: '20px',
                background: 'rgba(7, 21, 46, 0.6)',
                border: '2px dashed rgba(139, 92, 246, 0.45)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.45)'}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOcrFileUpload}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>📸</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                  Upload Receipt / Bill Photo
                </span>
                <span style={{ fontSize: '0.82rem', color: '#93c5fd', marginTop: '0.2rem' }}>
                  Drop PNG, JPG or camera capture (Powered by Tesseract.js Neural OCR)
                </span>
              </label>
            </div>

            {/* Quick Test Receipt Samples */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                Or test with sample digital receipts:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {SAMPLE_RECEIPTS.map((receipt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadSampleReceipt(receipt)}
                    style={{
                      background: activeSampleReceipt?.name === receipt.name ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                      border: `1px solid ${activeSampleReceipt?.name === receipt.name ? 'rgba(139, 92, 246, 0.6)' : 'rgba(255, 255, 255, 0.15)'}`,
                      borderRadius: '10px',
                      padding: '0.45rem 0.85rem',
                      color: '#e2e8f0',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span>🧾</span>
                    <span>{receipt.name}</span>
                    <span style={{ color: '#c4b5fd', fontSize: '0.75rem' }}>(₹{receipt.amount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* OCR Live Progress Bar */}
            {ocrScanning && (
              <div style={{
                background: 'rgba(8, 22, 48, 0.9)',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(139, 92, 246, 0.4)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <span style={{ color: '#c4b5fd' }}>{ocrProgress.status}</span>
                  <span style={{ color: '#ffffff' }}>{ocrProgress.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${ocrProgress.progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            )}

            {/* OCR Parsed Result Breakdown Card */}
            {ocrResult && !ocrScanning && (
              <div style={{
                background: 'rgba(8, 22, 48, 0.88)',
                borderRadius: '20px',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 12px 35px rgba(0,0,0,0.35)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>🧾</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                      AI Extracted Bill Summary
                    </h3>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.7rem',
                    borderRadius: '9999px',
                    background: 'rgba(139, 92, 246, 0.25)',
                    color: '#c4b5fd',
                    border: '1px solid rgba(139, 92, 246, 0.4)'
                  }}>
                    Neural OCR Verified
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  {/* Total Amount */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.9rem', borderRadius: '14px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                      Total Bill Amount
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f43f5e', marginTop: '0.2rem' }}>
                      -₹{ocrResult.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Store / Merchant */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.9rem', borderRadius: '14px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                      Store / Merchant
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ocrResult.merchant}
                    </div>
                  </div>

                  {/* Auto-Category */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.9rem', borderRadius: '14px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                      Category Tag
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#a78bfa', marginTop: '0.2rem' }}>
                      🏷️ {ocrResult.category}
                    </div>
                  </div>

                  {/* Date */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.9rem', borderRadius: '14px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                      Receipt Date
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#cbd5e1', marginTop: '0.2rem' }}>
                      📅 {ocrResult.date}
                    </div>
                  </div>
                </div>

                {/* Line Items Breakdown */}
                {ocrResult.items && ocrResult.items.length > 0 && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Detected Line Items ({ocrResult.items.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {ocrResult.items.map((it, i) => (
                        <div key={i} style={{ fontSize: '0.82rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ color: '#8b5cf6' }}>•</span>
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleSaveOcrTransaction}
                    style={{
                      flex: 1,
                      minWidth: '220px',
                      padding: '0.85rem 1.6rem',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      border: '1px solid rgba(255,255,255,0.25)',
                      boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>📸 Approve & Save Receipt to Ledger</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => transferToManualForm(ocrResult, false)}
                    style={{
                      padding: '0.85rem 1.4rem',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.09)',
                      color: '#e2e8f0',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      border: '1px solid rgba(255,255,255,0.18)',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Edit in Form
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE 3: MANUAL TRANSACTION FORM                                */}
        {/* ============================================================== */}
        {collectionMode === 'manual' && (
          <div>
            {/* 1. Transaction Type Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.75rem'
            }}>
              <div style={{
                display: 'inline-flex',
                background: 'rgba(8, 22, 48, 0.7)',
                padding: '0.35rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                gap: '0.4rem',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setTransactionType('expense');
                    setCategory('Food & Groceries');
                    setErrorMessage('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.55rem 1.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    backgroundColor: transactionType === 'expense' ? '#2563eb' : 'transparent',
                    color: transactionType === 'expense' ? '#ffffff' : '#bfdbfe',
                    boxShadow: transactionType === 'expense' ? '0 4px 15px rgba(37, 99, 235, 0.45)' : 'none',
                    border: transactionType === 'expense' ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>💸</span> Expense
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTransactionType('income');
                    setCategory('Salary / Payroll');
                    setErrorMessage('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.55rem 1.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    backgroundColor: transactionType === 'income' ? '#10b981' : 'transparent',
                    color: transactionType === 'income' ? '#ffffff' : '#bfdbfe',
                    boxShadow: transactionType === 'income' ? '0 4px 15px rgba(16, 185, 129, 0.45)' : 'none',
                    border: transactionType === 'income' ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>💰</span> Income
                </button>
              </div>
            </div>

            <form onSubmit={handleManualSubmit}>
              {/* Amount & Date */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#bfdbfe', marginBottom: '0.4rem' }}>
                    Amount (₹) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#93c5fd', fontWeight: 700, fontSize: '1.1rem' }}>
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem 0.85rem 2.4rem',
                        borderRadius: '14px',
                        background: 'rgba(7, 21, 46, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        outline: 'none',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#bfdbfe', marginBottom: '0.4rem' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '14px',
                      background: 'rgba(7, 21, 46, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontSize: '0.98rem',
                      outline: 'none',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  />
                </div>
              </div>

              {/* Merchant / Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#bfdbfe', marginBottom: '0.4rem' }}>
                  Merchant / Payee Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy, Amazon, Uber, Employer..."
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    background: 'rgba(7, 21, 46, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                />
              </div>

              {/* Category Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#bfdbfe', marginBottom: '0.6rem' }}>
                  Select Category *
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '0.6rem'
                }}>
                  {currentCategories.map((cat, idx) => {
                    const isSelected = category === cat.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCategory(cat.label)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '12px',
                          border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
                          backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 700 : 500,
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#bfdbfe', marginBottom: '0.4rem' }}>
                  Payment Method / Source
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    background: 'rgba(7, 21, 46, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {paymentMethods.map((m, idx) => (
                    <option key={idx} value={m} style={{ background: '#0a192f', color: '#ffffff' }}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#bfdbfe', marginBottom: '0.4rem' }}>
                  Transaction Notes / Memo (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Additional context or remarks..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    background: 'rgba(7, 21, 46, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    padding: '0.9rem 2rem',
                    borderRadius: '14px',
                    backgroundColor: transactionType === 'income' ? '#10b981' : '#2563eb',
                    color: '#ffffff',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: transactionType === 'income' 
                      ? '0 6px 20px rgba(16, 185, 129, 0.4)' 
                      : '0 6px 20px rgba(37, 99, 235, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>💾</span>
                  <span>{transactionType === 'income' ? 'Save Income to Ledger' : 'Save Expense to Ledger'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAmount('');
                    setMerchant('');
                    setNotes('');
                    setErrorMessage('');
                  }}
                  style={{
                    padding: '0.9rem 1.6rem',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#e2e8f0',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      <style>{`
        .add-expense-card {
          background: linear-gradient(135deg, rgba(22, 61, 125, 0.65) 0%, rgba(9, 26, 56, 0.88) 100%);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 26px;
          padding: 2.2rem 2.4rem;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }

        .add-expense-tabs {
          display: inline-flex;
          background: rgba(9, 26, 56, 0.85);
          padding: 0.35rem;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          gap: 0.35rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
          max-width: 100%;
          flex-wrap: wrap;
          justify-content: center;
        }

        .add-expense-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.3rem;
          border-radius: 14px;
          font-size: 0.92rem;
          font-weight: 700;
          color: #bfdbfe;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .add-expense-tab-btn:hover:not(.active-sms):not(.active-ocr):not(.active-manual) {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .add-expense-tab-btn.active-sms,
        .add-expense-tab-btn.active-ocr,
        .add-expense-tab-btn.active-manual {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          box-shadow: 0 4px 18px rgba(37, 99, 235, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.28);
        }

        @media (max-width: 768px) {
          .add-expense-card {
            padding: 1.5rem 1.25rem;
            border-radius: 22px;
          }
        }

        @media (max-width: 640px) {
          .add-expense-tabs {
            width: 100%;
            border-radius: 16px;
            padding: 0.25rem;
            gap: 0.25rem;
          }
          .add-expense-tab-btn {
            flex: 1 1 0;
            justify-content: center;
            padding: 0.55rem 0.45rem;
            font-size: 0.8rem;
            gap: 0.3rem;
            border-radius: 12px;
          }
        }

        @media (max-width: 380px) {
          .add-expense-card {
            padding: 1.15rem 0.85rem;
            border-radius: 18px;
          }
          .add-expense-tab-btn {
            padding: 0.45rem 0.25rem;
            font-size: 0.72rem;
            gap: 0.2rem;
          }
        }
      `}</style>
    </div>
  );
}

