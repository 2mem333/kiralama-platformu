// UstCubuk.js dosyasında değişiklik
import React, { useState, useRef, useEffect } from 'react';
import './UstCubuk.css';
import { Link,useNavigate } from 'react-router-dom';
// Profil resmi import kaldırıldı

const UstCubuk = ({ aramaMetni, onAramaChange, kullaniciId }) => {

  const navigate = useNavigate();
    const cikisYap = () => {
    localStorage.removeItem('token');  // Tokeni sil
       navigate("/giris");
  };

  const varsayilanFotograf = "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png";

  const [_AVATAR, fAvatar] = useState(['']);

  const avatarurl_cek = async ({ kullaniciid }) => {
  try {
    const params = new URLSearchParams({ sahipid: kullaniciid });
    const res = await fetch(`http://localhost:5000/api/profil?${params}`);
    if (!res.ok) throw new Error('API yanıtı başarısız');

    const [data] = await res.json(); // data artık ilk obje
    return data.avatar; // doğrudan avatar'ı döndür

  } catch (err) {
    console.error(err);
    return null; // hata durumunda null döndür
  }
};
  useEffect(() => {
  const avatari_cek = async () => {
  const avatar = await avatarurl_cek({ kullaniciid: kullaniciId });
  if(avatar)
   fAvatar(avatar);
  };
  avatari_cek();
}, [kullaniciId]);
  
  // Yeni eklenen bildirim state'leri
  const [bildirimGoster, setBildirimGoster] = useState(false);
  // Yeni: Profil menüsü göster/gizle state'i
  const [profilMenuGoster, setProfilMenuGoster] = useState(false);
  
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
    { id: 2, mesaj: "Yeni mesajınız var!", tarih: "2 dakika önce", okundu: false },
    { id: 3, mesaj: "İlanınız beğenildi", tarih: "1 saat önce", okundu: true },
    { id: 4, mesaj: "Ödeme onaylandı", tarih: "3 gün önce", okundu: true }
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
    // Diğer menüyü kapat
    if (!bildirimGoster) setProfilMenuGoster(false);
  };
  
  // Profil menüsünü gösterme/toggle fonksiyonu
  const toggleProfilMenu = () => {
    setProfilMenuGoster(!profilMenuGoster);
    // Diğer menüyü kapat
    if (!profilMenuGoster) setBildirimGoster(false);
  };
  
  // Tümünü okundu yapma fonksiyonu:
  const markAllAsRead = () => {
    setBildirimler(bildirimler.map(b => ({ ...b, okundu: true })));
  };

  // Dışarı tıklandığında menüleri kapatma
  const bildirimRef = useRef(null);
  const profilRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bildirimRef.current && !bildirimRef.current.contains(event.target)) {
        setBildirimGoster(false);
      }
      if (profilRef.current && !profilRef.current.contains(event.target)) {
        setProfilMenuGoster(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <div className="bildirim-container" ref={bildirimRef}>
            <div className="bildirim-icon" onClick={toggleBildirimler}>
              <i className="fas fa-bell">🔔</i>
              {okunmamisBildirimler > 0 && (
                <span className="bildirim-sayaci">{okunmamisBildirimler}</span>
              )}
            </div>

            {bildirimGoster && (
              <div className="bildirim-dropdown">
                <div className="bildirim-header">
                  <h3>Bildirimler</h3>
                  <span className="kapat-btn" onClick={() => setBildirimGoster(false)}>×</span>
                </div>
                <div className="bildirim-listesi">
                  {bildirimler.map((bildirim, idx) => (
                    <div 
                      key={bildirim.id} 
                      className={`bildirim-item ${!bildirim.okundu ? 'okunmamis' : ''}`}
                    >
                      <div className="bildirim-mesaj">{bildirim.mesaj}</div>
                      <div className="bildirim-tarih">{bildirim.tarih}</div>
                      
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
                              {bildirim.teklifDetay.durum === "onaylandı" ? "ONAYLANDI" : "REDDEDİLDİ"}
                            </span>
                          )}
                        </div>
                      )}
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
          
          {/* Profil ikonu ve dropdown menü */}
          <div className='profil-container' ref={profilRef}>
            <div className="profil-ikon" onClick={toggleProfilMenu}>
              <div className="profil-resim-container">
                <img 
                  src={_AVATAR.length < 5 ? varsayilanFotograf : _AVATAR}
                  alt="Profil" 
                  className="profil-resim" 
                />
              </div>
            </div>
            
            {/* Profil Dropdown Menü */}
            {profilMenuGoster && (
              <div className="profil-dropdown">
                <ul className="profil-menu-listesi">
                  <li className="profil-menu-item">
                    <Link to={kullaniciId ? `/profiller/${kullaniciId}` : "/giris"}>
                      <i className="profil-menu-ikon">👤</i>
                      <span>Profil</span>
                    </Link>
                  </li>
                  <li className="profil-menu-item">
                     <Link to={kullaniciId ? `/ilan-yonetimi/${kullaniciId}` : "/giris"}>
                      <i className="profil-menu-ikon">📋</i>
                      <span>İlanlarım</span>
                    </Link>
                  </li>
                  <li className="profil-menu-item">
                    <Link to={kullaniciId ? `/ilanolustur` : "/giris"}>
                      <i className="profil-menu-ikon">➕</i>
                      <span>İlan Oluştur</span>
                    </Link>
                  </li>
                  <li className="profil-menu-item">
                    <Link to="/uyelik">
                      <i className="profil-menu-ikon">⭐</i>
                      <span>Premium Üyelik</span>
                    </Link>
                  </li>
                  <li className="profil-menu-item">
                    <Link to="/sss">
                      <i className="profil-menu-ikon">⭐</i>
                      <span>Sıkça Sorulan Sorular</span>
                    </Link>
                  </li>
                  <li className="profil-menu-ayrac"></li>
                 <li className="profil-menu-item" onClick={cikisYap} style={{ cursor: 'pointer' }}>
      <i className="profil-menu-ikon">🚪</i>
      <span>Çıkış Yap</span>
    </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UstCubuk;