import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import UstCubukProfil from './UstCubukProfil';
import { useNavigate } from 'react-router-dom';

const Profil = () => {
  const { kullaniciid } = useParams();
  const [aktifSekme, setAktifSekme] = useState('hakkimda');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [cevaplananYorumId, setCevaplananYorumId] = useState(null);
  const [yorumCevabi, setYorumCevabi] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  class KullaniciBilgileri {
  constructor() {
    this.email = '';
    this.ad = '';
    this.soyad = '';
    this.dogumTarihi = '';
    this.telefonNumarasi = '';
    this.adres = '';
    this.postaKodu = '';
    this.avatar = '';
  }

  // Değer atamak için metot
  degerAta(alan, deger) {
    this[alan] = deger;
    return this;
  }

  // Kopyalama metodu (değişiklikleri yeni bir nesneye uygulamak için)
  kopyala() {
    const yeniKullanici = new KullaniciBilgileri();
    Object.keys(this).forEach(anahtar => {
      yeniKullanici[anahtar] = this[anahtar];
    });
    return yeniKullanici;
  }

}

class Profil {
  constructor() {
    this.avatar = '';
    this.hakkinda = '';
  }

  // Değer atamak için metot
  degerAta(alan, deger) {
    this[alan] = deger;
    return this;
  }

  // Kopyalama metodu (değişiklikleri yeni bir nesneye uygulamak için)
  kopyala() {
    const profil = new Profil();
    Object.keys(this).forEach(anahtar => {
      profil[anahtar] = this[anahtar];
    });
    return profil;
  }

}

class Degerlendirmeler {
  constructor() {
    this.yorumMetni = '';
    this.degerlendirenId = '';
    this.puan = 0.0;
  }

  // Değer atamak için metot
  degerAta(alan, deger) {
    this[alan] = deger;
    return this;
  }

  // Kopyalama metodu (değişiklikleri yeni bir nesneye uygulamak için)
  kopyala() {
    const temp = new Degerlendirmeler();
    Object.keys(this).forEach(anahtar => {
      temp[anahtar] = this[anahtar];
    });
    return temp;
  }

}

class Ilanlar {
  constructor() {
    this.ilanAdi = '';
    this.gunlukFiyat = '';
    this.ilanResim = '';
    this.ilanId = 0;
  }

  // Değer atamak için metot
  degerAta(alan, deger) {
    this[alan] = deger;
    return this;
  }

  // Kopyalama metodu (değişiklikleri yeni bir nesneye uygulamak için)
  kopyala() {
    const temp = new Ilanlar();
    Object.keys(this).forEach(anahtar => {
      temp[anahtar] = this[anahtar];
    });
    return temp;
  }
}

  
  // Veritabanı state'leri
  const [kullanici, setKullanici] = useState({
    isim: '',
    email: '',
    telefon: '',
    hakkimda: '',
    avatar: '',
    konum: '',
    kayitTarihi: '',
    dogumTarihi: ''
  });

  const [ilanlar, setIlanlar] = useState([]);
  const [yorumlar, setYorumlar] = useState([]);
  const [profil, setProfil] = useState({});

  // Kullanıcının favori ilanları
    const [favoriIlanlar, setFavoriIlanlar] = useState([
      {
        id: 101,
        baslik: "Retro Koltuk Takımı",
        fiyat: "6800₺/ay",
        resim: "/retro-koltuk.jpg",
        sahibi: "Ayşe Demir"
      },
      {
        id: 102,
        baslik: "Ahşap Kitaplık",
        fiyat: "2300₺/ay",
        resim: "/ahsap-kitaplik.jpg",
        sahibi: "Mehmet Kaya"
      }
    ]);

  const [_KULLANICI, fKullanici] = useState(new KullaniciBilgileri()); //KULLANICI BURAYA CEKILIR
  const [_ILANLAR, fIlanlar] = useState([]);
  const [_DEGERLENDIRMELER, fDegerlendirmeler] = useState([]);
  const [_PROFIL, fProfil] = useState(new Profil());
  
  useEffect(() => {
      const fetchKullanici = async () => {
        try {
          const params = new URLSearchParams({ kullaniciid });
          const res = await fetch(`http://localhost:5000/api/profiller?${params}`);
          if (!res.ok) throw new Error('API yanıtı başarısız');
  
          const [data] = await res.json();
  
          // Yeni bir class örneği oluşturup, sadece ihtiyacımız olan alanları ata
          const yeniKullanici = new KullaniciBilgileri()
            .degerAta('email', data.eposta)
            .degerAta('ad', data.ad)
            .degerAta('soyad', data.soyad)
            .degerAta('dogumTarihi', data.dogumTarihi)
            .degerAta('telefonNumarasi', data.telefon)
            .degerAta('adres', data.adres)
            .degerAta('email', data.eposta);
  
          fKullanici(yeniKullanici);
        } catch (err) {
          console.error(err);
        } finally {
        }
      };
      fetchKullanici();
  
      const ilanlari_cek = async () => {
  
    try {
      const params = new URLSearchParams({ limit: '3', sahipid: kullaniciid });
      const res = await fetch(`http://localhost:5000/api/ilanlar?${params}`);
      if (!res.ok) throw new Error('API yanıtı başarısız');
  
      // 1) JSON dizisini al
      const dataArray = await res.json(); 
  
      // 2) Her bir objeyi Ilanlar sınıfına dönüştür
      const ilanlarArray = dataArray.map(item =>
        new Ilanlar()
          .degerAta('ilanAdi',     item.baslik)
          .degerAta('gunlukFiyat', item.fiyat)
          .degerAta('ilanId',      item.ilanid)
          .degerAta('ilanResim',   item.resim)
      );
  
      // 3) Tüm diziyi state’e ata
      fIlanlar(ilanlarArray);
    } catch (err) {
      console.error(err);
    }
      };
     ilanlari_cek();
  
     const degerlendirmeleri_cek = async() => {
      try {
      const params = new URLSearchParams({ limit: '15', degerlendirilen_id: kullaniciid });
      const res = await fetch(`http://localhost:5000/api/degerlendirmeler?${params}`);
      if (!res.ok) throw new Error('API yanıtı başarısız');
  
      // 1) JSON dizisini al
      const dataArray = await res.json(); 
  
      // 2) Her bir objeyi Ilanlar sınıfına dönüştür
      const DegerlendirmelerArray = dataArray.map(item =>
        new Degerlendirmeler()
          .degerAta('yorumMetni',     item.yorum)
          .degerAta('degerlendirenId', item.degerlendiren_id)
          .degerAta('puan',      item.puan)
      );
  
      // 3) Tüm diziyi state’e ata
      fDegerlendirmeler(DegerlendirmelerArray);
    } catch (err) {
      console.error(err);
    }
      };
     degerlendirmeleri_cek();
  
     const profili_cek = async() => {
       try {
          const params = new URLSearchParams({ sahipid: kullaniciid });
          const res = await fetch(`http://localhost:5000/api/profil?${params}`);
          if (!res.ok) throw new Error('API yanıtı başarısız');
  
          const [data] = await res.json();
  
          // Yeni bir class örneği oluşturup, sadece ihtiyacımız olan alanları ata
          const prof = new Profil()
            .degerAta('hakkinda', data.hakkinda)
            .degerAta('avatar', data.avatar)
  
          fProfil(prof);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
     }
     profili_cek();
  
    }, [kullaniciid]);

    // Ortalama puan hesaplama
  const ortalamaPuan = (yorumlar.length > 0)
  ? (yorumlar.reduce((toplam, d) => toplam + d.puan, 0) / yorumlar.length).toFixed(1)
  : "0.0";

  // Ayarlar formu state'i güncellendi
  const [ayarlarFormu, setAyarlarFormu] = useState({
    isim: kullanici.isim,
    email: kullanici.email,
    telefon: kullanici.telefon,
    hakkimda: kullanici.hakkimda,
    mevcutSifre: '',
    yeniSifre: '',
    yeniSifreTekrar: ''
  });

  // Form gönderimi güncellendi
  const handleFormSubmit = (e) => {
    e.preventDefault();
    let changes = {
      bilgilerDegisti: false,
      sifreDegisti: false
    };

    // Check for profile info changes
    if (ayarlarFormu.isim !== kullanici.isim || 
        ayarlarFormu.email !== kullanici.email || 
        ayarlarFormu.telefon !== kullanici.telefon || 
        ayarlarFormu.hakkimda !== kullanici.hakkimda) {
      changes.bilgilerDegisti = true;
    }

    // Check for password changes
    if (ayarlarFormu.yeniSifre || ayarlarFormu.mevcutSifre) {
      if (ayarlarFormu.yeniSifre !== ayarlarFormu.yeniSifreTekrar) {
        alert('Yeni şifreler eşleşmiyor!');
        return;
      }
      changes.sifreDegisti = true;
      alert('Şifre başarıyla güncellendi!');
    }

    // Apply changes
    if (changes.bilgilerDegisti) {
      setKullanici({
        ...kullanici,
        isim: ayarlarFormu.isim,
        email: ayarlarFormu.email,
        telefon: ayarlarFormu.telefon,
        hakkimda: ayarlarFormu.hakkimda
      });
    }

    setAyarlarFormu({
      ...ayarlarFormu,
      mevcutSifre: '',
      yeniSifre: '',
      yeniSifreTekrar: ''
    });

    if (changes.bilgilerDegisti || changes.sifreDegisti) {
      alert('Profil bilgileriniz güncellendi!');
    }
  };

  // Yeni ilan düzenleme state
  const [duzenlenenIlan, setDuzenlenenIlan] = useState(null);
  const [ilanBaslik, setIlanBaslik] = useState('');
  const [ilanFiyat, setIlanFiyat] = useState('');

  // Form değişikliklerini işle
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAyarlarFormu({
      ...ayarlarFormu,
      [name]: value
    });
  };

  const [sifreGoster, setSifreGoster] = useState({
    mevcutSifre: false,
    yeniSifre: false,
    yeniSifreTekrar: false
  });

  // Şifre görünürlüğünü değiştirme
  const toggleSifreGoster = (field) => {
    setSifreGoster(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Profil fotoğrafını kaldırma işlemi
  const handleRemoveAvatar = () => {
    setKullanici({
      ...kullanici,
      avatar: "/profil-avatar.jpg" // Varsayılan avatar görseline geri dön
    });
  };

  // Favori ilan kaldırma
  const handleFavoriKaldir = (ilanId) => {
    setFavoriIlanlar(favoriIlanlar.filter(ilan => ilan.id !== ilanId));
    alert('İlan favorilerinizden kaldırıldı!');
  };

  // Favori ilana mesaj gönderme
  const handleFavoriMesaj = (ilan) => {
    alert(`${ilan.sahibi} kullanıcısına "${ilan.baslik}" ilanı hakkında mesaj gönderilecek!`);
  };

  // İlan düzenleme başlatma
  const handleIlanDuzenle = (ilan) => {
    setDuzenlenenIlan(ilan);
    setIlanBaslik(ilan.baslik);
    setIlanFiyat(ilan.fiyat);
  };

  // İlan düzenleme iptal
  const handleIlanDuzenlemeIptal = () => {
    setDuzenlenenIlan(null);
    setIlanBaslik('');
    setIlanFiyat('');
  };

  // İlan güncelleme
  const handleIlanGuncelle = (e) => {
    e.preventDefault();
    const guncellenmisIlanlar = ilanlar.map(ilan => {
      if (ilan.id === duzenlenenIlan.id) {
        return {
          ...ilan,
          baslik: ilanBaslik,
          fiyat: ilanFiyat
        };
      }
      return ilan;
    });

    setIlanlar(guncellenmisIlanlar);
    setDuzenlenenIlan(null);
    setIlanBaslik('');
    setIlanFiyat('');
    alert('İlan başarıyla güncellendi!');
  };

  // İlan silme
  const handleIlanSil = (ilanId) => {
    if (window.confirm('Bu ilanı silmek istediğinize emin misiniz?')) {
      setIlanlar(ilanlar.filter(ilan => ilan.id !== ilanId));
      alert('İlan başarıyla silindi!');
    }
  };

  // Dosya seçme işlemi
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Önizleme için URL oluştur
      const imageUrl = URL.createObjectURL(file);
      setKullanici({
        ...kullanici,
        avatar: imageUrl
      });
    }
  };


  // Yıldız puanlama oluşturma
  const renderYildizlar = (puan) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} style={{ color: i < puan ? '#ff9800' : '#ddd' }}>★</span>
    ));
  };

  // Placeholder görsel URL'si
  const placeholderImage = ("https://via.placeholder.com/150?text=Profil+Görseli");

  // Görsel URL'sini işleyen fonksiyon
  const getImageUrl = (resimYolu) => {
    const placeholder = 'https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png';
    return resimYolu || placeholder;
  };

  // Ana sayfaya dönme fonksiyonu
  const handleAnaSayfayaDon = () => {
    navigate('/');
  };

  {error && (
    <div className="error-message">
      Hata: {error} 
      <button onClick={() => setError(null)}>×</button>
    </div>
  )}

  {loading && (
    <div className="loading-indicator">
      <div className="spinner"></div>
      Yükleniyor...
    </div>
  )}

//-----------------------JAVASCIPT KODLARI BITIS---------------------------------------------------------------------------------------------------------  

//-----------------------JSX BLOGU BASLANGIC--------------------------------------------------------------------------------------------------------

  return (
  <> 
    {loading && (
      <div className="loading">Yükleniyor...</div>
    )}
    {error && (
      <div className="error">{`Hata: ${error}`} 
        <button onClick={() => setError(null)}>×</button>
      </div>
    )}
    <UstCubukProfil/>
    <div className="profil-container">
      {/* Ana sayfaya dön butonu */}
      <button 
        className="ana-sayfa-btn"
        onClick={handleAnaSayfayaDon}
      >
        <span className="fas fa-home"></span> 🏠︎
      </button>
      
      {/* Profil Başlık Alanı */}
      <div className="profil-header">
        <img 
          src={getImageUrl(kullanici.avatar)}  
          className="profil-avatar" 
          alt="Profil Avatar"
        />
        <h1 className="profil-isim">{kullanici.isim}</h1>
        <div className="profil-konum">
          <i className="fas fa-map-marker-alt"></i> {kullanici.konum}
        </div>
        <div className="profil-durum">{kullanici.durum}</div>

        {/* İstatistikler */}
        <div className="profil-istatistikler">
          <div className="istatistik-kutu">
            <div className="istatistik-deger">{ilanlar.length}</div>
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
            <div className="istatistik-deger">{ortalamaPuan}</div>
            <div className="istatistik-baslik">Puan</div>
          </div>
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
          İlanlar ({ilanlar.length})
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
            <p className="hakkimda-icerik">{kullanici.hakkimda}</p>
            
            <div className="hakkimda-detaylar">
              <div className="hakkimda-detay">
                <span className="hakkimda-icon">📱</span>
                <span className="hakkimda-text">{kullanici.telefon}</span>
              </div>
              <div className="hakkimda-detay">
                <span className="hakkimda-icon">✉️</span>
                <span className="hakkimda-text">{kullanici.email}</span>
              </div>
              <div className="hakkimda-detay">
                <span className="hakkimda-icon">📅</span>
                <span className="hakkimda-text">Üyelik Tarihi: {kullanici.kayitTarihi}</span>
              </div>
              <div className="hakkimda-detay">
                <span className="hakkimda-icon">🎂</span>
                <span className="hakkimda-text">Doğum Tarihi: {kullanici.dogumTarihi}</span>
              </div>
            </div>
          </div>
        )}
        {/* İlanlar Sekmesi */}
        {aktifSekme === 'ilanlar' && (
          <div className="ilanlar-sekme">
            <h2 className="hakkimda-baslik">İlanlarım</h2>
            <button>
              Daha fazlasını görüntüle
            </button>
            <div className="profil-ilanlar">
              {_ILANLAR.map(ilanlar => (
                <div key={ilanlar.ilanId} className="profil-ilan-karti">
                  {duzenlenenIlan && duzenlenenIlan.ilanId === ilanlar.ilanId ? (
                    <div className="ilan-duzenleme-formu">
                      <form onSubmit={handleIlanGuncelle}>
                        <div className="form-grup">
                          <label>İlan Başlığı</label>
                          <input
                            type="text"
                            value={ilanBaslik}
                            onChange={(e) => setIlanBaslik(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-grup">
                          <label>Fiyat </label>
                          <input
                            type="number"
                            value={ilanFiyat}
                            onChange={(e) => setIlanFiyat(e.target.value)}
                            required
                          />
                        </div>
                        <div className="ilan-duzenleme-butonlar">
                          <button type="submit" className="duzenleme-kaydet-btn">
                            Kaydet
                          </button>
                          <button 
                            type="button" 
                            className="duzenleme-iptal-btn"
                            onClick={handleIlanDuzenlemeIptal}
                          >
                            İptal
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <>
                      <img 
                        src={getImageUrl(ilanlar.ilanResim)} 
                        alt={ilanlar.ilanAdi} 
                        className="profil-ilan-resim" 
                      />
                      <div className="profil-ilan-bilgi">
                        <h3 className="profil-ilan-baslik">{ilanlar.ilanAdi}</h3>
                        <p className="profil-ilan-fiyat">{ilanlar.gunlukFiyat} TL </p>
                        <div className="profil-ilan-tarih">
                          <span>121212</span>
                          <span>♥ 5</span>
                        </div>
                      </div>
                    </>
                  )}
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
                    <p className="profil-ilan-fiyat">{ilan.fiyat} </p>
                    <div className="profil-ilan-tarih">
                      <span>Satıcı: {ilan.sahibi}</span>
                    </div>
                    <div className="favori-ilan-aksiyonlar">
                      <button 
                        className="favori-mesaj-btn"
                        onClick={() => handleFavoriMesaj(ilan)}
                      >
                        Mesaj Gönder
                      </button>
                      <button 
                        className="favori-kaldir-btn"
                        onClick={() => handleFavoriKaldir(ilan.id)}
                      >
                        Favorilerden Kaldır
                      </button>
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
                  {/* Puan değerini sayısal olarak ekleyen kısım */}
                  <span className="puan-deger">
                    {Number(yorum.puan).toFixed(1)}/5.0
                  </span>
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
                  src={getImageUrl(kullanici.avatar)} 
                  alt="Profil Önizleme" 
                  className="avatar-onizleme" 
                />
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleFileSelect}
                />
                <button 
                  type="button" 
                  className="avatar-sec-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  Fotoğraf Seç
                </button>
                
                {/* Profil fotoğrafını kaldırma butonu */}
                <button 
                  type="button" 
                  className="avatar-kaldir-btn"
                  onClick={handleRemoveAvatar}
                >
                  Profil Fotoğrafını Kaldır
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
              <h3 className="sifre-degistir-baslik">Şifre Değiştir</h3>
            
            {/* Mevcut Şifre Alanı */}
            <div className="form-grup">
              <label className="form-etiket">Mevcut Şifre</label>
              <div className="sifre-input-wrapper">
                <input
                  type={sifreGoster.mevcutSifre ? 'text' : 'password'}
                  className="form-input"
                  name="mevcutSifre"
                  value={ayarlarFormu.mevcutSifre}
                  onChange={handleFormChange}
                />
                <button
                  type="button"
                  className="sifre-goster-btn"
                  onClick={() => toggleSifreGoster('mevcutSifre')}
                >
                  {sifreGoster.mevcutSifre ? 'Gizle' : 'Göster'}
                </button>
              </div>
            </div>

            {/* Yeni Şifre Alanı */}
            <div className="form-grup">
              <label className="form-etiket">Yeni Şifre</label>
              <div className="sifre-input-wrapper">
                <input
                  type={sifreGoster.yeniSifre ? 'text' : 'password'}
                  className="form-input"
                  name="yeniSifre"
                  value={ayarlarFormu.yeniSifre}
                  onChange={handleFormChange}
                />
                <button
                  type="button"
                  className="sifre-goster-btn"
                  onClick={() => toggleSifreGoster('yeniSifre')}
                >
                  {sifreGoster.yeniSifre ? 'Gizle' : 'Göster'}
                </button>
              </div>
            </div>

            {/* Yeni Şifre Tekrar Alanı */}
            <div className="form-grup">
              <label className="form-etiket">Yeni Şifre Tekrar</label>
              <div className="sifre-input-wrapper">
                <input
                  type={sifreGoster.yeniSifreTekrar ? 'text' : 'password'}
                  className="form-input"
                  name="yeniSifreTekrar"
                  value={ayarlarFormu.yeniSifreTekrar}
                  onChange={handleFormChange}
                />
                <button
                  type="button"
                  className="sifre-goster-btn"
                  onClick={() => toggleSifreGoster('yeniSifreTekrar')}
                >
                  {sifreGoster.yeniSifreTekrar ? 'Gizle' : 'Göster'}
                </button>
              </div>
            </div>


              <button type="submit" className="form-buton">
                Bilgileri Güncelle
              </button>
            </form>
          </div>
        )}
      </div>
       {/* Alt Bilgi */}
      <footer className="profile__footer">
        <div className="profile__footer-content">
          <div className="profile__user">
            <img src={kullanici.avatar} alt="Profil" className="profile__avatar-small" />
            <span>{kullanici.isim}</span>
          </div>
          <div className="profile__copyright">
            <span>Son Güncelleme: 25.04.2025</span>
            <span>© 2025 - Tüm Hakları Saklıdır</span>
          </div>
        </div>
      </footer>
    </div>
    </>
    
  );
};

//-----------------------JSX BLOGU BITIS------------------------------------------------------------------------------------------------------------

export default Profil;