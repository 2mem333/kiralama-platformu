import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AuthPortal = () => {
  const [authData, setAuthData] = useState({
    identifier: '',
    credential: '',
    rememberSession: false
  });
  
  const [authState, setAuthState] = useState({
    isLoading: false,
    viewPassword: false,
    error: null,
    success: null
  });

  const [shakeEffect, setShakeEffect] = useState(false);

  useEffect(() => {
    // Otomatik doldurma için localStorage kontrolü
    const savedAuth = localStorage.getItem('rememberedAuth');
    if (savedAuth) {
      setAuthData(JSON.parse(savedAuth));
    }
  }, []);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setAuthData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const authenticateUser = async (e) => {
    e.preventDefault();
    
    if (!authData.identifier || !authData.credential) {
      triggerFeedback('Lütfen tüm alanları doldurun', 'error', true);
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Başarılı yanıt simülasyonu
      if (authData.identifier === 'demo@example.com' && authData.credential === 'demo123') {
        handleSuccessfulAuth();
      } else {
        throw new Error('Geçersiz kimlik bilgileri');
      }
    } catch (err) {
      triggerFeedback(err.message, 'error', true);
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSuccessfulAuth = () => {
    if (authData.rememberSession) {
      localStorage.setItem('rememberedAuth', JSON.stringify(authData));
    } else {
      localStorage.removeItem('rememberedAuth');
    }
    
    triggerFeedback(`Hoş geldiniz, ${authData.identifier.split('@')[0]}`, 'success');
    
    // Gerçek uygulamada burada yönlendirme yapılır
    // navigate('/dashboard');
  };

  const triggerFeedback = (message, type, shake = false) => {
    if (type === 'error') {
      setAuthState(prev => ({ ...prev, error: message, success: null }));
    } else {
      setAuthState(prev => ({ ...prev, success: message, error: null }));
    }
    
    if (shake) {
      setShakeEffect(true);
      setTimeout(() => setShakeEffect(false), 600);
    }
  };

  const togglePasswordVisibility = () => {
    setAuthState(prev => ({ ...prev, viewPassword: !prev.viewPassword }));
  };

  return (
    <motion.div 
      className="auth-container"
      animate={shakeEffect ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 3a9 9 0 0 1 9 9c0 1.65-.5 3.17-1.32 4.45l1.47 1.47a11 11 0 0 0-5.15-14.92L12 7.5V3z"/>
              <path d="M2.5 4.5l1.41 1.41a11 11 0 0 0 5.15 14.92L12 16.5v4.5l-9-9a9 9 0 0 1 9-9h4.5l-2.6-2.6-1.41 1.41z"/>
            </svg>
          </div>
          <h1>Hesabınıza Giriş Yapın</h1>
          <p>Sistem kaynaklarına erişmek için kimlik doğrulama gereklidir</p>
        </div>

        {authState.error && (
          <div className="auth-message error">
            <svg viewBox="0 0 24 24">
              <path d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
            </svg>
            <span>{authState.error}</span>
          </div>
        )}

        {authState.success && (
          <div className="auth-message success">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"/>
            </svg>
            <span>{authState.success}</span>
          </div>
        )}

        <form onSubmit={authenticateUser}>
          <div className="input-field">
            <label htmlFor="identifier">E-posta Adresi</label>
            <div className="input-wrapper">
              <input
                id="identifier"
                name="identifier"
                type="email"
                value={authData.identifier}
                onChange={handleInput}
                placeholder="ornek@mail.com"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="credential">Şifre</label>
            <div className="input-wrapper password">
              <input
                id="credential"
                name="credential"
                type={authState.viewPassword ? "text" : "password"}
                value={authData.credential}
                onChange={handleInput}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={togglePasswordVisibility}
              >
                {authState.viewPassword ? 'Gizle' : 'Göster'}
              </button>
            </div>
          </div>

          <div className="auth-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="rememberSession"
                checked={authData.rememberSession}
                onChange={handleInput}
              />
              <span className="checkmark"></span>
              Oturumu hatırla
            </label>
            <button type="button" className="forgot-password">
              Şifremi unuttum?
            </button>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={authState.isLoading}
          >
            {authState.isLoading ? (
              <>
                <span className="spinner"></span>
                Doğrulanıyor...
              </>
            ) : 'Giriş Yap'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Hesabınız yok mu?</span>
          <button type="button" className="register-link">
            Kayıt Ol
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPortal;