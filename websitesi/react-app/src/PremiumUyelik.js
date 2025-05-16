import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PremiumUyelik.css';

const PremiumUyelik = () => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [cardDetails, setCardDetails] = useState({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const plans = [
    { 
      id: 'monthly',
      price: 99.90,
      title: 'Aylık Üyelik',
      benefits: [
        '✓ Haftalık 10 İlan Hakkı',
        '✓ 3 Ay Geçerlilik',
        '✓ 7/24 Destek'
      ]
    },
    { 
      id: 'yearly',
      price: 999.90,
      title: 'Yıllık Üyelik',
      benefits: [
        '✓ Sınırsız İlan Hakkı',
        '✓ 6 Ay Geçerlilik',
        '✓ Özel Müşteri Desteği',
        '✓ Detaylı Raporlar'
      ]
    }
  ];

  useEffect(() => {
    if(cardDetails.cardNumber.length === 16 && !cardDetails.cardNumber.match(/\s/)) {
      setCardDetails(prev => ({
        ...prev,
        cardNumber: prev.cardNumber.match(/.{1,4}/g)?.join(' ') || prev.cardNumber
      }));
    }
  }, [cardDetails.cardNumber]);

  const validateField = (name, value) => {
    let error = '';
    switch(name) {
      case 'cardHolder':
        if(!value.trim()) error = 'Kart sahibi adı gereklidir';
        break;
      case 'cardNumber':
        if(!value.replace(/\s/g, '').match(/^\d{16}$/)) error = 'Geçersiz kart numarası';
        break;
      case 'expiry':
        if(!value.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) error = 'Geçersiz tarih (AA/YY)';
        break;
      case 'cvc':
        if(!value.match(/^\d{3}$/)) error = 'Geçersiz CVC';
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => {
      const newValue = name === 'expiry' ? 
        value.replace(/\D/g, '').replace(/^(\d{2})(\d{0,2})/, '$1/$2') :
        value;
      
      return { ...prev, [name]: newValue };
    });
    
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(cardDetails).forEach(([key, value]) => {
      newErrors[key] = validateField(key, value);
    });
    
    setErrors(newErrors);
    if(Object.values(newErrors).some(error => error)) return;

    setLoading(true);
    try {
      const paymentData = {
        plan: selectedPlan,
        ...cardDetails,
        cardNumber: cardDetails.cardNumber.replace(/\s/g, '')
      };

      const response = await axios.post('/api/odeme', paymentData);
      
      if(response.data.success) {
        window.location.href = '/odeme-basarili';
      } else {
        alert(`Ödeme hatası: ${response.data.error}`);
      }
    } catch (error) {
      alert(`Sunucu hatası: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uyelik-container">
      <div className="header">
        <h1>Premium Üyelik Seçenekleri</h1>
        <p>Size en uygun planı seçin ve avantajlardan yararlanın</p>
      </div>

      <div className="plan-grid">
        {plans.map(plan => (
          <div 
            key={plan.id}
            className={`plan-card ${selectedPlan === plan.id ? 'active' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <h3>{plan.title}</h3>
            <div className="price">₺{plan.price.toFixed(2)}</div>
            <ul className="benefits-list">
              {plan.benefits.map((benefit, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>Kart Sahibi</label>
          <input
            type="text"
            name="cardHolder"
            value={cardDetails.cardHolder}
            onChange={handleInputChange}
            placeholder="Ad Soyad"
            className={errors.cardHolder ? 'error' : ''}
          />
          {errors.cardHolder && <span className="error-message">{errors.cardHolder}</span>}
        </div>

        <div className="form-group">
          <label>Kart Numarası</label>
          <input
            type="text"
            name="cardNumber"
            value={cardDetails.cardNumber}
            onChange={handleInputChange}
            placeholder="4242 4242 4242 4242"
            maxLength="19"
            className={errors.cardNumber ? 'error' : ''}
          />
          {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Son Kullanma Tarihi (AA/YY)</label>
            <input
              type="text"
              name="expiry"
              value={cardDetails.expiry}
              onChange={handleInputChange}
              placeholder="12/25"
              maxLength="5"
              className={errors.expiry ? 'error' : ''}
            />
            {errors.expiry && <span className="error-message">{errors.expiry}</span>}
          </div>

          <div className="form-group">
            <label>CVC</label>
            <input
              type="password"
              name="cvc"
              value={cardDetails.cvc}
              onChange={handleInputChange}
              placeholder="123"
              maxLength="3"
              className={errors.cvc ? 'error' : ''}
            />
            {errors.cvc && <span className="error-message">{errors.cvc}</span>}
          </div>
        </div>

        <button 
          type="submit" 
          className={`submit-btn ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'İşleniyor...' : 'Hemen Satın Al'}
        </button>
      </form>
    </div>
  );
};

export default PremiumUyelik;