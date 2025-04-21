import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css'; // Farklı bir stil dosyası

const AuthPortal = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [viewState, setViewState] = useState({
    showPassword: false,
    rememberMe: false,
    isLoading: false,
    shake: false
  });
  const [authFeedback, setAuthFeedback] = useState({
    error: null,
    success: null
  });
  
  const navigate = useNavigate();

  // Otomatik giriş kontrolü
  useEffect(() => {
    const savedUser = localStorage.getItem('rememberedUser');
    if (savedUser) {
      setCredentials(JSON.parse(savedUser));
      setViewState(prev => ({ ...prev, rememberMe: true }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setViewState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    
    // Validasyon
    if (!credentials.username || !credentials.password) {
      triggerError('Kullanıcı adı ve şifre gereklidir');
      return;
    }

    setViewState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Başarılı giriş simülasyonu
      if (credentials.username === 'demo' && credentials.password === 'demo123') {
        handleSuccess();
      } else {
        throw new Error('Geçersiz kimlik bilgileri');
      }
    } catch (err) {
      triggerError(err.message);
    } finally {
      setViewState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSuccess = () => {
    if (viewState.rememberMe) {
      localStorage.setItem('rememberedUser', JSON.stringify(credentials));
    } else {
      localStorage.removeItem('rememberedUser');
    }
    
    setAuthFeedback({
      error: null,
      success: `Hoş geldiniz, ${credentials.username}`
    });
    
    // Yönlendirme
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  const triggerError = (message) => {
    setAuthFeedback({
      error: message,
      success: null
    });
    setViewState(prev => ({ ...prev, shake: true }));
    setTimeout(() => setViewState(prev => ({ ...prev, shake: false })), 500);
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  const navigateToReset = () => {
    navigate('/reset-password');
  };

  return (
    <div className={`auth-container ${viewState.shake ? 'shake-animation' : ''}`}>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <svg viewBox="0 0 24 24" width="48" height="48">
              <path fill="#6366f1" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5A1.5,1.5 0 0,1 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5Z" />
            </svg>
          </div>
          <h1>Hesap Girişi</h1>
          <p>Sistem paneline erişmek için giriş yapın</p>
        </div>

        {authFeedback.error && (
          <div className="auth-alert error">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
            <span>{authFeedback.error}</span>
          </div>
        )}

        {authFeedback.success && (
          <div className="auth-alert success">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
            </svg>
            <span>{authFeedback.success}</span>
          </div>
        )}

        <form onSubmit={handleAuth}>
          <div className="input-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <div className="input-wrapper">
              <input
                id="username"
                name="username"
                type="text"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="kullanici_adi"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="label-row">
              <label htmlFor="password">Şifre</label>
              <button 
                type="button" 
                className="text-button"
                onClick={navigateToReset}
              >
                Şifremi Unuttum?
              </button>
            </div>
            <div className="input-wrapper password">
              <input
                id="password"
                name="password"
                type={viewState.showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {viewState.showPassword ? (
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="options-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={viewState.rememberMe}
                onChange={() => setViewState(prev => ({ ...prev, rememberMe: !prev.rememberMe }))}
              />
              <span className="checkmark"></span>
              Beni hatırla
            </label>
          </div>

          <button 
            type="submit" 
            className="auth-button primary"
            disabled={viewState.isLoading}
          >
            {viewState.isLoading ? (
              <>
                <span className="spinner"></span>
                Giriş Yapılıyor...
              </>
            ) : 'Giriş Yap'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Hesabınız yok mu?</span>
          <button 
            type="button" 
            className="text-button"
            onClick={navigateToRegister}
          >
            Yeni hesap oluştur
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;