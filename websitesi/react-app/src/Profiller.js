import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import UstCubuk2 from './UstCubukProfil';

//-----------------------------------JAVASCRIPT KODU BASLANGIC------------------------------------------------
function Profiller() {
const { kullaniciid } = useParams();
const [aktifSekme, setAktifSekme] = useState('hakkimda');
const fileInputRef = useRef(null);
const [selectedFile, setSelectedFile] = useState(null);

const [yukleme, yuklenmeDurumunuAyarla] = useState(true);
const [hata,hatabelirleme] = useState(null);

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
      }
   }
   profili_cek();

  }, [kullaniciid]);


  const [profilBilgileri, setProfilBilgileri] = useState({
    isim: "deneme",
    konum: "İstanbul, Türkiye",
    avatar: "/profil-avatar.jpg",
    durum: "Premium Üye",
    hakkimda: "10 yıldır ikinci el eşya alım satımı yapıyorum. Özellikle antika mobilyalara ilgim var. Satın aldığım ve sattığım ürünlerin kaliteli olmasına özen gösteririm.",
    telefon: "+90 555 123 45 67",
    email: "ahmet.yilmaz@example.com",
    kayitTarihi: "12.03.2018",
    dogumTarihi: "15.08.1985"
  });

  // Hakkında bilgileri state
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
      // avatar zaten handleFileSelect'te güncelleniyor
    });
    alert('Profil bilgileriniz güncellendi!');
  };

  // Profil fotoğrafını kaldırma işlemi
  const handleRemoveAvatar = () => {
    setProfilBilgileri({
      ...profilBilgileri,
      avatar: "/profil-avatar.jpg" // Varsayılan avatar görseline geri dön
    });
  };

  // Placeholder görsel URL'si
  const placeholderImage = "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png";

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

//-----------------------------------JAVASCRIPT KODU BITIS------------------------------------------------

//----------------------------------JSX BLOGU BASLANGIC--------------------------------------
return (
  <><UstCubuk2/>
 <div className="profil-container">
      {/* Profil Başlık Alanı */}
      <div className="profil-header">
        <img 
          src={getImageUrl(_PROFIL.avatar)}  
          className="profil-avatar" 
          alt="Profil Avatar"
        />
        <h1 className="profil-isim">{_KULLANICI.ad}</h1>
        <div className="profil-konum">
          <i className="fas fa-map-marker-alt"></i> {_KULLANICI.adres}
        </div>
        <div className="profil-durum">{profilBilgileri.durum}</div>
        
        {/* İstatistikler */}
        <div className="profil-istatistikler">
          <div className="istatistik-kutu">
            <div className="istatistik-deger">{_ILANLAR.length}</div>
            <div className="istatistik-baslik">İlan</div>
          </div>
          <div className="istatistik-kutu">
            <div className="istatistik-deger">{_DEGERLENDIRMELER.length}</div>
            <div className="istatistik-baslik">Yorum</div>
          </div>
          <div className="istatistik-kutu">
            <div className="istatistik-deger">PUANLAMA</div>
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
      </div>
      
      {/* Profil İçerik Alanı */}
      <div className="profil-icerik">
        {/* Hakkında Sekmesi */}
        {aktifSekme === 'hakkimda' && (
          <div className="hakkimda-sekme">
            <h2 className="hakkimda-baslik">Hakkımda</h2>
            <p className="hakkimda-icerik">{_PROFIL.hakkinda}</p>
          </div>
        )}
        
        {/* İlanlar Sekmesi */}
        {aktifSekme === 'ilanlar' && (
          <div className="ilanlar-sekme">
            <h2 className="hakkimda-baslik">İlanlarım</h2>
            <div className="profil-ilanlar">
              {_ILANLAR.map(ilan => (
                <div key={ilan.ilanId} className="profil-ilan-karti">
                  <img 
                    src={getImageUrl(ilan.ilanResim)} 
                    alt={ilan.ilanAdi} 
                    className="profil-ilan-resim" 
                  />
                  <div className="profil-ilan-bilgi">
                    <h3 className="profil-ilan-baslik">{ilan.ilanAdi}</h3>
                    <p className="profil-ilan-fiyat">{ilan.gunlukFiyat} TL</p>
                    <div className="profil-ilan-tarih">
                      <span>121212</span>
                      <span>♥ 5</span>
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
              {_DEGERLENDIRMELER.map(degerlendirme => (
                <div key={degerlendirme.degerlendirenId} className="yorum-karti">
                  <div className="yorum-ust">
                    <img 
                      src={"FOTO"} 
                      alt={"FOTO"} 
                      className="FOTO" 
                    />
                    <div>
                      <h3 className="yorum-yazar">YAZAR</h3>
                      <p className="yorum-tarih">TARIH</p>
                    </div>
                  </div>
                  <div className="yorum-puan">
                    {renderYildizlar(degerlendirme.puan)}
                  </div>
                  <p className="yorum-icerik">{degerlendirme.yorumMetni}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
      </>
  );
  
};
//----------------------------------JSX BLOGU BITIS--------------------------------------
export default Profiller;