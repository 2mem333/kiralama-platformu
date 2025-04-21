import React, { useState } from 'react';
import LoginPanel from './GirisPaneli';
import RegisterPanel from './KayitPaneli';

const AuthContainer = () => {
  const [currentPanel, setCurrentPanel] = useState('login'); // 'login' veya 'register'

  const switchToRegister = () => {
    setCurrentPanel('register');
  };

  const switchToLogin = () => {
    setCurrentPanel('login');
  };

  // LoginPanel'in kaydol butonuna tıklandığında çağrılacak fonksiyon
  const handleRegisterClick = () => {
    switchToRegister();
  };

  // RegisterPanel'in giriş yap butonuna tıklandığında çağrılacak fonksiyon
  const handleLoginClick = () => {
    switchToLogin();
  };

  return (
    <div>
      {currentPanel === 'login' ? (
        <LoginPanel kayitPaneliYonlendirme={handleRegisterClick} />
      ) : (
        <RegisterPanel girisPaneliYonlendirme={handleLoginClick} />
      )}
    </div>
  );
};

export default AuthContainer;