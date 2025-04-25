// UstCubuk.js
import React from 'react';
import './UstCubuk.css'; // Birazdan bu CSS dosyasını oluşturacağız

// Bu bileşen, arama metnini ve metin değiştiğinde çağrılacak fonksiyonu
// props olarak AnaSayfa'dan alacak.
const UstCubuk = ({ aramaMetni, onAramaChange }) => {
  return (
    <header className="ust-cubuk">
      <div className="ust-cubuk-icerik">
        <div className="site-logo">
          {/* Buraya metin veya bir logo resmi koyabilirsiniz */}
          <a href="/">Site Adı</a> 
        </div>
        
        <div className="arama-konteyner-ust">
          <span className="arama-ikon-ust">🔍</span>
          <input
            type="text"
            className="arama-input-ust"
            placeholder="İlanlarda ara..."
            value={aramaMetni}
            onChange={onAramaChange} // Props'tan gelen fonksiyonu bağlıyoruz
          />
        </div>

        {/* Taslaktaki diğer öğeler (Konum, Giriş vb.) için yer tutucu */}
        <div className="sag-menu-ogeleri">
          {/* <button>Konum</button> */}
          {/* <button>Giriş Yap</button> */}
          {/* <button>Profil</button> */}
        </div>
      </div>
    </header>
  );
};

export default UstCubuk;