import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilSayfa.css';

//-----------------------JAVASCIPT KODLARI BASLANGIC---------------------------------------------------------------------------------------------------------

const Profil = () => {
  const navigate = useNavigate();
  const [aktifSekme, setAktifSekme] = useState('hakkimda');
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [yeniYorum, setYeniYorum] = useState('');
  const [yeniPuan, setYeniPuan] = useState(0);
  const [geciciPuan, setGeciciPuan] = useState(0);
  const [cevaplananYorumId, setCevaplananYorumId] = useState(null);
  const [yorumCevabi, setYorumCevabi] = useState('');

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
  const [kullaniciIlanlari, setKullaniciIlanlari] = useState([
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
  const [favoriIlanlar, setFavoriIlanlar] = useState([
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
  const [yorumlar, setYorumlar] = useState([
    {
      id: 1,
      yazar: "Zeynep Ak",
      avatar: "/yorumcu1.jpg",
      tarih: "2 gün önce",
      puan: 5,
      icerik: "Ahmet Bey'den çok memnun kaldım. Ürün tam olarak tarif edildiği gibiydi. Çok nazik ve güvenilir bir satıcı.",
      cevaplar: []
    },
    {
      id: 2,
      yazar: "Can Demir",
      avatar: "/yorumcu2.jpg",
      tarih: "1 hafta önce",
      puan: 4,
      icerik: "Ürün iyi durumdaydı ancak teslimat biraz gecikti. Yine de iletişim kurarken çok kibardı.",
      cevaplar: []
    }
  ]);

    // Ortalama puan hesaplama
  const ortalamaPuan = yorumlar.length > 0 
    ? (yorumlar.reduce((toplam, yorum) => toplam + yorum.puan, 0) / yorumlar.length).toFixed(1)
    : 0;

  // Ayarlar formu state'i güncellendi
  const [ayarlarFormu, setAyarlarFormu] = useState({
    isim: profilBilgileri.isim,
    email: profilBilgileri.email,
    telefon: profilBilgileri.telefon,
    hakkimda: profilBilgileri.hakkimda,
    mevcutSifre: '',
    yeniSifre: '',
    yeniSifreTekrar: ''
  });

  // Form gönderimi güncellendi
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Şifre değişiklik kontrolü
    if (ayarlarFormu.yeniSifre || ayarlarFormu.mevcutSifre) {
      if (ayarlarFormu.yeniSifre !== ayarlarFormu.yeniSifreTekrar) {
        alert('Yeni şifreler eşleşmiyor!');
        return;
      }
      // Burada genellikle API çağrısı yapılır
      alert('Şifre başarıyla güncellendi!');
    }

    // Profil bilgilerini güncelle
    setProfilBilgileri({
      ...profilBilgileri,
      isim: ayarlarFormu.isim,
      email: ayarlarFormu.email,
      telefon: ayarlarFormu.telefon,
      hakkimda: ayarlarFormu.hakkimda
    });

    // Formu sıfırla
    setAyarlarFormu({
      ...ayarlarFormu,
      mevcutSifre: '',
      yeniSifre: '',
      yeniSifreTekrar: ''
    });

    alert('Profil bilgileriniz güncellendi!');
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

  // Dosya seçme işlemi
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Önizleme için URL oluştur
      const imageUrl = URL.createObjectURL(file);
      setProfilBilgileri({
        ...profilBilgileri,
        avatar: imageUrl
      });
    }
  };

  // Profil fotoğrafını kaldırma işlemi
  const handleRemoveAvatar = () => {
    setProfilBilgileri({
      ...profilBilgileri,
      avatar: "/profil-avatar.jpg" // Varsayılan avatar görseline geri dön
    });
  };

  // Yeni yorum ekleme işlemi
  const handleYorumEkle = (e) => {
    e.preventDefault();
    if (yeniYorum.trim() === '' || yeniPuan === 0) {
      alert('Lütfen bir yorum yazın ve puan verin!');
      return;
    }

    const yeniYorumObj = {
      id: yorumlar.length + 1,
      yazar: "Mevcut Kullanıcı",
      avatar: "/mevcut-kullanici.jpg",
      tarih: "Şimdi",
      puan: yeniPuan,
      icerik: yeniYorum,
      cevaplar: []
    };

    setYorumlar([...yorumlar, yeniYorumObj]);
    setYeniYorum('');
    setYeniPuan(0);
    setGeciciPuan(0);
    alert('Yorumunuz başarıyla eklendi!');
  };

  // Yorum cevaplama işlemi
  const handleYorumCevap = (yorumId) => {
    if (cevaplananYorumId === yorumId) {
      setCevaplananYorumId(null);
      setYorumCevabi('');
    } else {
      setCevaplananYorumId(yorumId);
      setYorumCevabi('');
    }
  };

  // Yorum cevabı gönderme
  const handleCevapGonder = (yorumId, e) => {
    e.preventDefault();
    if (!yorumCevabi.trim()) {
      alert('Lütfen cevap metni girin!');
      return;
    }

    const guncellenmisYorumlar = yorumlar.map(yorum => {
      if (yorum.id === yorumId) {
        return {
          ...yorum,
          cevaplar: [
            ...yorum.cevaplar,
            {
              id: yorum.cevaplar.length + 1,
              yazar: profilBilgileri.isim,
              avatar: profilBilgileri.avatar,
              tarih: "Şimdi",
              icerik: yorumCevabi
            }
          ]
        };
      }
      return yorum;
    });

    setYorumlar(guncellenmisYorumlar);
    setYorumCevabi('');
    setCevaplananYorumId(null);
    alert('Cevabınız gönderildi!');
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
    const guncellenmisIlanlar = kullaniciIlanlari.map(ilan => {
      if (ilan.id === duzenlenenIlan.id) {
        return {
          ...ilan,
          baslik: ilanBaslik,
          fiyat: ilanFiyat
        };
      }
      return ilan;
    });

    setKullaniciIlanlari(guncellenmisIlanlar);
    setDuzenlenenIlan(null);
    setIlanBaslik('');
    setIlanFiyat('');
    alert('İlan başarıyla güncellendi!');
  };

  // İlan silme
  const handleIlanSil = (ilanId) => {
    if (window.confirm('Bu ilanı silmek istediğinize emin misiniz?')) {
      setKullaniciIlanlari(kullaniciIlanlari.filter(ilan => ilan.id !== ilanId));
      alert('İlan başarıyla silindi!');
    }
  };

  // Yıldız puanlama oluşturma
  const renderYildizlar = (puan, interactive = false, onHover = null, onClick = null) => {
    return Array(5).fill(0).map((_, i) => (
      <span 
        key={i} 
        style={{ color: i < puan ? '#ff9800' : '#ddd', cursor: interactive ? 'pointer' : 'default' }}
        onMouseEnter={interactive ? () => onHover(i + 1) : null}
        onMouseLeave={interactive ? () => onHover(yeniPuan) : null}
        onClick={interactive ? () => onClick(i + 1) : null}
      >
        ★
      </span>
    ));
  };

  // Placeholder görsel URL'si
  const placeholderImage = "https://via.placeholder.com/150?text=Profil+Görseli";

  // Görsel URL'sini işleyen fonksiyon
  const getImageUrl = (resimYolu) => {
    if (!resimYolu) return placeholderImage;
    return resimYolu;
  };

  // Ana sayfaya dönme fonksiyonu
  const handleAnaSayfayaDon = () => {
    navigate('/');
  };

//-----------------------JAVASCIPT KODLARI BITIS---------------------------------------------------------------------------------------------------------  

//-----------------------JSX BLOGU BASLANGIC--------------------------------------------------------------------------------------------------------

  return (
    <div className="profil-container">
      {/* Ana sayfaya dön butonu */}
      <button 
        className="ana-sayfa-btn"
        onClick={handleAnaSayfayaDon}
      >
        <i className="fas fa-home"></i> 🏠︎
      </button>
      
      {/* Profil Başlık Alanı */}
      <div className="profil-header">
        <img 
          src={getImageUrl(profilBilgileri.avatar)}  
          className="profil-avatar" 
          alt="Profil Avatar"
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
            <div className="istatistik-deger">{ortalamaPuan}</div>
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
                  {duzenlenenIlan && duzenlenenIlan.id === ilan.id ? (
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
                          <label>Fiyat (TL)</label>
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
                        <div className="profil-ilan-aksiyonlar">
                          <button 
                            className="ilan-duzenle-btn"
                            onClick={() => handleIlanDuzenle(ilan)}
                          >
                            Düzenle
                          </button>
                          <button 
                            className="ilan-sil-btn"
                            onClick={() => handleIlanSil(ilan.id)}
                          >
                            Sil
                          </button>
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
                    <p className="profil-ilan-fiyat">{ilan.fiyat} TL</p>
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
                  </div>
                  <p className="yorum-icerik">{yorum.icerik}</p>
                  
                  {/* Yorum cevapları */}
                    {yorum.cevaplar.length > 0 && (
                      <div className="yorum-cevaplari">
                        {yorum.cevaplar.map(cevap => (
                          <div key={cevap.id} className="yorum-cevap">
                            <div className="yorum-ust">
                              <img 
                                src={getImageUrl(cevap.avatar)} 
                                alt={cevap.yazar} 
                                className="yorum-avatar" 
                              />
                              <div>
                                <h3 className="yorum-yazar">{cevap.yazar}</h3>
                                <p className="yorum-tarih">{cevap.tarih}</p>
                              </div>
                            </div>
                            <p className="yorum-icerik">{cevap.icerik}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  
                  {/* Yorum cevaplama alanı */}
                  <button 
                    className="yorum-cevapla-btn"
                    onClick={() => handleYorumCevap(yorum.id)}
                  >
                    {cevaplananYorumId === yorum.id ? 'Cevaplamayı İptal Et' : 'Cevapla'}
                  </button>
                  
                  {cevaplananYorumId === yorum.id && (
                    <form 
                      className="yorum-cevap-formu"
                      onSubmit={(e) => handleCevapGonder(yorum.id, e)}
                    >
                      <textarea
                        placeholder="Cevabınızı buraya yazın..."
                        value={yorumCevabi}
                        onChange={(e) => setYorumCevabi(e.target.value)}
                        required
                      />
                      <button type="submit" className="cevap-gonder-btn">
                        Gönder
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>

            {/* Yeni Yorum Ekleme Formu */}
            <div className="yeni-yorum-formu">
              <h3>Yorum Yap</h3>
              <form onSubmit={handleYorumEkle}>
                <div className="puanlama-alani">
                  <label>Puan:</label>
                  <div className="yildiz-puanlama">
                    {renderYildizlar(
                      geciciPuan || yeniPuan, 
                      true, 
                      (puan) => setGeciciPuan(puan),
                      (puan) => setYeniPuan(puan)
                    )}
                    <span className="puan-deger">{geciciPuan || yeniPuan || 0}/5</span>
                  </div>
                </div>
                <textarea
                  className="yorum-textarea"
                  placeholder="Yorumunuzu buraya yazın..."
                  value={yeniYorum}
                  onChange={(e) => setYeniYorum(e.target.value)}
                />
                <button type="submit" className="yorum-gonder-btn">
                  Yorumu Gönder
                </button>
              </form>
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
    </div>
  );
};

//-----------------------JSX BLOGU BITIS------------------------------------------------------------------------------------------------------------

export default Profil;