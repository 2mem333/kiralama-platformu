import React, { useState } from 'react';
import './Profil.css'; // Profil sayfası için özel CSS

const Profil = () => {
  const [aktifSekme, setAktifSekme] = useState('hakkimda');
  const [profilBilgileri, setProfilBilgileri] = useState({
    isim: "Ahmet Yılmaz",
    konum: "İstanbul, Türkiye",
    avatar: "/profil-avatar.jpg",
    durum: "Premium Üye",
    hakkimda: "10 yıldır ikinci el eşya alım satımı yapıyorum. Özellikle antika mobilyalara ilgim var. Satın aldığım ve sattığım ürünlerin kaliteli olmasına özen gösteririm.",
    telefon: "+90 555 123 45 67",
    email: "ahmet.yilmaz@example.com",
    kayitTarihi: "12.03.2018",
    dogumTarihi: "15.08.1985"
  });

  // Kullanıcının ilanları
  const [kullaniciIlanlari] = useState([
    {
      id: 1,
      baslik: "Antika Sandalye Seti",
      fiyat: 4500,
      resim: "/antika-sandalye.jpg",
      tarih: "3 gün önce",
      goruntulenme: 124,
      favori: 8
    },
    {
      id: 2,
      baslik: "Vintage Masa",
      fiyat: 3200,
      resim: "/vintage-masa.jpg",
      tarih: "1 hafta önce",
      goruntulenme: 89,
      favori: 5
    },
    {
      id: 3,
      baslik: "Eski Tip Radyo",
      fiyat: 1200,
      resim: "/eski-radyo.jpg",
      tarih: "2 hafta önce",
      goruntulenme: 156,
      favori: 12
    }
  ]);

  // Kullanıcının favori ilanları
  const [favoriIlanlar] = useState([
    {
      id: 101,
      baslik: "Retro Koltuk Takımı",
      fiyat: 6800,
      resim: "/retro-koltuk.jpg",
      sahibi: "Ayşe Demir"
    },
    {
      id: 102,
      baslik: "Ahşap Kitaplık",
      fiyat: 2300,
      resim: "/ahsap-kitaplik.jpg",
      sahibi: "Mehmet Kaya"
    }
  ]);

  // Kullanıcıya gelen yorumlar
  const [yorumlar] = useState([
    {
      id: 1,
      yazar: "Zeynep Ak",
      avatar: "/yorumcu1.jpg",
      tarih: "2 gün önce",
      puan: 5,
      icerik: "Ahmet Bey'den çok memnun kaldım. Ürün tam olarak tarif edildiği gibiydi. Çok nazik ve güvenilir bir satıcı."
    },
    {
      id: 2,
      yazar: "Can Demir",
      avatar: "/yorumcu2.jpg",
      tarih: "1 hafta önce",
      puan: 4,
      icerik: "Ürün iyi durumdaydı ancak teslimat biraz gecikti. Yine de iletişim kurarken çok kibardı."
    }
  ]);

  // Ayarlar formu state
  const [ayarlarFormu, setAyarlarFormu] = useState({
    isim: profilBilgileri.isim,
    email: profilBilgileri.email,
    telefon: profilBilgileri.telefon,
    hakkimda: profilBilgileri.hakkimda
  });

  // Form değişikliklerini işle
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAyarlarFormu({
      ...ayarlarFormu,
      [name]: value
    });
  };

  // Form gönderimi
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Profil bilgilerini güncelle
    setProfilBilgileri({
      ...profilBilgileri,
      isim: ayarlarFormu.isim,
      email: ayarlarFormu.email,
      telefon: ayarlarFormu.telefon,
      hakkimda: ayarlarFormu.hakkimda
    });
    alert('Profil bilgileriniz güncellendi!');
  };

  // Placeholder görsel URL'si
  const placeholderImage = "https://via.placeholder.com/150?text=Profil+Görseli";

  // Görsel URL'sini işleyen fonksiyon
  const getImageUrl = (resimYolu) => {
    if (!resimYolu) return placeholderImage;
    return resimYolu;
  };

  // Yıldız puanlama oluşturma
  const renderYildizlar = (puan) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} style={{ color: i < puan ? '#ff9800' : '#ddd' }}>★</span>
    ));
  };

  return (
    <div className="profil-container">
      {/* Profil Başlık Alanı */}
      <div className="profil-header">
        <img 
          src={getImageUrl(profilBilgileri.avatar)} 
          alt="Profil" 
          className="profil-avatar" 
        />
        <h1 className="profil-isim">{profilBilgileri.isim}</h1>
        <div className="profil-konum">
          <i className="fas fa-map-marker-alt"></i> {profilBilgileri.konum}
        </div>
        <div className="profil-durum">{profilBilgileri.durum}</div>
        
        {/* İstatistikler */}
        <div className="profil-istatistikler">
          <div className="istatistik-kutu">
            <div className="istatistik-deger">{kullaniciIlanlari.length}</div>
            <div className="istatistik-baslik">İlan</div>
          </div>
          <div className="istatistik-kutu">
            <div className="istatistik-deger">{favoriIlanlar.length}</div>
            <div className="istatistik-baslik">Favori</div>
          </div>
          <div className="istatistik-kutu">
            <div className="istatistik-deger">{yorumlar.length}</div>
            <div className="istatistik-baslik">Yorum</div>
          </div>
          <div className="istatistik-kutu">
            <div className="istatistik-deger">4.5</div>
            <div className="istatistik-baslik">Puan</div>
          </div>
        </div>
        
        {/* İletişim Butonları */}
        <div className="profil-iletisim">
          <button className="iletisim-btn">
            <i className="fas fa-envelope"></i> Mesaj Gönder
          </button>
          <button className="iletisim-btn">
            <i className="fas fa-phone"></i> Ara
          </button>
        </div>
      </div>
      
      {/* Profil Sekmeleri */}
      <div className="profil-sekmeler">
        <button 
          className={`sekme-btn ${aktifSekme === 'hakkimda' ? 'aktif' : ''}`}
          onClick={() => setAktifSekme('hakkimda')}
        >
          Hakkında
        </button>
        <button 
          className={`sekme-btn ${aktifSekme === 'ilanlar' ? 'aktif' : ''}`}
          onClick={() => setAktifSekme('ilanlar')}
        >
          İlanlar ({kullaniciIlanlari.length})
        </button>
        <button 
          className={`sekme-btn ${aktifSekme === 'favoriler' ? 'aktif' : ''}`}
          onClick={() => setAktifSekme('favoriler')}
        >
          Favoriler ({favoriIlanlar.length})
        </button>
        <button 
          className={`sekme-btn ${aktifSekme === 'yorumlar' ? 'aktif' : ''}`}
          onClick={() => setAktifSekme('yorumlar')}
        >
          Yorumlar ({yorumlar.length})
        </button>
        <button 
          className={`sekme-btn ${aktifSekme === 'ayarlar' ? 'aktif' : ''}`}
          onClick={() => setAktifSekme('ayarlar')}
        >
          Ayarlar
        </button>
      </div>
      
      {/* Profil İçerik Alanı */}
      <div className="profil-icerik">
        {/* Hakkında Sekmesi */}
        {aktifSekme === 'hakkimda' && (
          <div className="hakkimda-sekme">
            <h2 className="hakkimda-baslik">Hakkımda</h2>
            <p className="hakkimda-icerik">{profilBilgileri.hakkimda}</p>
            
            <div className="hakkimda-detaylar">
              <div className="hakkimda-detay">
                <span className="hakkimda-icon">📱</span>
                <span className="hakkimda-text">{profilBilgileri.telefon}</span>
              </div>
              <div className="hakkimda-detay">
                <span className="hakkimda-icon">✉️</span>
                <span className="hakkimda-text">{profilBilgileri.email}</span>
              </div>
              <div className="hakkimda-detay">
                <span className="hakkimda-icon">📅</span>
                <span className="hakkimda-text">Üyelik Tarihi: {profilBilgileri.kayitTarihi}</span>
              </div>
              <div className="hakkimda-detay">
                <span className="hakkimda-icon">🎂</span>
                <span className="hakkimda-text">Doğum Tarihi: {profilBilgileri.dogumTarihi}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* İlanlar Sekmesi */}
        {aktifSekme === 'ilanlar' && (
          <div className="ilanlar-sekme">
            <h2 className="hakkimda-baslik">İlanlarım</h2>
            <div className="profil-ilanlar">
              {kullaniciIlanlari.map(ilan => (
                <div key={ilan.id} className="profil-ilan-karti">
                  <img 
                    src={getImageUrl(ilan.resim)} 
                    alt={ilan.baslik} 
                    className="profil-ilan-resim" 
                  />
                  <div className="profil-ilan-bilgi">
                    <h3 className="profil-ilan-baslik">{ilan.baslik}</h3>
                    <p className="profil-ilan-fiyat">{ilan.fiyat} TL</p>
                    <div className="profil-ilan-tarih">
                      <span>{ilan.tarih}</span>
                      <span>♥ {ilan.favori}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Favoriler Sekmesi */}
        {aktifSekme === 'favoriler' && (
          <div className="favoriler-sekme">
            <h2 className="hakkimda-baslik">Favori İlanlarım</h2>
            <div className="profil-favoriler">
              {favoriIlanlar.map(ilan => (
                <div key={ilan.id} className="profil-ilan-karti">
                  <img 
                    src={getImageUrl(ilan.resim)} 
                    alt={ilan.baslik} 
                    className="profil-ilan-resim" 
                  />
                  <div className="profil-ilan-bilgi">
                    <h3 className="profil-ilan-baslik">{ilan.baslik}</h3>
                    <p className="profil-ilan-fiyat">{ilan.fiyat} TL</p>
                    <div className="profil-ilan-tarih">
                      <span>Satıcı: {ilan.sahibi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Yorumlar Sekmesi */}
        {aktifSekme === 'yorumlar' && (
          <div className="yorumlar-sekme">
            <h2 className="hakkimda-baslik">Kullanıcı Yorumları</h2>
            <div className="yorum-listesi">
              {yorumlar.map(yorum => (
                <div key={yorum.id} className="yorum-karti">
                  <div className="yorum-ust">
                    <img 
                      src={getImageUrl(yorum.avatar)} 
                      alt={yorum.yazar} 
                      className="yorum-avatar" 
                    />
                    <div>
                      <h3 className="yorum-yazar">{yorum.yazar}</h3>
                      <p className="yorum-tarih">{yorum.tarih}</p>
                    </div>
                  </div>
                  <div className="yorum-puan">
                    {renderYildizlar(yorum.puan)}
                  </div>
                  <p className="yorum-icerik">{yorum.icerik}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Ayarlar Sekmesi */}
        {aktifSekme === 'ayarlar' && (
          <div className="ayarlar-sekme">
            <h2 className="hakkimda-baslik">Profil Ayarları</h2>
            <form className="ayarlar-formu" onSubmit={handleFormSubmit}>
              <div className="avatar-yukle">
                <img 
                  src={getImageUrl(profilBilgileri.avatar)} 
                  alt="Profil Önizleme" 
                  className="avatar-onizleme" 
                />
                <button type="button" className="avatar-sec-btn">
                  Fotoğraf Seç
                </button>
              </div>
              
              <div className="form-grup">
                <label className="form-etiket">Ad Soyad</label>
                <input
                  type="text"
                  className="form-input"
                  name="isim"
                  value={ayarlarFormu.isim}
                  onChange={handleFormChange}
                />
              </div>
              
              <div className="form-grup">
                <label className="form-etiket">Email</label>
                <input
                  type="email"
                  className="form-input"
                  name="email"
                  value={ayarlarFormu.email}
                  onChange={handleFormChange}
                />
              </div>
              
              <div className="form-grup">
                <label className="form-etiket">Telefon</label>
                <input
                  type="tel"
                  className="form-input"
                  name="telefon"
                  value={ayarlarFormu.telefon}
                  onChange={handleFormChange}
                />
              </div>
              
              <div className="form-grup">
                <label className="form-etiket">Hakkımda</label>
                <textarea
                  className="form-input form-textarea"
                  name="hakkimda"
                  value={ayarlarFormu.hakkimda}
                  onChange={handleFormChange}
                />
              </div>
              
              <button type="submit" className="form-buton">
                Bilgileri Güncelle
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profil;