import React, { useState } from 'react';
import './GirisPaneli.css'; // Bu dosyayı ayrıca oluşturacağız
import { useNavigate } from 'react-router-dom';


const GirisPaneli = () => {
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreGoster, setSifreGoster] = useState(false);
  const [beniHatirla, setBeniHatirla] = useState(false);
  const [hataMesaji, setHataMesaji] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const navigate = useNavigate();

  const kayitPaneliYonlendirme = () => {
    navigate('/kayit'); // /login sayfasına yönlendirme yapıyor
  };

  const girisYap = async (olay) => {
    olay.preventDefault();

    if (!eposta) {
      setHataMesaji('Lütfen e-posta adresinizi girin');
      return;
    }
    
    if (!sifre) {
      setHataMesaji('Lütfen şifrenizi girin');
      return;
    }

    try { //SERVER ILE HABERLESME
      const yanit = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: eposta, password: sifre }),
      });

      const veri = await yanit.json();
      
      if (yanit.status === 200) {
        setMesaj('Giriş başarılı: ' + eposta);
        setHataMesaji('');
      } else {
        setHataMesaji('E-posta veya şifreniz hatalı!');
        setMesaj('');
      }
    } catch (hata) {
      setHataMesaji('Sunucuya ulaşılamıyor!');
    }
  };

  //FRONT-END KISMI
  return (
    <div className="giris-konteyner">
      <div className="giris-kart">
        <div className="giris-baslik">
          <h1>Hoş Geldiniz</h1>
          <p>Hesabınıza giriş yapın</p>
        </div>

        {hataMesaji && (
          <div className="hata-mesaji">
            <span className="hata-ikonu">⚠️</span>
            <span>{hataMesaji}</span>
          </div>
        )}

        {mesaj && (
          <div className="basarili-mesaj">
            <span>{mesaj}</span>
          </div>
        )}

        <form onSubmit={girisYap}>
          <div className="form-grup">
            <label htmlFor="eposta">E-posta Adresi</label>
            <div className="girdi-kapsayici">
              <span className="girdi-ikonu">✉️</span>
              <input
                id="eposta"
                type="email"
                value={eposta}
                onChange={(e) => setEposta(e.target.value)}
                placeholder="ornek@email.com"
              />
            </div>
          </div>
        
          <div className="form-grup">
            <div className="etiket-satiri">
              <label htmlFor="sifre">Şifre</label>
              <button
                type="button"
                className="sifremi-unuttum"
              >
                Şifremi Unuttum
              </button>
            </div>
            <div className="girdi-kapsayici">
              <input
                id="sifre"
                type={sifreGoster ? "text" : "password"}
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                placeholder="••••••••"
                className="sifre-girdisi"
              />
              <button
                type="button"
                className="sifre-goster"
                onClick={() => setSifreGoster(!sifreGoster)}
              >
                {sifreGoster ? "Gizle" : "Göster"}
              </button>
            </div>
          </div>

          <div className="form-grup onay-grup">
            <input
              id="beni-hatirla"
              type="checkbox"
              checked={beniHatirla}
              onChange={() => setBeniHatirla(!beniHatirla)}
            />
            <label htmlFor="beni-hatirla">
              Beni Hatırla
            </label>
          </div>

          <div className="form-grup">
            <button
              type="submit"
              disabled={yukleniyor}
              className="giris-buton"
            >
              {yukleniyor ? (
                <span className="yukleniyor-yazi">
                  <span className="yukleniyor-spinner"></span>
                  Giriş Yapılıyor...
                </span>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </div>
        </form>

        <div className="kayit-link">
          <p>
            Henüz hesabınız yok mu?{' '}
            <button type="button" onClick={kayitPaneliYonlendirme}>
              Kaydolun
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GirisPaneli;
