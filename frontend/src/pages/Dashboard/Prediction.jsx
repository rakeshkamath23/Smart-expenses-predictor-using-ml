import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function Prediction() {
  // Base ML Prediction Data
  const basePrediction = 15420.0;
  const lastMonthExpenses = 14560.0;
  const lastMonthLabel = 'September 2026';
  const predictedMonthLabel = 'October 2026';
  const monthlyBudgetCap = 20000.0;
  const confidenceMin = 14750.0;
  const confidenceMax = 16090.0;
  const daysInNextMonth = 31;

  // Base Category Forecasts (Sum = ₹15,420)
  const initialCategories = [
    { id: 'food', name: 'Food & Groceries', icon: '🍔', baseAmount: 5350, color: '#38bdf8' },
    { id: 'bills', name: 'Bills & Utilities', icon: '💡', baseAmount: 2600, color: '#60a5fa' },
    { id: 'shopping', name: 'Shopping & Apparel', icon: '🛍', baseAmount: 2750, color: '#818cf8' },
    { id: 'transport', name: 'Transport & Commute', icon: '🚗', baseAmount: 1950, color: '#34d399' },
    { id: 'entertainment', name: 'Entertainment & Cafes', icon: '🎬', baseAmount: 1520, color: '#fbbf24' },
    { id: 'other', name: 'Health & Other', icon: '📦', baseAmount: 1250, color: '#f43f5e' },
  ];

  // Interactive What-If Reduction State (in percentages)
  const [reductions, setReductions] = useState({
    food: 0,
    shopping: 0,
    entertainment: 0,
    transport: 0,
  });

  // UI States
  const [isModelWorkflowOpen, setIsModelWorkflowOpen] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainSuccess, setRetrainSuccess] = useState(false);
  const [activeChartHover, setActiveChartHover] = useState(null);

  // Dynamic What-If & MoM Calculations
  const { 
    potentialSavings, 
    adjustedTotal, 
    adjustedCategories, 
    percentageChange, 
    dailySpend, 
    remainingBudget, 
    budgetUtilization,
    momDiff,
    momDiffPct,
    isIncrease,
    isDecrease
  } = useMemo(() => {
    let totalSavings = 0;
    const cats = initialCategories.map((cat) => {
      const redPct = reductions[cat.id] || 0;
      const saved = (cat.baseAmount * redPct) / 100;
      totalSavings += saved;
      return {
        ...cat,
        adjustedAmount: cat.baseAmount - saved,
        reductionPct: redPct,
        savedAmount: saved,
      };
    });

    const newTotal = basePrediction - totalSavings;
    const diff = newTotal - lastMonthExpenses;
    const pctChange = ((diff / lastMonthExpenses) * 100).toFixed(1);
    const daily = (newTotal / daysInNextMonth).toFixed(2);
    const remaining = Math.max(0, monthlyBudgetCap - newTotal);
    const util = ((newTotal / monthlyBudgetCap) * 100).toFixed(1);

    return {
      potentialSavings: totalSavings,
      adjustedTotal: newTotal,
      adjustedCategories: cats,
      percentageChange: pctChange,
      dailySpend: daily,
      remainingBudget: remaining,
      budgetUtilization: util,
      momDiff: diff,
      momDiffPct: pctChange,
      isIncrease: diff > 0,
      isDecrease: diff < 0
    };
  }, [reductions]);

  // Historical + Forecast Monthly Trend Data (Dynamically synchronized)
  const trendData = [
    { month: 'May', amount: 12400, isForecast: false },
    { month: 'Jun', amount: 13850, isForecast: false },
    { month: 'Jul', amount: 13200, isForecast: false },
    { month: 'Aug', amount: 14100, isForecast: false },
    { month: 'Sep', amount: 14560, isForecast: false, isCurrent: true },
    { month: 'Oct', amount: adjustedTotal, isForecast: true },
  ];

  // Handler for category percentage adjustments
  const handleAdjustment = (catId, delta) => {
    setReductions((prev) => {
      const current = prev[catId] || 0;
      const next = Math.max(0, Math.min(50, current + delta));
      return { ...prev, [catId]: next };
    });
  };

  const handleResetScenario = () => {
    setReductions({ food: 0, shopping: 0, entertainment: 0, transport: 0 });
  };

  const handleRetrain = () => {
    setIsRetraining(true);
    setRetrainSuccess(false);
    setTimeout(() => {
      setIsRetraining(false);
      setRetrainSuccess(true);
      setTimeout(() => setRetrainSuccess(false), 4000);
    }, 1200);
  };

  // SVG Chart Dimensions & Calculations
  const chartWidth = 720;
  const chartHeight = 220;
  const padLeft = 45;
  const padRight = 45;
  const padTop = 30;
  const padBottom = 35;
  const minVal = 10000;
  const maxVal = 18000;

  const points = trendData.map((d, i) => {
    const x = padLeft + (i / (trendData.length - 1)) * (chartWidth - padLeft - padRight);
    const y = chartHeight - padBottom - ((d.amount - minVal) / (maxVal - minVal)) * (chartHeight - padTop - padBottom);
    return { ...d, x, y };
  });

  const historicalPoints = points.slice(0, 5);
  const forecastPoint = points[5];
  const lastHistoricalPoint = points[4];

  // SVG Path strings
  const historicalPath = historicalPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const forecastDashedPath = `M ${lastHistoricalPoint.x} ${lastHistoricalPoint.y} L ${forecastPoint.x} ${forecastPoint.y}`;
  const areaPath = `${historicalPath} L ${forecastPoint.x} ${forecastPoint.y} L ${forecastPoint.x} ${chartHeight - padBottom} L ${points[0].x} ${chartHeight - padBottom} Z`;

  // Proportional Comparison Bars
  const maxCompValue = Math.max(lastMonthExpenses, adjustedTotal) * 1.05;
  const lastMonthBarPct = ((lastMonthExpenses / maxCompValue) * 100).toFixed(1);
  const predictedBarPct = ((adjustedTotal / maxCompValue) * 100).toFixed(1);

  return (
    <div style={{ color: '#ffffff' }}>
      {/* 1. PAGE HEADER */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ 
          fontSize: '1.95rem', 
          fontWeight: 800, 
          letterSpacing: '-0.02em', 
          marginBottom: '0.35rem',
          color: '#ffffff'
        }}>
          ML Expense Forecast
        </h1>
        <p style={{ color: '#93c5fd', fontSize: '0.94rem' }}>
          Predict your upcoming expenses using your spending history and machine learning.
        </p>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div className="prediction-main-grid">
        {/* 2. MAIN PREDICTION HERO CARD */}
        <div className="prediction-hero-card">
          <div>
            <div style={{ fontSize: '0.9rem', color: '#93c5fd', fontWeight: 600, marginBottom: '0.5rem' }}>
              Next Month's Estimated Expenses
            </div>

            {/* Prominent Prediction Display */}
            <div className="prediction-number-display">
              ₹{Math.round(adjustedTotal).toLocaleString('en-IN')}<span style={{ fontSize: '0.6em', opacity: 0.8 }}>.00</span>
            </div>

            {/* Percentage change vs current month */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.35rem',
              marginTop: '0.65rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: isIncrease ? 'rgba(244, 63, 94, 0.15)' : 'rgba(52, 211, 153, 0.15)',
              border: `1px solid ${isIncrease ? 'rgba(244, 63, 94, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`,
              color: isIncrease ? '#fca5a5' : '#86efac',
              fontSize: '0.85rem',
              fontWeight: 700
            }}>
              <span>{isIncrease ? '↑' : (isDecrease ? '↓' : '=')}</span>
              <span>{Math.abs(percentageChange)}% {isIncrease ? 'increase' : (isDecrease ? 'decrease' : 'change')} compared with this month</span>
            </div>

            {/* Secondary Forecast Details */}
            <div style={{ marginTop: '1.35rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
              <div>
                <span style={{ color: '#93c5fd' }}>Prediction range: </span>
                <strong style={{ color: '#ffffff' }}>₹{confidenceMin.toLocaleString('en-IN')} – ₹{confidenceMax.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span style={{ color: '#93c5fd' }}>Daily estimated spend: </span>
                <strong style={{ color: '#ffffff' }}>₹{dailySpend}/day</strong>
              </div>
            </div>
          </div>

          {/* Clean Action Shortcuts */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <a 
              href="#what-if-section" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1.1rem',
                borderRadius: '10px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>💡</span> What-If Analysis
            </a>
            <Link 
              to="/chat" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1.1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#38bdf8',
                fontSize: '0.84rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>✦</span> AI Insight
            </Link>
          </div>
        </div>

        {/* 3. EXPENSE FORECAST GRAPH */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(22, 61, 125, 0.5) 0%, rgba(9, 26, 56, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '24px',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                Expense Trend
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#93c5fd' }}>
                Historical monthly trajectory vs Next-Month ML forecast
              </span>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1' }}>
                <span style={{ width: '10px', height: '3px', backgroundColor: '#38bdf8', borderRadius: '2px' }} />
                <span>Actual</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', fontWeight: 600 }}>
                <span style={{ width: '10px', height: '3px', borderTop: '2px dashed #38bdf8' }} />
                <span>Forecast</span>
              </div>
            </div>
          </div>

          {/* Responsive SVG Chart */}
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Background Grid Lines */}
              <line x1={padLeft} y1={padTop} x2={chartWidth - padRight} y2={padTop} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1={padLeft} y1={(padTop + chartHeight - padBottom) / 2} x2={chartWidth - padRight} y2={(padTop + chartHeight - padBottom) / 2} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1={padLeft} y1={chartHeight - padBottom} x2={chartWidth - padRight} y2={chartHeight - padBottom} stroke="rgba(255,255,255,0.12)" />

              {/* Area Under Curve */}
              <path d={areaPath} fill="url(#trendGradient)" />

              {/* Historical Solid Line */}
              <path d={historicalPath} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Forecast Dashed Line */}
              <path d={forecastDashedPath} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5 4" strokeLinecap="round" />

              {/* Data Nodes */}
              {points.map((p) => (
                <g key={p.month} onMouseEnter={() => setActiveChartHover(p)} onMouseLeave={() => setActiveChartHover(null)}>
                  {p.isForecast ? (
                    <>
                      {/* Highlighted Forecast Node */}
                      <circle cx={p.x} cy={p.y} r="8" fill="rgba(56, 189, 248, 0.25)" />
                      <circle cx={p.x} cy={p.y} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                    </>
                  ) : (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill={p.isCurrent ? '#ffffff' : '#2563eb'}
                      stroke="#38bdf8"
                      strokeWidth="2"
                      style={{ cursor: 'pointer' }}
                    />
                  )}

                  {/* X-axis Labels */}
                  <text
                    x={p.x}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    fill={p.isForecast ? '#38bdf8' : '#93c5fd'}
                    fontSize="11"
                    fontWeight={p.isForecast ? '700' : '500'}
                  >
                    {p.month}{p.isForecast ? ' (Est)' : ''}
                  </text>

                  {/* Top amount values */}
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    fill={p.isForecast ? '#ffffff' : '#cbd5e1'}
                    fontSize="10"
                    fontWeight={p.isForecast ? '700' : '400'}
                  >
                    ₹{(p.amount / 1000).toFixed(1)}k
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Interactive Hover Note or Default Forecast Note */}
          <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '0.5rem', textAlign: 'center' }}>
            {activeChartHover 
              ? `${activeChartHover.month}: ₹${activeChartHover.amount.toLocaleString('en-IN')} (${activeChartHover.isForecast ? 'Estimated Forecast' : 'Settled Spend'})`
              : 'Consistent 5-month spending velocity utilized by Scikit-learn Random Forest model.'}
          </div>
        </div>
      </div>

      {/* 4. THREE SUMMARY CARDS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        {/* CARD 1: Budget Health */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '1.2rem 1.4rem'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 600 }}>Budget Health</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
            {budgetUtilization}%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600, marginTop: '0.2rem' }}>
            ₹{Math.round(remainingBudget).toLocaleString('en-IN')} remaining
          </div>
        </div>

        {/* CARD 2: Model Accuracy */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '1.2rem 1.4rem'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 600 }}>Model Accuracy</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
            R² 0.938
          </div>
          <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, marginTop: '0.2rem' }}>
            MAE: ₹118.20 / record
          </div>
        </div>

        {/* CARD 3: Prediction Range */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '1.2rem 1.4rem'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 600 }}>Prediction Range</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem' }}>
            ₹{confidenceMin.toLocaleString('en-IN')} – ₹{confidenceMax.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '0.2rem' }}>
            95% Confidence Band
          </div>
        </div>
      </div>

      {/* NEW SECTION: LAST MONTH VS PREDICTED EXPENSES */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13, 37, 82, 0.65) 0%, rgba(8, 22, 48, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '24px',
        padding: '1.75rem 2rem',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.35)',
        marginBottom: '1.5rem'
      }}>
        {/* Section Header */}
        <div style={{ marginBottom: '1.35rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Last Month vs Predicted Expenses
          </h3>
          <p style={{ color: '#93c5fd', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Compare your actual spending with the ML forecast.
          </p>
        </div>

        {/* Two Large Side-by-Side Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.35rem'
        }}>
          {/* LEFT CARD: Last Month */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '18px',
            padding: '1.4rem 1.6rem',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#93c5fd', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Last Month
              </span>
              <span style={{
                fontSize: '0.74rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(96, 165, 250, 0.15)',
                color: '#93c5fd',
                fontWeight: 600,
                border: '1px solid rgba(96, 165, 250, 0.3)'
              }}>
                Actual Expenses
              </span>
            </div>

            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              ₹{lastMonthExpenses.toLocaleString('en-IN')}<span style={{ fontSize: '1.4rem', opacity: 0.8 }}>.00</span>
            </div>

            <div style={{ fontSize: '0.84rem', color: '#bfdbfe', marginTop: '0.35rem' }}>
              {lastMonthLabel}
            </div>
          </div>

          {/* RIGHT CARD: Predicted Next Month */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '18px',
            padding: '1.4rem 1.6rem',
            position: 'relative',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Predicted Next Month
              </span>
              <span style={{
                fontSize: '0.74rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                fontWeight: 700,
                border: '1px solid rgba(56, 189, 248, 0.4)'
              }}>
                ML Forecast
              </span>
            </div>

            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              ₹{Math.round(adjustedTotal).toLocaleString('en-IN')}<span style={{ fontSize: '1.4rem', opacity: 0.8 }}>.00</span>
            </div>

            <div style={{ fontSize: '0.84rem', color: '#38bdf8', marginTop: '0.35rem', fontWeight: 600 }}>
              {predictedMonthLabel}
            </div>
          </div>
        </div>

        {/* Dynamic Difference Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.9rem 1.25rem',
          borderRadius: '14px',
          backgroundColor: 'rgba(8, 22, 48, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.86rem', color: '#bfdbfe', fontWeight: 500 }}>
              Forecast Variance:
            </span>
            <span style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: isIncrease ? '#fca5a5' : '#86efac'
            }}>
              {isIncrease ? '↑' : (isDecrease ? '↓' : '=')} ₹{Math.abs(Math.round(momDiff)).toLocaleString('en-IN')}
            </span>
            <span style={{
              fontSize: '0.84rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              backgroundColor: isIncrease ? 'rgba(244, 63, 94, 0.15)' : 'rgba(52, 211, 153, 0.15)',
              color: isIncrease ? '#fca5a5' : '#86efac',
              border: `1px solid ${isIncrease ? 'rgba(244, 63, 94, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`
            }}>
              {Math.abs(momDiffPct)}% {isIncrease ? 'increase' : (isDecrease ? 'decrease' : 'on par')}
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#93c5fd' }}>
            Baseline: {lastMonthLabel} (₹{lastMonthExpenses.toLocaleString('en-IN')})
          </div>
        </div>

        {/* Proportional Comparison Bars */}
        <div style={{
          padding: '1.1rem 1.35rem',
          borderRadius: '14px',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '1rem'
        }}>
          {/* Last Month Bar */}
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '0.35rem' }}>
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Last Month ({lastMonthLabel})</span>
              <strong style={{ color: '#ffffff' }}>₹{lastMonthExpenses.toLocaleString('en-IN')}.00</strong>
            </div>
            <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${lastMonthBarPct}%`,
                background: 'linear-gradient(90deg, #60a5fa, #2563eb)',
                borderRadius: '9999px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Predicted Next Month Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '0.35rem' }}>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>Predicted ({predictedMonthLabel})</span>
              <strong style={{ color: '#38bdf8' }}>₹{Math.round(adjustedTotal).toLocaleString('en-IN')}.00</strong>
            </div>
            <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${predictedBarPct}%`,
                background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)',
                borderRadius: '9999px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Short Dynamic Insight */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.86rem',
          color: '#e2e8f0',
          padding: '0.6rem 0.85rem',
          borderRadius: '10px',
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}>
          <span>🤖</span>
          <span>
            {isIncrease && `Your predicted expenses are ${Math.abs(momDiffPct)}% higher than last month's actual spending.`}
            {isDecrease && `Your predicted expenses are ${Math.abs(momDiffPct)}% lower than last month's actual spending.`}
            {!isIncrease && !isDecrease && `Your predicted expenses are exactly on par with last month's actual spending.`}
          </span>
        </div>
      </div>

      {/* 2-Column Section: Category Breakdown + Model & Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* 6. PREDICTED SPENDING BY CATEGORY */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                Predicted Spending by Category
              </h3>
              <span style={{ fontSize: '0.76rem', color: '#93c5fd' }}>
                Next Month Share
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {adjustedCategories.map((cat) => {
                const percentage = ((cat.adjustedAmount / adjustedTotal) * 100).toFixed(1);
                return (
                  <div key={cat.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.88rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0' }}>
                        <span>{cat.icon}</span>
                        <span style={{ fontWeight: 600 }}>{cat.name}</span>
                      </div>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>
                        ₹{Math.round(cat.adjustedAmount).toLocaleString('en-IN')}
                        <span style={{ fontSize: '0.75rem', color: '#93c5fd', marginLeft: '0.4rem', fontWeight: 500 }}>
                          ({percentage}%)
                        </span>
                      </div>
                    </div>
                    {/* Horizontal Progress Bar */}
                    <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${percentage}%`,
                          backgroundColor: cat.color,
                          borderRadius: '9999px',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column Right: 5. Model Information + 7. Smart Insight */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 5. MODEL INFORMATION CARD */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            padding: '1.4rem 1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🤖</span> Model Information
              </h3>
              <button
                onClick={handleRetrain}
                disabled={isRetraining}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#93c5fd',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {isRetraining ? 'Retraining...' : '⚡ Retrain'}
              </button>
            </div>

            {retrainSuccess && (
              <div style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', backgroundColor: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', color: '#6ee7b7', fontSize: '0.78rem', marginBottom: '0.75rem' }}>
                ✅ Model retrained with 1,420 historical records. R² = 0.938.
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.84rem' }}>
              <div>
                <div style={{ color: '#93c5fd', fontSize: '0.75rem' }}>Algorithm:</div>
                <div style={{ fontWeight: 600, color: '#ffffff' }}>Random Forest Regression</div>
              </div>
              <div>
                <div style={{ color: '#93c5fd', fontSize: '0.75rem' }}>Training Records:</div>
                <div style={{ fontWeight: 600, color: '#ffffff' }}>1,420 transactions</div>
              </div>
              <div>
                <div style={{ color: '#93c5fd', fontSize: '0.75rem' }}>Model Score:</div>
                <div style={{ fontWeight: 600, color: '#34d399' }}>R² = 0.938</div>
              </div>
              <div>
                <div style={{ color: '#93c5fd', fontSize: '0.75rem' }}>Prediction Period:</div>
                <div style={{ fontWeight: 600, color: '#38bdf8' }}>Next Month (October)</div>
              </div>
            </div>
          </div>

          {/* 7. SMART INSIGHT CARD */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            padding: '1.4rem 1.5rem',
            flex: 1
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
              <span>🤖</span> Smart Insight
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.86rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#38bdf8' }}>•</span>
                <span>Food & Groceries is currently your largest recurring expense category, accounting for 34.7% of next month's forecast.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#38bdf8' }}>•</span>
                <span>Your projected spending (₹{Math.round(adjustedTotal).toLocaleString('en-IN')}) is {Math.abs(momDiffPct)}% {isIncrease ? 'higher' : 'lower'} than last month's actual average (₹{lastMonthExpenses.toLocaleString('en-IN')}).</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#38bdf8' }}>•</span>
                <span>Transportation & Commute spending has remained relatively stable across the last 3 billing cycles.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. WHAT-IF SPENDING OPTIMIZER */}
      <div id="what-if-section" style={{
        background: 'linear-gradient(135deg, rgba(22, 61, 125, 0.6) 0%, rgba(9, 26, 56, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '24px',
        padding: '1.75rem 2rem',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.35)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>💡</span> What-If Spending Optimizer
            </h3>
            <p style={{ color: '#93c5fd', fontSize: '0.88rem', marginTop: '0.2rem' }}>
              What happens if you reduce selected expenses?
            </p>
          </div>

          {potentialSavings > 0 && (
            <button
              onClick={handleResetScenario}
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#e2e8f0',
                cursor: 'pointer'
              }}
            >
              Reset Reductions
            </button>
          )}
        </div>

        {/* Interactive Category Stepper Controls */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {[
            { id: 'food', label: 'Food', icon: '🍔' },
            { id: 'shopping', label: 'Shopping', icon: '🛍' },
            { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
            { id: 'transport', label: 'Transport', icon: '🚗' },
          ].map((item) => (
            <div
              key={item.id}
              style={{
                background: 'rgba(8, 22, 48, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                padding: '0.85rem 1rem'
              }}
            >
              <div style={{ fontSize: '0.82rem', color: '#bfdbfe', fontWeight: 600, marginBottom: '0.5rem' }}>
                {item.icon} {item.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => handleAdjustment(item.id, -5)}
                  disabled={reductions[item.id] <= 0}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: reductions[item.id] <= 0 ? 'not-allowed' : 'pointer',
                    opacity: reductions[item.id] <= 0 ? 0.4 : 1
                  }}
                >
                  −
                </button>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: reductions[item.id] > 0 ? '#38bdf8' : '#ffffff' }}>
                  {reductions[item.id]}%
                </span>
                <button
                  onClick={() => handleAdjustment(item.id, 5)}
                  disabled={reductions[item.id] >= 50}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: reductions[item.id] >= 50 ? 'not-allowed' : 'pointer',
                    opacity: reductions[item.id] >= 50 ? 0.4 : 1
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Calculation Summary Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          padding: '1.25rem',
          backgroundColor: 'rgba(8, 22, 48, 0.75)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>
              Current Forecast:
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
              ₹{basePrediction.toLocaleString('en-IN')}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>
              Potential Savings:
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
              ₹{Math.round(potentialSavings).toLocaleString('en-IN')}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>
              Adjusted Forecast:
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
              ₹{Math.round(adjustedTotal).toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              to="/dashboard/budget"
              style={{
                width: '100%',
                textAlign: 'center',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
              }}
            >
              Explore Scenario &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 9. HOW THE ML MODEL WORKS (EXPANDABLE ACCORDION) */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '18px',
        overflow: 'hidden',
        marginBottom: '1rem'
      }}>
        <button
          onClick={() => setIsModelWorkflowOpen(!isModelWorkflowOpen)}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#ffffff',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            textAlign: 'left'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔬</span> How the prediction works
          </span>
          <span style={{ fontSize: '0.85rem', color: '#93c5fd' }}>
            {isModelWorkflowOpen ? '▲ Hide' : '▼ View Architecture'}
          </span>
        </button>

        {isModelWorkflowOpen && (
          <div style={{
            padding: '0 1.5rem 1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            marginTop: '0.25rem'
          }}>
            {/* Visual Workflow Pipeline */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
              padding: '1.25rem 0',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 600
            }}>
              {[
                { step: '1', title: 'Transaction Data' },
                { step: '2', title: 'Data Preprocessing' },
                { step: '3', title: 'Feature Extraction' },
                { step: '4', title: 'Random Forest Model' },
                { step: '5', title: 'Expense Prediction' },
                { step: '6', title: 'Budget Insight' },
              ].map((stage, idx) => (
                <React.Fragment key={stage.step}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(8, 22, 48, 0.7)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    minWidth: '110px',
                    textAlign: 'center'
                  }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {stage.step}
                    </span>
                    <span>{stage.title}</span>
                  </div>
                  {idx < 5 && <span style={{ color: '#38bdf8', fontSize: '1rem' }}>→</span>}
                </React.Fragment>
              ))}
            </div>

            <p style={{ color: '#93c5fd', fontSize: '0.84rem', margin: 0, lineHeight: 1.5 }}>
              The model extracts key numerical features including 30-day spending velocity, category-wise moving averages, day-of-week seasonality, and payment mode variance to train an ensemble of 150 Decision Trees (Scikit-learn <code>RandomForestRegressor</code>).
            </p>
          </div>
        )}
      </div>

      <style>{`
        .prediction-main-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          width: 100%;
        }

        .prediction-hero-card {
          background: linear-gradient(135deg, rgba(22, 61, 125, 0.7) 0%, rgba(9, 26, 56, 0.85) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 24px;
          padding: 1.75rem 2rem;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
          box-sizing: border-box;
        }

        .prediction-number-display {
          font-size: clamp(2rem, 7vw, 3.1rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #ffffff;
          line-height: 1.15;
          margin-top: 0.15rem;
        }

        @media (max-width: 768px) {
          .prediction-main-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .prediction-hero-card {
            padding: 1.35rem 1.15rem;
            border-radius: 20px;
          }
        }

        @media (max-width: 420px) {
          .prediction-hero-card {
            padding: 1.15rem 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

