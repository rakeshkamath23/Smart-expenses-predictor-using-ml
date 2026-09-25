import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ChatView.css';

export default function ChatView() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('home');
  const [activeRecentId, setActiveRecentId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stats, setStats] = useState({
    sent: 1231,
    received: 1876,
    timeSaved: 45
  });

  const chatBottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Recent Inquiries for Smart Expenses
  const recentChats = [
    { 
      id: 1, 
      title: 'October 2026 Forecast', 
      time: 'Today', 
      initialMsg: 'Can you forecast my total expenditure for October 2026 using the RandomForest model?' 
    },
    { 
      id: 2, 
      title: 'Dining vs Travel Variance', 
      time: 'Today', 
      initialMsg: 'Compare my dining expenses with my monthly travel allowance and detect any budget overruns.' 
    },
    { 
      id: 3, 
      title: 'High-Value Transactions', 
      time: 'Yesterday', 
      initialMsg: 'Show me all transactions over ₹3,000 paid via UPI in the last 60 days.' 
    },
    { 
      id: 4, 
      title: 'Retrain Random Forest Model', 
      time: 'Yesterday', 
      initialMsg: 'How do I retrain the Scikit-learn Random Forest regressor with newly logged September expenses?' 
    },
    { 
      id: 5, 
      title: 'Monthly Savings Optimization', 
      time: '2 days ago', 
      initialMsg: 'Give me a proactive savings strategy to trim 15% off my discretionary lifestyle spending.' 
    },
  ];

  // Quick Action Pills
  const quickActionPills = [
    { 
      label: 'ML Forecast', 
      icon: '📈', 
      prompt: 'Run the Scikit-learn ML engine to predict next month expenditure breakdown across categories.' 
    },
    { 
      label: 'Log Transaction', 
      icon: '💳', 
      prompt: 'Help me record a new transaction: ₹1,450 for Grocery shopping paid via UPI today.' 
    },
    { 
      label: 'Budget Alerts', 
      icon: '⚠️', 
      prompt: 'Check which category budgets are above 70% utilization this month and need attention.' 
    },
    { 
      label: 'Smart Savings Tips', 
      icon: '💡', 
      prompt: 'Analyze my spending behavior and generate 3 personalized suggestions to save money.' 
    },
  ];

  // 4 Prompt Cards tailored for Smart Expenses
  const promptCards = [
    {
      title: 'Predict next month spend',
      sub: 'Scikit-Learn ML',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m19 9-5 5-4-4-3 3" />
          <path d="M3 3v18h18" />
        </svg>
      ),
      prompt: 'Forecast my total expenditure for next month using the trained Scikit-learn Random Forest model, and break down spending by category.'
    },
    {
      title: 'Analyze anomalies',
      sub: 'Food, Bills, Travel',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      prompt: 'Detect unusual spending spikes or outlier transactions in my last 30 days of expense records.'
    },
    {
      title: 'Optimize budget plan',
      sub: 'Target vs Actual',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      prompt: 'Compare my September budget limits against actual spending and suggest reallocation for next month.'
    },
    {
      title: 'ML Model script',
      sub: 'Python, Django, Scikit',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      prompt: 'Show me the Django DRF prediction pipeline code using Scikit-Learn RandomForestRegressor for expense forecasting.'
    }
  ];

  // Auto-scroll
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Command/Ctrl + K focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchEl = document.getElementById('chat-search-bar');
        if (searchEl) searchEl.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Send message with context-aware responses for Smart Expenses
  const handleSendMessage = (textToSend) => {
    const userText = textToSend || inputPrompt.trim();
    if (!userText || isTyping) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputPrompt('');
    setIsTyping(true);
    setStats((s) => ({ ...s, sent: s.sent + 1 }));

    // Generate smart context-aware response for Smart Expenses
    let replyText = '';
    let codeBlock = null;

    const lower = userText.toLowerCase();

    if (lower.includes('predict') || lower.includes('forecast') || lower.includes('next month')) {
      replyText = `📊 **Machine Learning Expense Prediction (October 2026)**\n\nBased on your 124 historical transactions and seasonal trends evaluated by the Scikit-learn **Random Forest Regressor**:\n\n• **Predicted Total Spend**: ₹16,250.00 (± ₹420 confidence margin)\n• **Category Forecast Breakdown**:\n  - 🍔 Food & Dining: ₹6,800 (41.8%)\n  - 🚗 Travel & Commute: ₹3,100 (19.1%)\n  - 💡 Utilities & Bills: ₹2,450 (15.1%)\n  - 🛍️ Shopping & Leisure: ₹2,200 (13.5%)\n  - 💊 Healthcare: ₹1,700 (10.5%)\n\n⚡ **ML Model Confidence**: R² Score = 0.91 | Model trained on Supabase PostgreSQL transactions.`;
    } else if (lower.includes('anomal') || lower.includes('spike') || lower.includes('outlier')) {
      replyText = `🔍 **Spending Anomaly Detection Report**\n\nI scanned your last 30 days of expenses against your baseline rolling average:\n\n1. **High Dining Surge**: On Sept 14, an expenditure of **₹2,850.00** at "Gourmet Bistro" was 2.4x higher than your daily average food expense.\n2. **Weekend Grocery Spike**: Saturday supermarket purchases average **₹1,650.00**, representing 34% of your weekly grocery budget.\n3. **Recurring Subscriptions**: 3 recurring charges detected on the 1st totaling **₹1,199.00** (Streaming + Cloud storage).\n\n💡 *Recommendation*: Setting a weekend dining cap of ₹1,500 could reduce monthly variance by 18%.`;
    } else if (lower.includes('budget') || lower.includes('optimi')) {
      replyText = `🎯 **Monthly Budget Utilization & Optimization Plan**\n\n• **September Budget**: ₹20,000.00 | **Spent So Far**: ₹14,800.00 (74%)\n• **Days Remaining**: 7 days | **Daily Safe Spending Limit**: ₹742.85/day\n\n**Actionable Reallocations**:\n- ⚠️ **Food & Dining**: Currently at 88% (₹6,400 / ₹7,200). Recommend freezing non-essential dining for 5 days.\n- ✅ **Travel**: Safe at 56% (₹2,240 / ₹4,000). Surplus of ₹800 can be diverted to Emergency Savings.\n- ✅ **Utilities**: Fully paid on schedule (₹2,100 / ₹2,500).`;
    } else if (lower.includes('log') || lower.includes('record') || lower.includes('add')) {
      replyText = `✅ **Transaction Recorded Successfully!**\n\n• **Amount**: ₹1,450.00\n• **Category**: Grocery & Supermarket\n• **Payment Method**: UPI\n• **Date**: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}\n• **Status**: Synced to Django Backend & Supabase DB\n\nYour updated monthly total is **₹16,250.00**. This transaction has been queued for the next ML model retraining cycle.`;
    } else if (lower.includes('script') || lower.includes('code') || lower.includes('django') || lower.includes('python')) {
      replyText = `Here is the production **Random Forest Inference Pipeline** used in your Django backend (\`backend/apps/predictions\`):`;
      codeBlock = `import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from django.db.models import Sum
from apps.expenses.models import Expense

def generate_monthly_prediction(user_id, target_month=10):
    # Fetch historical user transactions
    qs = Expense.objects.filter(user_id=user_id).values('category', 'amount', 'date')
    df = pd.DataFrame(qs)
    
    # Feature Engineering: Category frequency, day-of-month, rolling lag
    df['day'] = pd.to_datetime(df['date']).dt.day
    X = df[['day', 'category_id']]
    y = df['amount']
    
    # Train / predict with RandomForest
    rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_model.fit(X, y)
    
    # Forecast next period
    forecast = rf_model.predict([[15, 1]]) # Mid-month estimate
    return float(forecast[0])`;
    } else {
      replyText = `I have analyzed your request: "${userText}".\n\nAs your **Smart Expenses AI Copilot**, I can forecast upcoming bills, analyze category spending trends, detect unusual transaction spikes, or optimize your monthly budget plan. What would you like to explore next?`;
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: replyText,
          code: codeBlock,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
      setStats((s) => ({ ...s, received: s.received + 1 }));
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInputPrompt('');
    setActiveRecentId(null);
  };

  const loadRecentChat = (chat) => {
    setActiveRecentId(chat.id);
    handleSendMessage(chat.initialMsg);
  };

  const filteredRecentChats = recentChats.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.initialMsg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`chat-page-wrapper ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <div className="chat-window-frame">
        {/* ================= TOP HEADER ================= */}
        <header className="chat-header">
          {/* Brand */}
          <div className="chat-brand" onClick={startNewChat} title="Smart Expenses AI">
            <div className="chat-logo-icon">
              {/* 3D Frosted Blue Sphere Logo */}
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="chat-brand-title">Smart Expenses AI</span>
          </div>

          {/* Search Pill */}
          <div className="chat-search-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              id="chat-search-bar"
              type="text"
              placeholder="Search transactions, budgets, or ML forecasts..."
              className="chat-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="chat-shortcut-badge">⌘ K</span>
          </div>

          {/* Right Header Actions */}
          <div className="chat-header-actions">
            <button className="chat-new-btn" onClick={startNewChat}>
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>
              <span>New Analysis</span>
            </button>

            {/* Notifications Bell */}
            <button className="chat-icon-btn" title="Budget Alert: Dining 88% Limit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="chat-bell-badge" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              className="chat-icon-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Glass Mode'}
            >
              {isFullscreen ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              )}
            </button>

            {/* User Profile Avatar */}
            <Link to="/dashboard/profile" title="Rakesh Kamath">
              <div className="chat-user-avatar">
                <span>RK</span>
              </div>
            </Link>
          </div>
        </header>

        {/* ================= THREE COLUMN BODY ================= */}
        <div className="chat-body-grid">
          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="chat-sidebar-left">
            <nav className="chat-nav-group">
              <button
                className={`chat-nav-pill ${activeNav === 'home' ? 'active' : ''}`}
                onClick={() => { setActiveNav('home'); startNewChat(); }}
              >
                <span className="chat-nav-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                <span>Copilot Home</span>
              </button>

              <button
                className={`chat-nav-pill ${activeNav === 'dashboard' ? 'active' : ''}`}
                onClick={() => navigate('/dashboard')}
              >
                <span className="chat-nav-icon">📊</span>
                <span>Dashboard</span>
              </button>

              <button
                className={`chat-nav-pill ${activeNav === 'add' ? 'active' : ''}`}
                onClick={() => navigate('/dashboard/add-expense')}
              >
                <span className="chat-nav-icon">➕</span>
                <span>Add Expense</span>
              </button>

              <button
                className={`chat-nav-pill ${activeNav === 'history' ? 'active' : ''}`}
                onClick={() => navigate('/dashboard/history')}
              >
                <span className="chat-nav-icon">📋</span>
                <span>Expense History</span>
              </button>

              <button
                className={`chat-nav-pill ${activeNav === 'predict' ? 'active' : ''}`}
                onClick={() => navigate('/dashboard/prediction')}
              >
                <span className="chat-nav-icon">🤖</span>
                <span>ML Prediction</span>
              </button>

              <button
                className={`chat-nav-pill ${activeNav === 'budget' ? 'active' : ''}`}
                onClick={() => navigate('/dashboard/budget')}
              >
                <span className="chat-nav-icon">🎯</span>
                <span>Budget Plan</span>
              </button>

              <button
                className={`chat-nav-pill ${activeNav === 'reports' ? 'active' : ''}`}
                onClick={() => navigate('/dashboard/reports')}
              >
                <span className="chat-nav-icon">📑</span>
                <span>Reports</span>
              </button>
            </nav>

            {/* Recent Inquiries Section */}
            <div className="chat-recent-section">
              <div className="chat-recent-header">
                <span>Recent Analyses</span>
                <span className="chat-sparkle-icon">✦</span>
              </div>

              {filteredRecentChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-recent-item ${activeRecentId === chat.id ? 'active' : ''}`}
                  onClick={() => loadRecentChat(chat)}
                >
                  <span className="chat-recent-title">{chat.title}</span>
                  <span className="chat-recent-time">{chat.time}</span>
                </div>
              ))}

              <div className="chat-view-all-btn" onClick={() => navigate('/dashboard/history')}>
                <span>View all transactions</span>
                <span style={{ fontSize: '1rem' }}>→</span>
              </div>
            </div>
          </aside>

          {/* ================= CENTER INTERACTIVE CANVAS ================= */}
          <main className="chat-center-panel">
            {messages.length === 0 ? (
              /* Welcome Mode */
              <div className="chat-welcome-container">
                <h1 className="chat-hero-title">What can I help with today?</h1>

                {/* Glowing Input Box */}
                <div className="chat-input-wrapper">
                  <textarea
                    ref={textareaRef}
                    rows="2"
                    placeholder="Ask Smart Expenses AI (e.g. 'Predict my expenses for October', 'Analyze dining spikes')..."
                    className="chat-textarea"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />

                  <div className="chat-input-footer">
                    <div className="chat-input-left-tools">
                      <button
                        className="chat-clip-btn"
                        title="Upload receipt / bank statement CSV"
                        onClick={() => handleSendMessage('Please parse and analyze my uploaded expense CSV statement.')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {inputPrompt.trim() && (
                        <button
                          className="chat-new-btn"
                          style={{ padding: '0.35rem 0.95rem', fontSize: '0.8rem', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
                          onClick={() => handleSendMessage()}
                        >
                          Send ↵
                        </button>
                      )}

                      {/* Glowing Mic Waveform Button */}
                      <button
                        className={`chat-mic-pill-btn ${isRecording ? 'recording' : ''}`}
                        title={isRecording ? 'Listening... click to stop' : 'Voice Input'}
                        onClick={() => {
                          setIsRecording(!isRecording);
                          if (!isRecording) {
                            setInputPrompt('Predict my next month spending using the RandomForest model...');
                          }
                        }}
                      >
                        {isRecording ? (
                          <span style={{ fontSize: '0.85rem', letterSpacing: '1px', fontWeight: 700 }}>ılılı</span>
                        ) : (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" y2="22" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Action Pills Under Input */}
                <div className="chat-action-pills-row">
                  {quickActionPills.map((pill, i) => (
                    <button
                      key={i}
                      className="chat-action-pill"
                      onClick={() => handleSendMessage(pill.prompt)}
                    >
                      <span>{pill.icon}</span>
                      <span>{pill.label}</span>
                    </button>
                  ))}
                </div>

                {/* 4 Prompt Cards Grid */}
                <div className="chat-prompt-cards-grid">
                  {promptCards.map((card, idx) => (
                    <div
                      key={idx}
                      className="chat-prompt-card"
                      onClick={() => handleSendMessage(card.prompt)}
                    >
                      <div>
                        <div className="chat-prompt-card-title">{card.title}</div>
                        <div className="chat-prompt-card-sub">{card.sub}</div>
                      </div>
                      <div className="chat-prompt-card-icon">
                        {card.icon}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtle bottom chevron */}
                <div className="chat-bottom-chevron">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            ) : (
              /* Conversation Stream Mode */
              <div className="chat-conversation-stream">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
                  <button
                    className="chat-new-btn"
                    onClick={startNewChat}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  >
                    ← Back to Prompts
                  </button>
                  <span style={{ fontSize: '0.8rem', color: 'var(--chat-text-subtle)' }}>
                    Active Engine: <strong style={{ color: '#38bdf8' }}>Random Forest ML & FinGPT</strong>
                  </span>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-msg-row ${msg.sender}`}>
                    <div className="chat-msg-avatar">
                      {msg.sender === 'user' ? 'RK' : '✦'}
                    </div>
                    <div className="chat-msg-bubble">
                      <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                      {msg.code && (
                        <pre className="chat-code-block">
                          <code>{msg.code}</code>
                        </pre>
                      )}
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)', marginTop: '0.4rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="chat-msg-row ai">
                    <div className="chat-msg-avatar">✦</div>
                    <div className="chat-msg-bubble" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Analyzing financial telemetry</span>
                      <span className="chat-typing-dot" />
                      <span className="chat-typing-dot" style={{ animationDelay: '0.2s' }} />
                      <span className="chat-typing-dot" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />

                {/* Docked bottom input */}
                <div className="chat-docked-input">
                  <div className="chat-input-wrapper">
                    <textarea
                      rows="1"
                      placeholder="Ask follow-up question or request export..."
                      className="chat-textarea"
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="chat-input-footer">
                      <button
                        className="chat-clip-btn"
                        onClick={() => handleSendMessage('Export this breakdown to CSV.')}
                      >
                        📎
                      </button>
                      <button
                        className="chat-mic-pill-btn"
                        onClick={() => handleSendMessage()}
                      >
                        ↵
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="chat-sidebar-right">
            {/* Card 1: 3D Category Frosted Bubble Visualizer */}
            <div className="chat-gpt4-card">
              <div className="chat-gpt4-header">
                <span>Bubble Analytics</span>
                <span className="chat-gpt4-spark">🔮</span>
              </div>
              <p className="chat-gpt4-desc">ML category clusters & Random Forest regression.</p>

              {/* 3D Frosted Category Bubble & Orbit Spheres */}
              <div className="chat-hologram-stage">
                <div className="chat-mini-orbit-bubble orbit-1" title="Groceries 32.8%">🛒</div>
                <div className="chat-mini-orbit-bubble orbit-2" title="Cafes 14.8%">☕</div>
                <div className="chat-holo-sphere">
                  <span style={{ fontSize: '1.25rem' }}>🤖</span>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, marginTop: '2px', color: '#e0f2fe' }}>R² 0.924</span>
                </div>
              </div>
            </div>

            {/* Card 2: Capabilities */}
            <div className="chat-capabilities-card">
              <div className="chat-card-title">Capabilities</div>
              <div className="chat-cap-list">
                <div className="chat-cap-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>⚡</span>
                    <span>Multi-Category Parsing</span>
                  </div>
                  <span className="chat-cap-icon-check">✓</span>
                </div>

                <div className="chat-cap-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🤖</span>
                    <span>Scikit-learn Regression</span>
                  </div>
                  <span className="chat-cap-icon-check">✓</span>
                </div>

                <div className="chat-cap-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🔍</span>
                    <span>Anomaly Detection</span>
                  </div>
                  <span className="chat-cap-icon-check">✓</span>
                </div>

                <div className="chat-cap-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🎯</span>
                    <span>Budget Alert Engine</span>
                  </div>
                  <span className="chat-cap-icon-check">✓</span>
                </div>
              </div>
            </div>

            {/* Card 3: Your Financial Activity */}
            <div className="chat-activity-card">
              <div className="chat-card-title">Your Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.2rem' }}>
                <div className="chat-metric-row">
                  <span className="chat-metric-label">Transactions tracked</span>
                  <span className="chat-metric-val">1,231</span>
                </div>
                <div className="chat-metric-row">
                  <span className="chat-metric-label">Predictions generated</span>
                  <span className="chat-metric-val">1,876</span>
                </div>
                <div className="chat-metric-row">
                  <span className="chat-metric-label">Estimated savings</span>
                  <span className="chat-metric-val" style={{ color: '#34d399' }}>₹45,200+</span>
                </div>
              </div>

              {/* Royal Cobalt & Cyan Area Sparkline Wave */}
              <div className="chat-sparkline-box">
                <svg width="100%" height="100%" viewBox="0 0 240 50" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sapphireCobaltGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path
                    d="M0,45 Q30,42 60,32 T120,22 T180,35 T240,15 L240,50 L0,50 Z"
                    fill="url(#sapphireCobaltGrad)"
                  />
                  {/* Glowing line */}
                  <path
                    d="M0,45 Q30,42 60,32 T120,22 T180,35 T240,15"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 6px #2563eb)' }}
                  />
                </svg>
              </div>
            </div>

            {/* Card 4: Linked Smart Payment Card */}
            <div
              className="chat-plus-card"
              onClick={() => navigate('/dashboard/profile')}
              title="Manage Connected Smart Cards"
            >
              <div className="chat-plus-star">💳</div>
              <div>
                <div className="chat-plus-title">VISA •••• 9286 Active</div>
                <div className="chat-plus-sub">Wallet: ₹1,04,250.00 Linked</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
