// UstCubuk.js
import React, { useState} from 'react';
import './UstCubukProfil.css'; // Birazdan bu CSS dosyasını oluşturacağız

// Bu bileşen, arama metnini ve metin değiştiğinde çağrılacak fonksiyonu
// props olarak AnaSayfa'dan alacak.

const UstCubuk2 = () => {

  return (
    <header className="ust-cubuk">
      <div className="ust-cubuk-icerik">
        <div className="site-logo">
          {/* Buraya metin veya bir logo resmi koyabilirsiniz */}
          <a href="/">Site Adı</a> 
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

export default UstCubuk2;