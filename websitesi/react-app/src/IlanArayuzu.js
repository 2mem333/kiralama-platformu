import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import './ilanArayuzu.css';

//---------------------------JAVASCRPIPT KODLARI BAŞLANGIÇ--------------------------------
function IlanArayuzu() {
  const { ilanid } = useParams(); 
  const [ilan, ilanAyarla] = useState(null);
  const [yukleniyor, yuklemeAyarla] = useState(true);
  const [hata, hataAyarla] = useState(null);
  const [aktifResimIndex, aktifResimIndexAyarla] = useState(0);
  const [aktifSekme, sekmeAyarla] = useState('yorumlar');
  const [modalAcik, modalAcikAyarla] = useState(false);
  const [modalResimIndex, modalResimIndexAyarla] = useState(0);
  const [yeniYorum, yeniYorumAyarla] = useState('');

  const [_KULLANICIID, fKullaniciId] = useState(null);

  const navigate = useNavigate();
  class IlanYorumlari {
  constructor() {
    this.sahipid = 0;
    this.yorum = '';
    this.ilanid = 0;
    this.avatar = '';

    this.ad = '';
    this.soyad = '';
  }

  // Değer atamak için metot
  degerAta(alan, deger) {
    this[alan] = deger;
    return this;
  }

  // Kopyalama metodu (değişiklikleri yeni bir nesneye uygulamak için)
  kopyala() {
    const temp = new IlanYorumlari();
    Object.keys(this).forEach(anahtar => {
      temp[anahtar] = this[anahtar];
    });
    return temp;
  }

}
  const [_ILANYORUMLARI, fIlanYorumlari] = useState([]);
  const [_PROFILBILGILERI, fProfilBilgileri] = useState([]);

 const kullaniciadi_cek = async ({ kullaniciid }) => {
  try {
    const params = new URLSearchParams({ kullaniciid });
    const res = await fetch(`http://localhost:5000/api/profiller?${params}`);
    if (!res.ok) throw new Error('API yanıtı başarısız');

    const [data] = await res.json(); // data artık ilk obje
    return `${data.ad} ${data.soyad}`;

  } catch (err) {
    console.error(err);
    return null; // hata durumunda null döndür
  }
};

const avatarurl_cek = async ({ kullaniciid }) => {
  try {
    const params = new URLSearchParams({ kullaniciid });
    const res = await fetch(`http://localhost:5000/api/profil?${params}`);
    if (!res.ok) throw new Error('API yanıtı başarısız');

    const [data] = await res.json(); // data artık ilk obje
    return data.avatar; // doğrudan avatar'ı döndür

  } catch (err) {
    console.error(err);
    return null; // hata durumunda null döndür
  }
};

const yorum_ekle = async (e) => {
  if(!_KULLANICIID)
    navigate("/giris");
try { //SERVER ILE HABERLESME
      const yanit = await fetch('http://localhost:5000/api/ilanyorumlari', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sahipid: _KULLANICIID, yorum: yeniYorum, ilanid: ilanid }),
      });
      
      if (yanit.status === 200) {
     alert('yorum eklendi');
      } else{
     alert('hata');
      }
    } catch (hata) {
   alert('hata');
    }
};

  useEffect(() => {
      const tokenKontrol = async() =>{
const token = localStorage.getItem('token');
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    fKullaniciId(payload.kullaniciid);
  } catch (error) {
    console.error('Token parsing error:', error);
    // Token bozuksa temizleyebilirsin
    localStorage.removeItem('token');
  }
}
    }; tokenKontrol();

  const ilanyorumlarini_cek = async () => {
    try {
      const params = new URLSearchParams({ limit: '15', ilanid: ilanid });
      const res = await fetch(`http://localhost:5000/api/ilanyorumlari?${params}`);
      if (!res.ok) throw new Error('API yanıtı başarısız');

      const dataArray = await res.json();

      // Her bir öğe için avatarları paralel olarak al
      const IlanYorumlariArray = await Promise.all(
        dataArray.map(async item => {
          const avatar = await avatarurl_cek({ kullaniciid: item.sahipid });
          const ad = await kullaniciadi_cek({ kullaniciid: item.sahipid });
          return new IlanYorumlari()
            .degerAta('yorum', item.yorum)
            .degerAta('sahipid', item.sahipid)
            .degerAta('avatar', avatar)
            .degerAta('ad', ad);
        })
      );

      fIlanYorumlari(IlanYorumlariArray);
    } catch (err) {
      console.error(err);
    }
  };

  ilanyorumlarini_cek();
}, [ilanid]);

  // GELİŞMİŞ RESİM PARSİNG FONKSİYONU
  const resimleriAyikla = (resimDizgisi) => {
    try {
      if (!resimDizgisi) return []; // Boş string kontrolü eklendi
      
      // 1. Tüm gereksiz karakterleri temizle
      const temizDizgi = resimDizgisi
        .replace(/^[\s"{]+/g, '')  // Baştaki {, ", boşluk
        .replace(/[\s"}]+$/g, '')   // Sondaki }, ", boşluk
        .replace(/\\/g, '')        // Ters slash'ları kaldır
        .replace(/"/g, '');        // Kalan tırnakları temizle

      // 2. URL'leri virgülle ayır ve geçerli olanları filtrele
      return temizDizgi.split(',')
        .map(adres => adres.trim())
        .filter(adres => {
          if (!adres) return false; // Boş URL kontrolü eklendi
          try {
            new URL(adres);
            return true;
          } catch {
            return false;
          }
        });
    } catch (e) {
      console.error('Resim parse hatası:', e);
      return [];
    }
  };
  
  // Resmi tam ekran gösteren modal
  const ResimModal = ({ resimler, baslangicIndex, kapat }) => {
    const [aktifIndex, aktifIndexAyarla] = useState(baslangicIndex);

    // Resimler dizisi kontrolü eklendi
    if (!resimler || resimler.length === 0) return null;

    const sonrakiResim = () => {
      aktifIndexAyarla(onceki => (onceki + 1) % resimler.length);
    };

    const oncekiResim = () => {
      aktifIndexAyarla(onceki => 
        onceki === 0 ? resimler.length - 1 : onceki - 1
      );
    };

    return (
      <div className="resim-modal" onClick={kapat}>
        <div className="modal-icerik" onClick={e => e.stopPropagation()}>
          <span className="modal-kapat" onClick={kapat}>&times;</span>
          <img 
            src={resimler[aktifIndex]} 
            alt={`Tam ekran görüntü ${aktifIndex + 1}`} 
          />
          {resimler.length > 1 && (
            <>
              <button className="modal-ok sol" onClick={oncekiResim}>&lt;</button>
              <button className="modal-ok sag" onClick={sonrakiResim}>&gt;</button>
              <div className="modal-sayaci">
                {aktifIndex + 1}/{resimler.length}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const ilaniGetir = async () => {
      try {
  yuklemeAyarla(true);
        const yanit = await fetch(`http://localhost:5000/api/ilanlar?ilanid=${ilanid}`);
        
        if (!yanit.ok) throw new Error(`HTTP hata! durum kodu: ${yanit.status}`);
        
        const hamVeri = await yanit.text();
        console.log('Ham API Yanıtı:', hamVeri);
        
        // Boş yanıt kontrolü eklendi
        if (!hamVeri || hamVeri.trim() === '') {
          throw new Error('API boş veri döndürdü');
        }
        
        const veri = JSON.parse(hamVeri);
        console.log('Parse Edilmiş Veri:', veri);

        if (!veri || veri.length === 0) {
          throw new Error('İlan bulunamadı');
        }

        const duzenlenmisVeri = veri.map(oge => ({
          ...oge,
          resimler: oge.resim ? resimleriAyikla(oge.resim) : []
        }));

        console.log('Formatlanmış Resimler:', duzenlenmisVeri[0]?.resimler);
        ilanAyarla(duzenlenmisVeri[0]);
        hataAyarla(null);
      } catch (err) {
        console.error('Hata:', err);
        hataAyarla(`Veri yüklenemedi: ${err.message}`);
        ilanAyarla(null);
      } finally {
  yuklemeAyarla(false);
      }
    };
    
    ilaniGetir();
  }, [ilanid]);

  const resimHataYakala = (e) => {
    console.error('Resim yükleme hatası:', e.target.src);
    e.target.style.display = 'none';
  };

  // Resim değiştirme fonksiyonları
  const sonrakiResim = () => {
    if (!ilan?.resimler || ilan.resimler.length === 0) return;
    aktifResimIndexAyarla(onceki => (onceki + 1) % ilan.resimler.length);
  };

  const oncekiResim = () => {
    if (!ilan?.resimler || ilan.resimler.length === 0) return;
    aktifResimIndexAyarla(onceki => 
      onceki === 0 ? ilan.resimler.length - 1 : onceki - 1
    );
  };

  // Tab değiştirme fonksiyonu
  const sekmeDegistir = (tab) => {
    sekmeAyarla(tab);
  };


// Fiyat hesaplama fonksiyonu
const fiyatHesapla = (tip) => {
  if (!ilan || !ilan.fiyat) return 'Fiyat belirtilmemiş';
  
  const gunlukFiyat = parseFloat(ilan.fiyat) || 0;
  
  switch(tip) {
    case 'gunluk':
      return `${gunlukFiyat.toLocaleString('tr-TR')} TL`;
    case 'haftalik':
      return `${(gunlukFiyat * 7).toLocaleString('tr-TR')} TL`;
    case 'aylik':
      return `${(gunlukFiyat * 30).toLocaleString('tr-TR')} TL`;
    default:
      return `${gunlukFiyat.toLocaleString('tr-TR')} TL`;
  }
};
    
  // Mesaj gönderme fonksiyonu
  const mesajGonder = (e) => {
    e.preventDefault();
    alert('Mesaj gönderildi!');
  };

  // Teklif verme fonksiyonu
  const teklifVer = (e) => {
    e.preventDefault();
    alert('Teklifiniz iletildi!');
  };

  // Yorum ekleme fonksiyonu
  const yorumEkle = (e) => {

    e.preventDefault();
    if (yeniYorum.trim() === '') {
      alert('Lütfen bir yorum yazınız!');
      return;
    }
    /*
    // Yeni yorumu ekle
    const yeniYorumObjesi = {
      id: yorumlar.length + 1,
      kullaniciAdi: 'Kullanıcı', // Gerçek uygulamada oturum açmış kullanıcı adı gelecek
      tarih: new Date().toLocaleDateString('tr-TR'),
      yorum: yeniYorum
    };
    
    yorumlarAyarla([...yorumlar, yeniYorumObjesi]);
    yeniYorumAyarla(''); // Yorum alanını temizle
    */

    // Gerçek uygulamada bu noktada API'a yorum gönderilir
  };

  
  if (yukleniyor) return <div className="yukleme">Yükleniyor...</div>;
  if (hata) return <div className="hata">{hata}</div>;
  if (!ilan) return <div className="hata">İlan bulunamadı.</div>;

//--------------------------JAVASCRIPT KODLARI BİTİŞ---------------------------------

//--------------------------- JSX BLOĞU BAŞLANGIÇ-----------------------------------------
  return (
    <div className="ilan-container">
      {/* Modal bileşeni - resimler varsa ve modalAcik true ise göster */}
      {modalAcik && ilan.resimler && ilan.resimler.length > 0 && (
        <ResimModal 
          resimler={ilan.resimler} 
          baslangicIndex={modalResimIndex}
          kapat={() => modalAcikAyarla(false)}
        />
      )}
      
      <div className="ilan-content">
        {/* Sol bölüm - resimler ve başlık */}
        <div className="ilan-left">
          <div className="ilan-header">
            <h1>{ilan.baslik}</h1>
          </div>

          {/* Resim galerisi */}
          <div className="resim-slider">
            {/* Sadece birden fazla resim varsa okları göster */}
            {ilan.resimler && ilan.resimler.length > 1 && (
              <button className="slider-ok sol" onClick={oncekiResim} aria-label="Önceki resim">&lt;</button>
            )}
            
            <div 
              className="resim-container" 
              onClick={() => {
                if (ilan.resimler && ilan.resimler.length > 0) {
                  modalResimIndexAyarla(aktifResimIndex);
                  modalAcikAyarla(true);
                }
              }}
            >
              {ilan.resimler && ilan.resimler.length > 0 ? (
                <>
                  <img 
                    src={ilan.resimler[aktifResimIndex]} 
                    alt={`${ilan.baslik} resim ${aktifResimIndex + 1}`} 
                    onError={resimHataYakala}
                  />
                  <div className="resim-sayaci">
                    {aktifResimIndex + 1}/{ilan.resimler.length}
                  </div>
                  <div className="buyutme-simgesi" aria-label="Resmi büyüt">
                    ⛶
                  </div>
                </>
              ) : (
                <div className="placeholder-image">Görsel Bulunamadı</div>
              )}
            </div>

            {/* Sadece birden fazla resim varsa okları göster */}
            {ilan.resimler && ilan.resimler.length > 1 && (
              <button className="slider-ok sag" onClick={sonrakiResim} aria-label="Sonraki resim">&gt;</button>
            )}
          </div>

          {/* Küçük resim önizlemeleri - en az 2 resim varsa göster */}
          {ilan.resimler && ilan.resimler.length > 1 && (
            <div className="kucuk-resimler-container">
              <div className="kucuk-resimler">
                {ilan.resimler.map((resim, index) => (
                  <img
                    key={`thumb-${index}`}
                    src={resim}
                    alt={`Önizleme ${index + 1}`}
                    className={`kucuk-resim ${index === aktifResimIndex ? 'aktif' : ''}`}
                    onClick={() => aktifResimIndexAyarla(index)}
                    onError={resimHataYakala}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ bölüm - ilan detayları */}
        <div className="ilan-right">
          {/* İlan sahibi bilgileri */}
          <div className="ilan-owner">
            <div className="owner-avatar">
              {ilan.sahipResim ? (
                <img src={ilan.sahipResim} alt={`${ilan.sahip || 'İlan sahibi'} profil resmi`} onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `<div class="avatar-placeholder">${ilan.sahip ? ilan.sahip.charAt(0).toUpperCase() : '?'}</div>`;
                }} />
              ) : (
                <div className="avatar-placeholder">
                  {ilan.sahip ? ilan.sahip.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            <div className="owner-info">
              <h3>{ilan.sahip || 'İlan Sahibi'}</h3>
            </div>
          </div>

          {/* İlan açıklaması ve fiyat bilgileri */}
          <div className="ilan-details">
            <div className="detail-description">
              <p>{ilan.aciklama || 'Bu ilan için açıklama bulunmuyor.'}</p>
            </div>
            
    {/* Fiyat seçenekleri - Yeni Görünüm */}
    <div className="detail-price-options">
      <div className="price-types-display">
        <div className="price-type-item">
          <div className="price-type-label">Günlük</div>
          <div className="price-type-value">{fiyatHesapla('gunluk')}</div>
        </div>
        <div className="price-type-item">
          <div className="price-type-label">Haftalık</div>
          <div className="price-type-value">{fiyatHesapla('haftalik')}</div>
        </div>
        <div className="price-type-item">
          <div className="price-type-label">Aylık</div>
          <div className="price-type-value">{fiyatHesapla('aylik')}</div>
        </div>
      </div>
    </div>
  </div>

          {/* İşlem butonları */}
          <div className="ilan-actions">
            <button className="action-button message" onClick={mesajGonder}>
              Mesaj Gönder
            </button>
            <button className="action-button offer" onClick={teklifVer}>
              Teklif Ver
            </button>
          </div>
        </div>
      </div>

      {/* Tab sistemi */}
      <div className="ilan-tabs">
        <div 
          className={`tab ${aktifSekme === 'yorumlar' ? 'active' : ''}`}
          onClick={() => sekmeDegistir('yorumlar')}
        >
          Kullanıcı Yorumları
        </div>
      </div>

      {/* Tab içeriği */}
      <div className="tab-content">
        <div className="yorumlar-content">
          <h3>Kullanıcı Yorumları</h3>
          
          {/* Yorumlar listesi */}
          <div className="comments">
            {_ILANYORUMLARI.length > 0 ? (
              _ILANYORUMLARI.map((yorum) => (
                <div className="comment-item" key={`comment-${yorum.sahipid}`}>
                  <div className="comment-header">
                    <strong>{yorum.ad}</strong>
                    <span className="comment-date">{yorum.tarih}</span>
                  </div>
                  <div className="comment-text">
                    {yorum.yorum}
                  </div>
                </div>
              ))
            ) : (
              <p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
            )}
          </div>
          
          {/* Yorum form */}
          <div className="comment-form">
            <h4>Yorum Yap</h4>
            <form onSubmit={yorum_ekle}>
              <textarea 
                value={yeniYorum}
                onChange={(e) => yeniYorumAyarla(e.target.value)}
                placeholder="Yorumunuzu buraya yazın..."
                rows="4"
                required
              />
              <button type="submit" className="comment-submit">Yorum Gönder</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
//-------------------------JSX BLOĞU BİTİŞ--------------------------------
export default IlanArayuzu;