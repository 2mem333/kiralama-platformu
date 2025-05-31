import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import './ilanolusturma.css';

//-----------------------JAVASCIPT KODLARI BASLANGIC---------------------------------------------------------------------------------------------------------
const IlanOlusturma = () => {
  const [_BASLIK, fBaslik] = useState('');
  const [_ACIKLAMA, fAciklama] = useState('');
  const [_KONUM, fKonum] = useState('');
  const [_GUNLUKFIYAT, fGunlukFiyat] = useState('');
  const [_HAFTALIKFIYAT, fHaftalikFiyat] = useState('');
  const [_AYLIKFIYAT, fAylikFiyat] = useState('');
  const [_URUNDURUMU, fUrunDurumu] = useState('');
  const [_URUNKATEGORISI, fUrunKategorisi] = useState('');
  const [_URUNFOTOGRAFLARI, fUrunFotograflari] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [_TOKENKULLANICIID, fTokenKullaniciId] = useState(null); //sisteme giris yapmis tokende yazan kullanici id

  const categories = [
    'Elektronik', 'Ev Eşyaları', 'Bahçe Aletleri', 'Spor Ekipmanları',
    'Müzik Aletleri', 'Kitaplar', 'Oyunlar', 'Diğer'
  ];
  const durumkategorileri = [
    'Sıfır ayarında', 'Yeni gibi', 'Az kullanılmış', 'Orta',
    'Biraz eski', 'Eski'
  ];

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
      localStorage.removeItem('token');
      navigate("/giris");
    }
  }
  else
  {
navigate("/giris");
  }
      }; tokenKontrol();
        },);
//--------------FIREBASE CONFIG---------------------- !BU CONGIF SERVER TARAFINA TASINMALIDIR, GUVENLIK AMACLI
  const firebaseConfig = {
    apiKey: "aynenkanzi",
    authDomain: "kiralama-platformu.firebaseapp.com",
    projectId: "kiralama-platformu",
    storageBucket: "kiralama-platformu.firebasestorage.app",
    messagingSenderId: "563750885569",
    appId: "1:563750885569:web:765c43ec92270130051c40"
  };
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  //---------------FOTOGRAF YUKLEME KODLARI--------------
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (_URUNFOTOGRAFLARI.length + files.length > 5) {
      setErrors({...errors, _URUNFOTOGRAFLARI: 'En fazla 5 fotoğraf yükleyebilirsiniz.'});
      return;
    }
    
    const new_URUNFOTOGRAFLARI = [..._URUNFOTOGRAFLARI];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        new_URUNFOTOGRAFLARI.push({
          file,
          preview: e.target.result,
          name: file.name
        });
        fUrunFotograflari([...new_URUNFOTOGRAFLARI]);
      };
      reader.readAsDataURL(file);
    });
    setErrors({...errors, _URUNFOTOGRAFLARI: null});
  };

  const removeImage = (index) => {
    const new_URUNFOTOGRAFLARI = [..._URUNFOTOGRAFLARI];
    new_URUNFOTOGRAFLARI.splice(index, 1);
    fUrunFotograflari(new_URUNFOTOGRAFLARI);
    setErrors({...errors, _URUNFOTOGRAFLARI: null});
  };

  //----------------ILAN BILGI FORMU DOGRULUK KONTROLU---------------
  const FormBilgileriKontrol = () => {
    const newErrors = {};
    
    if (!_BASLIK) newErrors._BASLIK = 'Başlık zorunludur';
    else if (_BASLIK.length > 80) newErrors._BASLIK = 'Başlık 80 karakteri geçemez';
    
    if (!_ACIKLAMA) newErrors._ACIKLAMA = 'Açıklama zorunludur';
    else if (_ACIKLAMA.length > 350) newErrors._ACIKLAMA = 'Açıklama 350 karakteri geçemez';
    
    if (!_KONUM) newErrors._KONUM = 'Konum zorunludur';
    
    if (!_GUNLUKFIYAT) newErrors._GUNLUKFIYAT = 'Günlük fiyat zorunludur';
    else if (isNaN(parseFloat(_GUNLUKFIYAT)) || parseFloat(_GUNLUKFIYAT) <= 0) 
      newErrors._GUNLUKFIYAT = 'Geçerli bir fiyat girin';
    
    if (_HAFTALIKFIYAT && (isNaN(parseFloat(_HAFTALIKFIYAT)) || parseFloat(_HAFTALIKFIYAT) <= 0))
      newErrors._HAFTALIKFIYAT = 'Geçerli bir fiyat girin';
    
    if (_AYLIKFIYAT && (isNaN(parseFloat(_AYLIKFIYAT)) || parseFloat(_AYLIKFIYAT) <= 0))
      newErrors._AYLIKFIYAT = 'Geçerli bir fiyat girin';
    
    if (_URUNFOTOGRAFLARI.length === 0) newErrors._URUNFOTOGRAFLARI = 'En az 1 fotoğraf yüklemelisiniz';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

//----------------ILAN YAYINLA BUTON AKSIYONLARI---------------
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (!FormBilgileriKontrol()) {
      return;
    }
    //--------ILAN FOTOGRAFLARINI YUKLER------------
    const imageUrls = await Promise.all(
        _URUNFOTOGRAFLARI.map(async (imgObj) => {
          const { file } = imgObj;
          // benzersiz isim: timestamp + orijinal isim
          const rastgeleId = Math.random().toString(36).substring(2, 10);
          const path = `uploads/${Date.now()}_${rastgeleId}`; //belki kullanici id'sini iceren bir path koyulabilir buraya.
          const ref = storageRef(storage, path);
          await uploadBytes(ref, file);
          const url = await getDownloadURL(ref);
          return url;
        })
      );
//-----------VERITABANINA GONDERILECEK PAKET-------------
    const paket = {
      baslik:    _BASLIK,
      fiyat:     _GUNLUKFIYAT,
      konum:     _KONUM,
      resim:     imageUrls,     
      durum:     _URUNDURUMU,
      aciklama:  _ACIKLAMA,
      sahipid: _TOKENKULLANICIID,
      tarih:     '2025-04-2026'
    };
//-----------------SERVER ILE HABERLESME (ARKA YUZ KODU)----------------
    try { 
      const yanit = await fetch('http://localhost:5000/api/ilanolustur', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paket)
      });
      
      if (yanit.status === 200) {
        console.log('Kayıt başarıyla oluşturuldu!');
      } else{
        const veri = await yanit.json();
        console.log(veri.message);
        alert(veri.message);
      }
    } catch (hata) {
      console.log('Sunucuya ulaşılamıyor!');
    }

    alert('İlan başarıyla oluşturuldu! (Simülasyon)');
    
    // Form başarıyla gönderildikten sonra alanları temizle
    fBaslik('');
    fAciklama('');
    fKonum('');
    fGunlukFiyat('');
    fHaftalikFiyat('');
    fAylikFiyat('');
    fUrunKategorisi('');
    fUrunFotograflari([]);
    setErrors({});
  };

//-----------------------JAVASCIPT KODLARI BİTİŞ----------------------------------------------------------------------------------------------------

//-----------------------JSX BLOGU BAŞLANGIÇ--------------------------------------------------------------------------------------------------------
  return (
    <div className="listing-form-container">
      <h1 className="form-_BASLIK">Yeni İlan Oluştur</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Başlık */}
        <div className="form-group">
          <label className="form-label">
            İlan Başlığı <span className="required-mark">*</span>
          </label>
          <input
            type="text"
            value={_BASLIK}
            onChange={(e) => fBaslik(e.target.value)}
            className="form-input"
            placeholder="Ürününüzü kısaca tanımlayın (maksimum 80 karakter)"
            maxLength={80}
          />
          <div className="char-counter">
            <span className="error-message">{errors._BASLIK}</span>
            <span className="char-count">{_BASLIK.length}/80</span>
          </div>
        </div>
        
        {/* Açıklama */}
        <div className="form-group">
          <label className="form-label">
            İlan Açıklaması <span className="required-mark">*</span>
          </label>
          <textarea
            value={_ACIKLAMA}
            onChange={(e) => fAciklama(e.target.value)}
            className="form-textarea"
            placeholder="Ürünü detaylı olarak açıklayın (maksimum 350 karakter)"
            rows={4}
            maxLength={350}
          ></textarea>
          <div className="char-counter">
            <span className="error-message">{errors._ACIKLAMA}</span>
            <span className="char-count">{_ACIKLAMA.length}/350</span>
          </div>
        </div>
        
        {/* Konum */}
        <div className="form-group">
          <label className="form-label">
            Konum <span className="required-mark">*</span>
          </label>
          <input
            type="text"
            value={_KONUM}
            onChange={(e) => fKonum(e.target.value)}
            className="form-input"
            placeholder="Ürünün konumu (örn: İstanbul, Kadıköy)"
          />
          <div className="error-message">{errors._KONUM}</div>
        </div>
        
        
        {/* Fiyatlandırma */}
        <div className="price-grid">
          <div className="form-group">
            <label className="form-label">
              Günlük Kira Bedeli (₺) <span className="required-mark">*</span>
            </label>
            <input
              type="number"
              value={_GUNLUKFIYAT}
              onChange={(e) => fGunlukFiyat(e.target.value)}
              min="0"
              step="0.01"
              className="form-input"
              placeholder="100"
            />
            <div className="error-message">{errors._GUNLUKFIYAT}</div>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Haftalık Kira Bedeli (₺) <span className="optional-mark">(Opsiyonel)</span>
            </label>
            <input
              type="number"
              value={_HAFTALIKFIYAT}
              onChange={(e) => fHaftalikFiyat(e.target.value)}
              min="0"
              step="0.01"
              className="form-input"
              placeholder="500"
            />
            <div className="error-message">{errors._HAFTALIKFIYAT}</div>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Aylık Kira Bedeli (₺) <span className="optional-mark">(Opsiyonel)</span>
            </label>
            <input
              type="number"
              value={_AYLIKFIYAT}
              onChange={(e) => fAylikFiyat(e.target.value)}
              min="0"
              step="0.01"
              className="form-input"
              placeholder="1500"
            />
            <div className="error-message">{errors._AYLIKFIYAT}</div>
          </div>
        </div>
        
        {/* Kategori */}
        <div className="form-group">
          <label className="form-label">
            Kategori <span className="optional-mark">(Opsiyonel)</span>
          </label>
          <select
            value={_URUNKATEGORISI}
            onChange={(e) => fUrunKategorisi(e.target.value)}
            className="form-select"
          >
            <option value="">-</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
       {/* Durum */}
                <div className="form-group">
          <label className="form-label">
            Durum <span className="optional-mark">(Opsiyonel)</span>
          </label>
          <select
            value={_URUNDURUMU}
            onChange={(e) => fUrunDurumu(e.target.value)}
            className="form-select"
          >
            <option value="">-</option>
            {durumkategorileri.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        

        {/* Fotoğraf Yükleme */}
        <div className="form-group">
          <label className="form-label">
            Fotoğraflar <span className="required-mark">*</span> <span className="optional-mark">(Maksimum 5 adet)</span>
          </label>
          
          <div 
            className="image-upload-container"
            onClick={() => document.getElementById('image-upload').click()}
          >
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            
            <button type="button" className="upload-button">Fotoğraf Seç</button>
            <p className="upload-help-text">JPEG, PNG veya GIF formatında en fazla 5 fotoğraf</p>
          </div>
          
          <div className="error-message">{errors._URUNFOTOGRAFLARI}</div>
          
          {_URUNFOTOGRAFLARI.length > 0 && (
            <div className="image-preview-grid">
              {_URUNFOTOGRAFLARI.map((img, index) => (
                <div key={index} className="image-preview-item">
                  <img
                    src={img.preview}
                    alt={`Önizleme ${index + 1}`}
                    className="preview-image"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="remove-image-button"
                  >
                    ×
                  </button>
                  <p className="image-name">{img.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Butonlar */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              if(window.confirm('Formu iptal etmek istediğinize emin misiniz?')) {
                fBaslik('');
                fAciklama('');
                fKonum('');
                fGunlukFiyat('');
                fHaftalikFiyat('');
                fAylikFiyat('');
                fUrunKategorisi('');
                fUrunFotograflari([]);
                setErrors({});
              }
            }}
          >
            İptal
          </button>
          <button
            type="submit"
            className="submit-button"
          >
            İlanı Yayınla
          </button>
        </div>
      </form>
    </div>
  );
}
//-----------------------JSX BLOGU BİTİŞ------------------------------------------------------------------------------------------------------------
export default IlanOlusturma;