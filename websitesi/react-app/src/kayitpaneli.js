import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: ''
    },
    contact: {
      email: '',
      phone: '',
      country: '',
      city: ''
    },
    security: {
      password: '',
      confirmPassword: ''
    }
  });

  const [uiState, setUiState] = useState({
    currentStep: 1,
    showPassword: false,
    isLoading: false,
    errors: {},
    success: false
  });

  const navigate = useNavigate();
  const steps = ['Kişisel Bilgiler', 'İletişim Bilgileri', 'Güvenlik'];

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.personal.firstName) newErrors.firstName = 'Ad zorunludur';
      if (!formData.personal.lastName) newErrors.lastName = 'Soyad zorunludur';
      if (!formData.personal.birthDate) newErrors.birthDate = 'Doğum tarihi zorunludur';
    }
    
    if (step === 2) {
      if (!formData.contact.email) newErrors.email = 'E-posta zorunludur';
      else if (!/^\S+@\S+\.\S+$/.test(formData.contact.email)) newErrors.email = 'Geçersiz e-posta';
      if (!formData.contact.phone) newErrors.phone = 'Telefon zorunludur';
    }
    
    if (step === 3) {
      if (!formData.security.password) newErrors.password = 'Şifre zorunludur';
      else if (formData.security.password.length < 8) newErrors.password = 'Şifre en az 8 karakter olmalı';
      if (formData.security.password !== formData.security.confirmPassword) {
        newErrors.confirmPassword = 'Şifreler eşleşmiyor';
      }
    }
    
    setUiState(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(uiState.currentStep)) {
      setUiState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const prevStep = () => {
    setUiState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    setUiState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Başarılı kayıt simülasyonu
      setUiState(prev => ({ ...prev, success: true, isLoading: false }));
      
      // 2 saniye sonra giriş sayfasına yönlendir
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setUiState(prev => ({
        ...prev,
        errors: { api: 'Kayıt sırasında bir hata oluştu' },
        isLoading: false
      }));
    }
  };

  return (
    <motion.div 
      className="registration-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="registration-card">
        <div className="registration-header">
          <h1>Yeni Hesap Oluştur</h1>
          <div className="step-indicator">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`step ${uiState.currentStep > index + 1 ? 'completed' : ''} ${uiState.currentStep === index + 1 ? 'active' : ''}`}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-label">{step}</div>
              </div>
            ))}
          </div>
        </div>

        {uiState.success ? (
          <div className="success-message">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"/>
            </svg>
            <h2>Kayıt Başarılı!</h2>
            <p>Hesabınız başarıyla oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {uiState.errors.api && (
              <div className="error-message">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M13 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
                </svg>
                <span>{uiState.errors.api}</span>
              </div>
            )}

            {/* Adım 1: Kişisel Bilgiler */}
            {uiState.currentStep === 1 && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="form-step"
              >
                <div className="form-group">
                  <label>Ad*</label>
                  <input
                    type="text"
                    value={formData.personal.firstName}
                    onChange={(e) => handleChange('personal', 'firstName', e.target.value)}
                    placeholder="Adınız"
                  />
                  {uiState.errors.firstName && <span className="error">{uiState.errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label>Soyad*</label>
                  <input
                    type="text"
                    value={formData.personal.lastName}
                    onChange={(e) => handleChange('personal', 'lastName', e.target.value)}
                    placeholder="Soyadınız"
                  />
                  {uiState.errors.lastName && <span className="error">{uiState.errors.lastName}</span>}
                </div>

                <div className="form-group">
                  <label>Doğum Tarihi*</label>
                  <input
                    type="date"
                    value={formData.personal.birthDate}
                    onChange={(e) => handleChange('personal', 'birthDate', e.target.value)}
                  />
                  {uiState.errors.birthDate && <span className="error">{uiState.errors.birthDate}</span>}
                </div>

                <div className="form-group">
                  <label>Cinsiyet</label>
                  <select
                    value={formData.personal.gender}
                    onChange={(e) => handleChange('personal', 'gender', e.target.value)}
                  >
                    <option value="">Seçiniz</option>
                    <option value="male">Erkek</option>
                    <option value="female">Kadın</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Adım 2: İletişim Bilgileri */}
            {uiState.currentStep === 2 && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="form-step"
              >
                <div className="form-group">
                  <label>E-posta*</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleChange('contact', 'email', e.target.value)}
                    placeholder="ornek@email.com"
                  />
                  {uiState.errors.email && <span className="error">{uiState.errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Telefon*</label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                    placeholder="05XX XXX XX XX"
                  />
                  {uiState.errors.phone && <span className="error">{uiState.errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Ülke</label>
                  <input
                    type="text"
                    value={formData.contact.country}
                    onChange={(e) => handleChange('contact', 'country', e.target.value)}
                    placeholder="Ülke"
                  />
                </div>

                <div className="form-group">
                  <label>Şehir</label>
                  <input
                    type="text"
                    value={formData.contact.city}
                    onChange={(e) => handleChange('contact', 'city', e.target.value)}
                    placeholder="Şehir"
                  />
                </div>
              </motion.div>
            )}

            {/* Adım 3: Güvenlik */}
            {uiState.currentStep === 3 && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="form-step"
              >
                <div className="form-group">
                  <label>Şifre*</label>
                  <div className="password-input">
                    <input
                      type={uiState.showPassword ? "text" : "password"}
                      value={formData.security.password}
                      onChange={(e) => handleChange('security', 'password', e.target.value)}
                      placeholder="En az 8 karakter"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                    >
                      {uiState.showPassword ? 'Gizle' : 'Göster'}
                    </button>
                  </div>
                  {uiState.errors.password && <span className="error">{uiState.errors.password}</span>}
                </div>

                <div className="form-group">
                  <label>Şifre Tekrar*</label>
                  <input
                    type={uiState.showPassword ? "text" : "password"}
                    value={formData.security.confirmPassword}
                    onChange={(e) => handleChange('security', 'confirmPassword', e.target.value)}
                    placeholder="Şifrenizi tekrar girin"
                  />
                  {uiState.errors.confirmPassword && <span className="error">{uiState.errors.confirmPassword}</span>}
                </div>

                <div className="terms-checkbox">
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">
                    <a href="/terms" target="_blank" rel="noopener noreferrer">Kullanım koşullarını</a> okudum ve kabul ediyorum
                  </label>
                </div>
              </motion.div>
            )}

            <div className="form-navigation">
              {uiState.currentStep > 1 && (
                <button
                  type="button"
                  className="nav-button prev"
                  onClick={prevStep}
                  disabled={uiState.isLoading}
                >
                  Önceki
                </button>
              )}
              
              {uiState.currentStep < steps.length ? (
                <button
                  type="button"
                  className="nav-button next"
                  onClick={nextStep}
                  disabled={uiState.isLoading}
                >
                  Sonraki
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-button"
                  disabled={uiState.isLoading}
                >
                  {uiState.isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Kaydediliyor...
                    </>
                  ) : 'Kaydı Tamamla'}
                </button>
              )}
            </div>
          </form>
        )}

        <div className="login-redirect">
          Zaten hesabınız var mı?{' '}
          <button type="button" onClick={() => navigate('/login')}>
            Giriş Yap
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserRegistration;