import React, { useState, useEffect } from 'react';
import Interactive3DCard from '../../components/Interactive3DCard';

const DEFAULT_CARDS = [
  {
    id: 'card-1',
    nameOnCard: 'Rakesh Kamath',
    cardNumber: '4532 8921 7382 9286',
    last4: '9286',
    expiry: '08/32',
    cvv: '842',
    network: 'VISA',
    theme: 'sapphire',
    isPrimary: true,
    isFrozen: false,
    cardType: 'Smart Debit Card'
  },
  {
    id: 'card-2',
    nameOnCard: 'Rakesh Kamath',
    cardNumber: '5412 7534 8920 4028',
    last4: '4028',
    expiry: '11/29',
    cvv: '428',
    network: 'Mastercard',
    theme: 'violet',
    isPrimary: false,
    isFrozen: false,
    cardType: 'Titanium Platinum Credit'
  }
];

export default function Profile() {
  // Load cards from localStorage or fallback to defaults
  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_expenses_cards');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_CARDS;
  });

  const [notification, setNotification] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Card Form State
  const [formData, setFormData] = useState({
    nameOnCard: 'Rakesh Kamath',
    cardNumber: '',
    expiry: '',
    cvv: '',
    network: 'VISA',
    theme: 'sapphire',
    isPrimary: false,
    cardType: 'Smart Debit Card'
  });

  // Save cards to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('smart_expenses_cards', JSON.stringify(cards));
    window.dispatchEvent(new Event('smart_expenses_cards_updated'));
  }, [cards]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4500);
  };

  const primaryCard = cards.find((c) => c.isPrimary) || cards[0] || null;

  // Format Card Number input with spaces every 4 digits
  const handleCardNumberChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = rawVal.match(/.{1,4}/g)?.join(' ') || rawVal;

    // Auto-detect network from leading digit
    let detectedNetwork = formData.network;
    if (rawVal.startsWith('4')) detectedNetwork = 'VISA';
    else if (rawVal.startsWith('5')) detectedNetwork = 'Mastercard';
    else if (rawVal.startsWith('6') || rawVal.startsWith('8')) detectedNetwork = 'RuPay';
    else if (rawVal.startsWith('3')) detectedNetwork = 'Amex';

    setFormData((prev) => ({
      ...prev,
      cardNumber: formatted,
      network: detectedNetwork
    }));
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e) => {
    let rawVal = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (rawVal.length >= 3) {
      rawVal = `${rawVal.slice(0, 2)}/${rawVal.slice(2)}`;
    }
    setFormData((prev) => ({ ...prev, expiry: rawVal }));
  };

  // Handle Form Submit to add card
  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    const cleanNumber = formData.cardNumber.replace(/\s/g, '');
    if (cleanNumber.length < 12) {
      alert('Please enter a valid card number (at least 12-16 digits).');
      return;
    }
    if (!formData.expiry || formData.expiry.length < 5) {
      alert('Please enter a valid expiry date (MM/YY).');
      return;
    }

    const last4Digits = cleanNumber.slice(-4);
    const newCard = {
      id: `card-${Date.now()}`,
      nameOnCard: formData.nameOnCard.trim() || 'Cardholder',
      cardNumber: formData.cardNumber,
      last4: last4Digits,
      expiry: formData.expiry,
      network: formData.network,
      theme: formData.theme,
      isPrimary: formData.isPrimary || cards.length === 0,
      isFrozen: false,
      cardType: formData.cardType
    };

    let updatedCards = [...cards];
    if (newCard.isPrimary) {
      updatedCards = updatedCards.map((c) => ({ ...c, isPrimary: false }));
    }
    updatedCards.push(newCard);

    setCards(updatedCards);
    setIsModalOpen(false);
    showNotification(`✅ Successfully linked ${newCard.network} card ending in •••• ${last4Digits}!`);

    // Reset Form
    setFormData({
      nameOnCard: 'Rakesh Kamath',
      cardNumber: '',
      expiry: '',
      cvv: '',
      network: 'VISA',
      theme: 'sapphire',
      isPrimary: false,
      cardType: 'Smart Debit Card'
    });
  };

  // Set card as primary
  const handleSetPrimary = (cardId) => {
    const updated = cards.map((c) => ({
      ...c,
      isPrimary: c.id === cardId
    }));
    setCards(updated);
    const target = cards.find((c) => c.id === cardId);
    showNotification(`⭐ Set ${target?.network} •••• ${target?.last4} as your primary card!`);
  };

  // Freeze/Unfreeze card
  const handleToggleFreeze = (cardId) => {
    const updated = cards.map((c) => {
      if (c.id === cardId) {
        const nextFrozen = !c.isFrozen;
        showNotification(
          nextFrozen
            ? `❄️ Card •••• ${c.last4} has been frozen. Contactless payments temporarily paused.`
            : `☀️ Card •••• ${c.last4} has been unfrozen and is active.`
        );
        return { ...c, isFrozen: nextFrozen };
      }
      return c;
    });
    setCards(updated);
  };

  // Delete card
  const handleDeleteCard = (cardId) => {
    if (cards.length <= 1) {
      alert('You must have at least one active card linked to your wallet.');
      return;
    }
    const cardToDelete = cards.find((c) => c.id === cardId);
    if (!window.confirm(`Are you sure you want to remove ${cardToDelete?.network} •••• ${cardToDelete?.last4}?`)) {
      return;
    }

    const remaining = cards.filter((c) => c.id !== cardId);
    // If the removed card was primary, assign first available as primary
    if (cardToDelete?.isPrimary && remaining.length > 0) {
      remaining[0].isPrimary = true;
    }
    setCards(remaining);
    showNotification(`🗑️ Removed card ending in •••• ${cardToDelete?.last4}.`);
  };

  // Helper for Theme CSS class
  const getThemeClass = (theme) => {
    switch (theme) {
      case 'black': return 'card-theme-black';
      case 'emerald': return 'card-theme-emerald';
      case 'violet': return 'card-theme-violet';
      case 'sunset': return 'card-theme-sunset';
      default: return 'card-theme-sapphire';
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          letterSpacing: '-0.02em', 
          marginBottom: '0.35rem',
          color: '#ffffff'
        }}>
          Account Profile & Cards
        </h1>
        <p style={{ color: 'var(--text-royal-muted)', fontSize: '0.95rem' }}>
          Manage your personal account, connected smart cards, and security credentials.
        </p>
      </div>

      {notification && (
        <div className="alert-box alert-info" style={{ animation: 'modalFadeIn 0.3s ease' }}>
          {notification}
        </div>
      )}

      {/* Royal Sapphire Profile Card */}
      <div className="profile-hero-card">
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
          boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)',
          border: '2.5px solid rgba(255, 255, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          color: '#fff',
          fontWeight: 800
        }}>
          RK
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Rakesh Kamath</h2>
            <span className="badge badge-success">
              {cards.filter((c) => !c.isFrozen).length} Active Card{cards.filter((c) => !c.isFrozen).length !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ color: '#93c5fd', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            rakesh@example.com &bull; Primary Card: {primaryCard ? `${primaryCard.network} •••• ${primaryCard.last4}` : 'None'}
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-cobalt"
          style={{
            padding: '0.75rem 1.6rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)'
          }}
        >
          <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>+</span>
          <span>Add New Card</span>
        </button>
      </div>

      {/* Porcelain Sheet: Personal Information */}
      <div className="sheet-porcelain" style={{ borderRadius: '28px', maxWidth: '720px', marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1.25rem' }}>
          Personal Information
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input type="text" className="form-input" value="rakesh" readOnly />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-input" value="+91 9876543210" readOnly />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Billing Currency & Region</label>
            <input type="text" className="form-input" value="INR (₹) — Indian Rupee (India)" readOnly />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => showNotification('✅ Personal profile preferences saved successfully!')}
              className="btn btn-cobalt"
              style={{ padding: '0.75rem 1.8rem' }}
            >
              Save Changes
            </button>
            <button
              onClick={() => primaryCard && handleToggleFreeze(primaryCard.id)}
              className="btn btn-primary"
              style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0' }}
            >
              {primaryCard?.isFrozen ? 'Unfreeze Primary Card' : 'Freeze Primary Card'}
            </button>
          </div>
        </div>
      </div>

      {/* Connected Cards Section */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
              Connected Smart Cards
            </h2>
            <p style={{ color: 'var(--text-royal-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
              Select a card to set as primary, freeze contactless spending, or add new payment instruments.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              fontSize: '0.82rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#bfdbfe',
              fontWeight: 600
            }}>
              {cards.length} Card{cards.length !== 1 ? 's' : ''} Linked
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-cobalt"
              style={{
                padding: '0.5rem 1.15rem',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
              }}
            >
              <span style={{ fontSize: '1rem', fontWeight: 800 }}>+</span>
              <span>Add Card</span>
            </button>
          </div>
        </div>

        {/* Card Cards Grid */}
        <div className="profile-cards-grid">
          {cards.map((card) => {
            const isCardFrozen = card.isFrozen;
            return (
              <div
                key={card.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  opacity: isCardFrozen ? 0.75 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Unified Interactive 3D Card Visual */}
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '380px', margin: '0 auto', minWidth: 0, boxSizing: 'border-box' }}>
                  <Interactive3DCard card={card} />
                </div>

                {/* Card Controls Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '0.5rem 0.75rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  {!card.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(card.id)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#93c5fd',
                        borderRadius: '10px',
                        padding: '0.4rem 0.6rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                    >
                      ⭐ Set Primary
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleFreeze(card.id)}
                    style={{
                      flex: 1,
                      background: isCardFrozen ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                      border: isCardFrozen ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.2)',
                      color: isCardFrozen ? '#38bdf8' : '#e2e8f0',
                      borderRadius: '10px',
                      padding: '0.4rem 0.6rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isCardFrozen ? '☀️ Unfreeze' : '❄️ Freeze'}
                  </button>

                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    title="Remove Card"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      borderRadius: '10px',
                      padding: '0.4rem 0.7rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          ADD NEW CARD MODAL DIALOG
          ===================================================================== */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="modal-window">
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem 1.75rem 1rem',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  Add Payment Card
                </h3>
                <p style={{ color: 'var(--text-dark-subtle)', fontSize: '0.85rem', marginTop: '0.15rem' }}>
                  Link a new smart debit or credit card for automatic expense tracking.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '1.5rem 1.75rem 2rem' }}>
              {/* LIVE CARD PREVIEW (Syncs dynamically with inputs) */}
              <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '380px', margin: '0 auto', minWidth: 0, boxSizing: 'border-box' }}>
                <Interactive3DCard
                  card={{
                    nameOnCard: formData.nameOnCard || 'Cardholder',
                    cardNumber: formData.cardNumber || '4532 8921 7382 9286',
                    last4: formData.cardNumber ? formData.cardNumber.replace(/\s/g, '').slice(-4) : '9286',
                    expiry: formData.expiry || '08/32',
                    cvv: formData.cvv || '842',
                    network: formData.network || 'VISA',
                    theme: formData.theme || 'sapphire',
                    isPrimary: formData.isPrimary,
                    isFrozen: false
                  }}
                />
              </div>

              {/* CARD FORM */}
              <form onSubmit={handleAddCardSubmit}>
                {/* Theme Selector */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                    Choose Card Style & Color
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      title="Royal Sapphire"
                      onClick={() => setFormData({ ...formData, theme: 'sapphire' })}
                      className={`theme-color-pill card-theme-sapphire ${formData.theme === 'sapphire' ? 'active' : ''}`}
                    />
                    <button
                      type="button"
                      title="Luxury Matte Black"
                      onClick={() => setFormData({ ...formData, theme: 'black' })}
                      className={`theme-color-pill card-theme-black ${formData.theme === 'black' ? 'active' : ''}`}
                    />
                    <button
                      type="button"
                      title="Emerald Jade"
                      onClick={() => setFormData({ ...formData, theme: 'emerald' })}
                      className={`theme-color-pill card-theme-emerald ${formData.theme === 'emerald' ? 'active' : ''}`}
                    />
                    <button
                      type="button"
                      title="Futuristic Violet"
                      onClick={() => setFormData({ ...formData, theme: 'violet' })}
                      className={`theme-color-pill card-theme-violet ${formData.theme === 'violet' ? 'active' : ''}`}
                    />
                    <button
                      type="button"
                      title="Sunset Amber"
                      onClick={() => setFormData({ ...formData, theme: 'sunset' })}
                      className={`theme-color-pill card-theme-sunset ${formData.theme === 'sunset' ? 'active' : ''}`}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '0.5rem', textTransform: 'capitalize' }}>
                      {formData.theme} Theme
                    </span>
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" htmlFor="nameOnCard">Name on Card</label>
                  <input
                    id="nameOnCard"
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Rakesh Kamath"
                    value={formData.nameOnCard}
                    onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
                  />
                </div>

                {/* Card Number */}
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" htmlFor="cardNumber">Card Number</label>
                  <input
                    id="cardNumber"
                    type="text"
                    required
                    className="form-input"
                    placeholder="4532 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                  />
                </div>

                {/* Expiry & CVV & Network */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="expiry">Expiry (MM/YY)</label>
                    <input
                      id="expiry"
                      type="text"
                      required
                      className="form-input"
                      placeholder="08/29"
                      value={formData.expiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cvv">Security Code (CVV)</label>
                    <input
                      id="cvv"
                      type="password"
                      required
                      className="form-input"
                      placeholder="•••"
                      maxLength={4}
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="network">Network</label>
                    <select
                      id="network"
                      className="form-input"
                      value={formData.network}
                      onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                    >
                      <option value="VISA">VISA</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="RuPay">RuPay</option>
                      <option value="Amex">Amex</option>
                    </select>
                  </div>
                </div>

                {/* Make Primary Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
                  <input
                    id="isPrimaryCheckbox"
                    type="checkbox"
                    checked={formData.isPrimary}
                    onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563eb' }}
                  />
                  <label htmlFor="isPrimaryCheckbox" style={{ fontSize: '0.88rem', color: '#334155', cursor: 'pointer' }}>
                    Set as default primary card for wallet transactions
                  </label>
                </div>

                {/* Form Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-primary"
                    style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-cobalt"
                    style={{ padding: '0.75rem 1.75rem' }}
                  >
                    + Link Card to Wallet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .profile-hero-card {
          background: linear-gradient(135deg, rgba(22, 61, 125, 0.6) 0%, rgba(9, 26, 56, 0.8) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 28px;
          padding: 2rem 2.25rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          gap: 1.75rem;
          flex-wrap: wrap;
          width: 100%;
          box-sizing: border-box;
        }

        .profile-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.75rem;
          width: 100%;
        }

        @media (max-width: 768px) {
          .profile-hero-card {
            padding: 1.4rem 1.15rem;
            border-radius: 20px;
            gap: 1.25rem;
          }
          .profile-cards-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }

        @media (max-width: 420px) {
          .profile-hero-card {
            padding: 1.15rem 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

