import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import UstCubuk2 from './UstCubukProfil';
import { useNavigate } from 'react-router-dom';
import './Profiller.css';

//-----------------------------------JAVASCRIPT KODU BASLANGIC------------------------------------------------
function Profiller() {
const { kullaniciid } = useParams();
const [aktifSekme, setAktifSekme] = useState('hakkimda');
const [cevaplananYorumId, setCevaplananYorumId] = useState(null);
const fileInputRef = useRef(null);
const [selectedFile, setSelectedFile] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [yukleme, yuklenmeDurumunuAyarla] = useState(true);
const [hata,hatabelirleme] = useState(null);
const [yorumCevabi, setYorumCevabi] = useState('');
const [ilanlar, setIlanlar] = useState([]);
const [profil, setProfil] = useState({});
// Yeni ilan düzenleme state
const [duzenlenenIlan, setDuzenlenenIlan] = useState(null);
const [ilanBaslik, setIlanBaslik] = useState('');
const [ilanFiyat, setIlanFiyat] = useState('');
const navigate = useNavigate();
const [previewUrl, setPreviewUrl] = useState(null);
const [activeTab, setActiveTab] = useState('profil');

const [_TOKENKULLANICIID, fTokenKullaniciId] = useState(null); //sisteme giris yapmis tokende yazan kullanici id

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

const [yorumlar, setYorumlar] = useState(_DEGERLENDIRMELER);


  // Resim parse fonksiyonunu ekleyin
  const parseResimler = (resimString) => {
    try {
    // 1) Baş ve sondaki ters eğik çizgeleri ("\") ve fazladan tırnakları temizle
    const cleaned = resimString
      .replace(/\\+/g, '')         // bütün backslash'leri kaldır
      .replace(/^\{\s*"?|"?\s*\}$/g, '') // baştaki { ve sondaki } karakterlerini (ve etrafındaki tırnakları) çıkar

      // 2) Virgüle göre böl, fazladan tırnakları temizle
      return cleaned
        .split(',')
        .map(url => url.trim().replace(/^"|"$/g, ''))
        .filter(url => url.length > 0);
    } catch (e) {
      console.error('Resim parse hatası:', e);
      return [];
    }
  };


useEffect(() => {
  
  //kullanıcının sisteme giriş yapmışsa, id'si çekilir
      const tokenKontrol = async() =>{ 
const token = localStorage.getItem('token');
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    fTokenKullaniciId(payload.kullaniciid);
  } catch (error) {
    console.error('Token parsing error:', error);
    // Token bozuksa temizleyebilirsin
    localStorage.removeItem('token');
  }
}
    }; tokenKontrol();

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
          .degerAta('dogumtarihi', data.dogumtarihi)
          .degerAta('telefonNumarasi', data.telefon)
          .degerAta('adres', data.adres)

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

        const data = await res.json();

        const ilanlarArray = data.map(item => {
          // veritabanından gelen raw string'i diziye çevir
          const urls = item.resim ? parseResimler(item.resim) : [];
          // eğer hiç URL yoksa fallback olarak placeholder kullan
          const resimler = urls.length ? urls : [placeholderImage];

          return new Ilanlar()
            .degerAta('ilanAdi',   item.baslik)
            .degerAta('gunlukFiyat', item.fiyat)
            .degerAta('ilanId',     item.ilanid)
            .degerAta('ilanResim',  resimler);
        });

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


    const puanOrtalamasi = (_DEGERLENDIRMELER.length > 0)
  ? (_DEGERLENDIRMELER.reduce((toplam, d) => toplam + d.puan, 0) / _DEGERLENDIRMELER.length).toFixed(1)
  : "0.0";

   // Ayarlar formu state'i güncellendi
    const [ayarlarFormu, setAyarlarFormu] = useState({
      isim: _KULLANICI.isim,
      email: _KULLANICI.email,
      telefon: _KULLANICI.telefon,
      adres: _KULLANICI.adres,
      hakkimda: _KULLANICI.hakkimda,
      mevcutSifre: '',
      yeniSifre: '',
      yeniSifreTekrar: ''
    });

  // Form değişikliklerini işle
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAyarlarFormu({
      ...ayarlarFormu,
      [name]: value
    });
  };

  // Dosya seçme işlemi
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      // Hem önizleme hem de form state'i güncelle
      setPreviewUrl(reader.result);
      setAyarlarFormu(prev => ({
        ...prev,
        avatar: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Form gönderimi güncellendi
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Profil resmini güncelle
    if(previewUrl) {
      fProfil(prev => ({
        ...prev,
        avatar: previewUrl
      }));
      setPreviewUrl(null);
    }

    let changes = {
      bilgilerDegisti: false,
      sifreDegisti: false
    };

    // Check for profile info changes
    if (ayarlarFormu.isim !== _KULLANICI.ad || 
      ayarlarFormu.email !== _KULLANICI.email || 
      ayarlarFormu.telefon !== _KULLANICI.telefonNumarasi || 
      ayarlarFormu.adres !== _KULLANICI.adres || // Yeni eklenen kontrol
      ayarlarFormu.hakkimda !== _PROFIL.hakkinda) {
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
      fKullanici({
        ..._KULLANICI,
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
      setPreviewUrl(null);
      setAyarlarFormu(prev => ({
        ...prev,
        avatar: ''
      }));
      fProfil(prev => ({
        ...prev,
        avatar: '/varsayilan-avatar.jpg'
      }));
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

  // Placeholder görsel URL'si
  const placeholderImage = "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png";

  // Görsel URL'sini işleyen fonksiyon
  const getImageUrl = (resimler) => {
    if (!resimler || resimler.length === 0) return placeholderImage;
    return resimler[0]; // İlk resmi göster
  };

  // Yıldız puanlama oluşturma
  const renderYildizlar = (puan) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} style={{ color: i < puan ? '#ff9800' : '#ddd' }}>★</span>
    ));
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
//-----------------------------------JAVASCRIPT KODU BITIS------------------------------------------------

//----------------------------------JSX BLOGU BASLANGIC--------------------------------------
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
 <div className="profil-container">
      {/* Profil Başlık Alanı */}
      {/* Ana sayfaya dön butonu */}
      <button 
        className="ana-sayfa-btn"
        onClick={handleAnaSayfayaDon}
      >
        <span className="fas fa-home"></span> 🏠︎
      </button>
      <div className="profil-header">
        <img 
          src={_PROFIL.avatar.length < 5 ? placeholderImage : _PROFIL.avatar}  
          className="profil-avatar" 
          alt="Profil Avatar"
        />
        <h1 className="profil-isim">{_KULLANICI.ad}</h1>
        <div className="profil-konum">
          <i className="fas fa-map-marker-alt"></i> {_KULLANICI.adres}
        </div>
        <div className="profil-durum">{"DURUM"}</div>
        
        {/* İstatistikler */}
        <div className="profil-istatistikler">
          <div className="istatistik-kutu">
            <div className="istatistik-deger">{_ILANLAR.length}</div>
            <div className="istatistik-baslik">İlan</div>
          </div>
          {/* Sadece kendi profili görüntüleniyorsa Favori istatistiğini göster */}
          {_TOKENKULLANICIID === parseInt(kullaniciid) && (
            <div className="istatistik-kutu">
              <div className="istatistik-deger">{favoriIlanlar.length}</div>
              <div className="istatistik-baslik">Favori</div>
            </div>
          )}
          <div className="istatistik-kutu">
            <div className="istatistik-deger">{_DEGERLENDIRMELER.length}</div>
            <div className="istatistik-baslik">Yorum</div>
          </div>
          <div className="istatistik-kutu">
            <div className="istatistik-deger">{puanOrtalamasi}</div>
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
          İlanlar ({_ILANLAR.length})
        </button>
        <button 
          className={`sekme-btn ${aktifSekme === 'yorumlar' ? 'aktif' : ''}`}
          onClick={() => setAktifSekme('yorumlar')}
        >
          Yorumlar ({_DEGERLENDIRMELER.length})
        </button>
        {/* Sadece kendi profiline özel sekmeler */}
        {_TOKENKULLANICIID === parseInt(kullaniciid) && (
          <>
            <button 
              className={`sekme-btn ${aktifSekme === 'favoriler' ? 'aktif' : ''}`}
              onClick={() => setAktifSekme('favoriler')}
            >
              Favoriler
            </button>
            <button 
              className={`sekme-btn ${aktifSekme === 'ayarlar' ? 'aktif' : ''}`}
              onClick={() => setAktifSekme('ayarlar')}
            >
              Ayarlar
            </button>
          </>
        )}
      </div>
      
       {/* Profil İçerik Alanı */}
      <div className="profil-icerik">
        {/* Hakkında Sekmesi */}
        {aktifSekme === 'hakkimda' && (
          <div className="hakkimda-sekme">
            <h2 className="hakkimda-baslik">Hakkımda</h2>
            <p className="hakkimda-icerik">{_PROFIL.hakkinda}</p>

            <div className="hakkimda-detaylar">
              <div className="hakkimda-detay">
                <span className="hakkimda-icon">📱</span>
                <span className="hakkimda-text">{_KULLANICI.telefonNumarasi}</span>
              </div>
              <div className="hakkimda-detay">
                <span className="hakkimda-icon">✉️</span>
                <span className="hakkimda-text">{_KULLANICI.email}</span>
              </div>
              <div className="hakkimda-detay">
                <span className="hakkimda-icon">🎂</span>
                <span className="hakkimda-text">Doğum Tarihi: {_KULLANICI.dogumtarihi}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* İlanlar Sekmesi */}
        {aktifSekme === 'ilanlar' && (
        <div className="ilanlar-sekme">
          <div className="ilanlar-baslik-container">
            <h2 className="hakkimda-baslik">
              {_TOKENKULLANICIID === parseInt(kullaniciid) ? "İlanlarım" : "İlanlar"}
            </h2>
            {_TOKENKULLANICIID === parseInt(kullaniciid) && (
              <button 
                className="daha-fazla-btn"
                onClick={() => navigate(`/ilan-yonetimi/${kullaniciid}`)}
              >
                İlanları Yönet
              </button>
            )}
          </div>
            <div className="profil-ilanlar">
              {_ILANLAR.map(ilan => (
                <div key={ilan.ilanId} className="profil-ilan-karti">
                  {duzenlenenIlan && duzenlenenIlan.ilanId === ilan.ilanId ? (
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
                        className="profil-ilan-resim"
                        src={ilan.ilanResim[0]}
                        alt={ilan.ilanAdi}
                        onError={e => { e.target.onerror = null; e.target.src = placeholderImage; }}
                      />
                      <div className="profil-ilan-bilgi">
                        <h3 className="profil-ilan-baslik">{ilan.ilanAdi}</h3>
                        <p className="profil-ilan-fiyat">{ilan.gunlukFiyat} TL</p>
                        <div className="profil-ilan-tarih">
                          <span>İlan No: {ilan.ilanId}</span>
                          <span>♥ {ilan.favoriSayisi || 0}</span>
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
        {aktifSekme === 'favoriler' && _TOKENKULLANICIID === parseInt(kullaniciid) && (
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
              {_DEGERLENDIRMELER.map(yorum => (
                <div key={yorum.degerlendirenId} className="yorum-karti">
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
                <p className="yorum-icerik">{yorum.yorumMetni}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Ayarlar Sekmesi */}
        {aktifSekme === 'ayarlar' && _TOKENKULLANICIID === parseInt(kullaniciid) && (
        <div className="ayarlar-sekme">
          <h2 className="hakkimda-baslik">Profil Ayarları</h2>
          
          {/* Kaydırılabilir Tablar */}
          <div className="ayarlar-tabs">
            <button 
              className={`tab-btn ${activeTab === 'profil' ? 'active' : ''}`}
              onClick={() => setActiveTab('profil')}
            >
              Profil Bilgileri
            </button>
            <button 
              className={`tab-btn ${activeTab === 'sifre' ? 'active' : ''}`}
              onClick={() => setActiveTab('sifre')}
            >
              Şifre Değiştir
            </button>
          </div>

          <form className="ayarlar-formu" onSubmit={handleFormSubmit}>
            
            {/* Profil Bilgileri Alanı */}
            <div className={`form-section ${activeTab === 'profil' ? 'active' : ''}`}>
              <div className="avatar-yukle">
                <img 
                  src={previewUrl || getImageUrl(_PROFIL.avatar)} 
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
                <button 
                  type="button" 
                  className="avatar-kaldir-btn"
                  onClick={handleRemoveAvatar}
                >
                  Fotoğrafı Kaldır
                </button>
              </div>

              <div className="form-grup">
                <label className="form-etiket">Ad</label>
                <input
                  type="text"
                  className="form-input"
                  name="isim"
                  value={_KULLANICI.ad}
                  onChange={handleFormChange}
                />
              </div>

           <div className="form-grup">
                <label className="form-etiket">Soyad</label>
                <input
                  type="text"
                  className="form-input"
                  name="soyad"
                  value={_KULLANICI.soyad}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-grup">
                <label className="form-etiket">Email</label>
                <input
                  type="email"
                  className="form-input"
                  name="email"
                  value={_KULLANICI.email}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-grup">
                <label className="form-etiket">Telefon</label>
                <input
                  type="tel"
                  className="form-input"
                  name="telefon"
                  value={_KULLANICI.telefonNumarasi}
                  onChange={handleFormChange}
                />
              </div>

              {/* Yeni Eklenen Adres Alanı */}
              <div className="form-grup">
                <label className="form-etiket">Adres</label>
                <textarea
                  className="form-input"
                  name="adres"
                  value={_KULLANICI.adres}
                  onChange={handleFormChange}
                  rows="3"
                />
              </div>

              <div className="form-grup">
                <label className="form-etiket">Hakkımda</label>
                <textarea
                  className="form-input form-textarea"
                  name="hakkimda"
                  value={_PROFIL.hakkimda}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            {/* Şifre Değiştirme Alanı */}
            <div className={`form-section ${activeTab === 'sifre' ? 'active' : ''}`}>
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
            <img src={_PROFIL.avatar} alt="Profil" className="profile__avatar-small" />
            <span>{_PROFIL.isim}</span>
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
//----------------------------------JSX BLOGU BITIS--------------------------------------
export default Profiller;