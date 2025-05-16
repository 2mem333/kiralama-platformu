import React, { useState, useRef } from 'react';
import './UstCubuk.css';
import { Link } from 'react-router-dom';

const UstCubuk = ({ aramaMetni, onAramaChange }) => {

  // Yeni eklenen bildirim state'leri
    const [bildirimGoster, setBildirimGoster] = useState(false);
    const [bildirimler, setBildirimler] = useState([
    {
      id: 1,
      type: "teklif", // Yeni özellik: bildirim türü
      mesaj: "Ahmet Yılmaz 'Komodin' ilanınıza 450 TL teklif verdi",
      tarih: "2 dakika önce",
      okundu: false,
      teklifDetay: { // Yeni özellik: teklif bilgileri
        teklifVerenId: "user123",
        ilanId: "ilan456",
        miktar: 450,
        durum: "bekliyor" // 'onaylandı', 'reddedildi'
      }
    },
    { id: 1, mesaj: "Yeni mesajınız var!", tarih: "2 dakika önce", okundu: false },
    { id: 2, mesaj: "İlanınız beğenildi", tarih: "1 saat önce", okundu: true },
    { id: 3, mesaj: "Ödeme onaylandı", tarih: "3 gün önce", okundu: true }
    ]);
  
    // Okunmamış bildirim sayısı
    const okunmamisBildirimler = bildirimler.filter(b => !b.okundu).length;
  
    // Teklif işlemleri için fonksiyonlar
    const handleTeklifOnay = (bildirimId) => {
      setBildirimler(bildirimler.map(b => {
        if (b.id === bildirimId) {
          return {
            ...b,
            teklifDetay: { ...b.teklifDetay, durum: "onaylandı" },
            okundu: true
          };
        }
        return b;
      }));
      // API'ye onay isteği gönderilebilir
    };
  
    const handleTeklifRed = (bildirimId) => {
      setBildirimler(bildirimler.map(b => {
        if (b.id === bildirimId) {
          return {
            ...b,
            teklifDetay: { ...b.teklifDetay, durum: "reddedildi" },
            okundu: true
          };
        }
        return b;
      }));
      // API'ye red isteği gönderilebilir
    };
  
    // Bildirim render fonksiyonu
    const renderBildirimler = () => (
      <div className="bildirimler-dropdown">
        <div className="bildirim-header">
          <span>Bildirimler ({okunmamisBildirimler})</span>
          <button onClick={markAllAsRead}>Tümünü Okundu İşaretle</button>
        </div>
  
        {bildirimler.map(bildirim => (
          <div 
            key={bildirim.id}
            className={`bildirim-item ${!bildirim.okundu ? 'okunmamis' : ''}`}
          >
            <div className="bildirim-mesaj">
              {bildirim.mesaj}
              {bildirim.type === "teklif" && (
                <div className="teklif-actions">
                  {bildirim.teklifDetay.durum === "bekliyor" ? (
                    <>
                      <button 
                        className="onayla-btn"
                        onClick={() => handleTeklifOnay(bildirim.id)}
                      >
                        ✔️ Onayla
                      </button>
                      <button 
                        className="reddet-btn"
                        onClick={() => handleTeklifRed(bildirim.id)}
                      >
                        ❌ Reddet
                      </button>
                    </>
                  ) : (
                    <span className={`teklif-durum ${bildirim.teklifDetay.durum}`}>
                      {bildirim.teklifDetay.durum.toUpperCase()}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="bildirim-tarih">{bildirim.tarih}</div>
          </div>
        ))}
      </div>
    );
  
    // Bildirimleri gösterme/toggle fonksiyonu
    const toggleBildirimler = () => {
      setBildirimGoster(!bildirimGoster);
    };
  
    // Tümünü okundu yapma fonksiyonu:
    const markAllAsRead = () => {
      setBildirimler(bildirimler.map(b => ({ ...b, okundu: true })));
    };

  return (
    <header className="ust-cubuk">
      <div className="ust-cubuk-icerik">
        <div className="site-logo">
          <Link to="/">Site Adı</Link>
        </div>
        
        <div className="arama-konteyner-ust">
          <span className="arama-ikon-ust">🔍</span>
          <input
            type="text"
            className="arama-input-ust"
            placeholder="İlanlarda ara..."
            value={aramaMetni}
            onChange={onAramaChange}
          />
        </div>

        <div className="sag-menu-ogeleri">
          {/* Bildirim İkonu */}
          <div className="bildirim-container">
            <div className="bildirim-icon" onClick={toggleBildirimler}>
              <i className="fas fa-bell">🔔</i>
              {okunmamisBildirimler > 0 && (
                <span className="bildirim-sayaci">{okunmamisBildirimler}</span>
              )}
            </div>

            {bildirimGoster && renderBildirimler()} {/* ✅ Doğru render fonksiyonu */}
            
            {bildirimGoster && (
              <div className="bildirim-dropdown">
                <div className="bildirim-header">
                  <h3>Bildirimler</h3>
                  {/* <span className="kapat-btn" onClick={() => setBildirimGoster(false)}>×</span> */}
                  <span className="kapat-btn" onClick={() => setBildirimGoster(false)}>×</span>
                </div>
                <div className="bildirim-listesi">
                  {bildirimler.map((bildirim, idx) => (
                <div 
                  key={bildirim.id} 
                  className={`bildirim-item ${!bildirim.okundu ? 'okunmamis' : ''}`}
                >
                  {/* <span className="bildirim-no">{idx + 1}.</span> */}
                  <div className="bildirim-mesaj">{bildirim.mesaj}</div>
                  <div className="bildirim-tarih">{bildirim.tarih}</div>
                </div>
                ))}
                </div>
                <div className='bildirim-okundu'>
                  <button 
                          className="tumunu-okundu-btn"
                          onClick={markAllAsRead}
                          disabled={okunmamisBildirimler === 0}
                  >
                          Tümünü Okundu Yap
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Profil ikonu ekliyoruz */}
          <div className='profil-container'>
            <a href="/profiller/17" className="profil-ikon">
              <span className="profil-ikon-ust">👤</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UstCubuk;