import React from 'react';
import { useNavigate } from 'react-router-dom';

function Anasayfa() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); // /login sayfasına yönlendirme yapıyor
  };

  return (
    <div>
      <h1>Anasayfa</h1>
      <button onClick={handleLogin}>Giriş Yap</button>
    </div>
  );
}

export default Anasayfa;
