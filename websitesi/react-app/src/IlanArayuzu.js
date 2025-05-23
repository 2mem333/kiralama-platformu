import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const fiyatInputRef = useRef(null);

  // Teklif modalı için state'ler
  const [teklifModalAcik, teklifModalAcikAyarla] = useState(false);
  const [baslangicTarihi, baslangicTarihiAyarla] = useState('');
  const [bitisTarihi, bitisTarihiAyarla] = useState('');
  const [teklifFiyati, teklifFiyatiAyarla] = useState('');
  const [teklifAdim, teklifAdimAyarla] = useState(1); // 1: Tarih seçimi, 2: Fiyat teklifi

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

useEffect(() => {
    if (teklifAdim === 2 && fiyatInputRef.current) {
      fiyatInputRef.current.focus();
      // dilersen mevcut metni seçmek için:
      fiyatInputRef.current.select();
    }
  }, [teklifAdim]);

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

  // Teklif Verme Modalı Bileşeni
  const TeklifModal = ({ kapat }) => {
    const gunlukFiyat = ilan?.fiyat ? parseFloat(ilan.fiyat) : 0;
    const [toplamGun, toplamGunAyarla] = useState(0);
    const [toplamFiyat, toplamFiyatAyarla] = useState(0);
    
    // Tarih kontrolü ve fiyat hesaplama
    useEffect(() => {
      if (baslangicTarihi && bitisTarihi) {
        const baslangic = new Date(baslangicTarihi);
        const bitis = new Date(bitisTarihi);
        
        // Geçerli tarih kontrolü
        if (baslangic > bitis) {
          alert('Bitiş tarihi başlangıç tarihinden önce olamaz!');
          bitisTarihiAyarla('');
          return;
        }
        
        // Gün sayısı hesaplama (ms -> gün)
        const fark = bitis - baslangic;
        const gunSayisi = Math.ceil(fark / (1000 * 60 * 60 * 24)) + 1; // Başlangıç günü dahil
        
        toplamGunAyarla(gunSayisi);
        // Eğer teklifFiyati girilmediyse otomatik fiyat hesapla
          // Hesaplanan toplam fiyat (gösterim için)
        const hesaplananFiyat = gunlukFiyat * gunSayisi;
        toplamFiyatAyarla(hesaplananFiyat);
        
       
      }
    }, [baslangicTarihi, bitisTarihi, teklifFiyati, gunlukFiyat]);
    
    // Teklif gönderme fonksiyonu
    const teklifGonder = async () => {
    const today = new Date();
    const baslangic = new Date(baslangicTarihi);
    const bitis = new Date(bitisTarihi);
      if (!baslangicTarihi || !bitisTarihi) {
        alert('Lütfen geçerli tarihler seçin!');
        return;
      }
      
      if (!teklifFiyati || parseFloat(teklifFiyati) <= 0) {
        alert('Lütfen geçerli bir teklif fiyatı girin!');
        return;
      }
      
      if (!_KULLANICIID) {
        alert('Teklif vermek için giriş yapmanız gerekiyor!');
        navigate('/giris');
        return;
      }
      
      try {
        // Burada gerçek API'ye teklif gönderme işlemini yapabilirsiniz
        // Örnek:
        
        const yanit = await fetch('http://localhost:5000/api/teklifler', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ilanid: ilanid,
            kullaniciid: _KULLANICIID,
            baslangic_tarihi: baslangicTarihi,
            bitis_tarihi: bitisTarihi,
            teklif_fiyati: parseFloat(teklifFiyati)
          }),
        });
        
        if (yanit.ok) {
          alert('Teklifiniz başarıyla gönderildi!');
          kapat();
        } else {
          alert('Teklifiniz gönderilirken bir hata oluştu.');
        }
        
        /*
        // API bağlantısı yoksa geçici olarak:
        alert('Teklifiniz başarıyla gönderildi!');
        kapat();
        */

        // State'leri temizle
        baslangicTarihiAyarla('');
        bitisTarihiAyarla('');
        teklifFiyatiAyarla('');
        teklifAdimAyarla(1);
      } catch (hata) {
        console.error('Teklif gönderme hatası:', hata);
        alert('Bir hata oluştu, lütfen tekrar deneyin.');
      }
    };
    
    // Minimum tarih değeri (bugün)
    const bugun = new Date().toISOString().split('T')[0];
    
    return (
      <div className="teklif-modal-overlay" onClick={kapat}>
        <div className="teklif-modal" onClick={e => e.stopPropagation()}>
          <div className="teklif-modal-header">
            <h2>{teklifAdim === 1 ? 'Tarih Seçimi' : 'Fiyat Teklifi'}</h2>
            <span className="teklif-modal-kapat" onClick={kapat}>&times;</span>
          </div>
          
          <div className="teklif-modal-content">
            {teklifAdim === 1 ? (
              // Tarih seçim adımı
              <div className="tarih-secim-container">
                <div className="tarih-input-group">
                  <label htmlFor="baslangic-tarihi">Başlangıç Tarihi:</label>
                  <input
                    type="date"
                    id="baslangic-tarihi"
                    min={bugun}
                    value={baslangicTarihi}
                    onChange={e => baslangicTarihiAyarla(e.target.value)}
                    required
                  />
                </div>
                
                <div className="tarih-input-group">
                  <label htmlFor="bitis-tarihi">Bitiş Tarihi:</label>
                  <input
                    type="date"
                    id="bitis-tarihi"
                    min={baslangicTarihi || bugun}
                    value={bitisTarihi}
                    onChange={e => bitisTarihiAyarla(e.target.value)}
                    required
                  />
                </div>
                
                {baslangicTarihi && bitisTarihi && (
                  <div className="tarih-bilgisi">
                    <p>Seçilen Toplam Gün: <strong>{toplamGun}</strong></p>
                    <p>Hesaplanan Toplam Fiyat: <strong>{(gunlukFiyat * toplamGun).toLocaleString('tr-TR')} TL</strong></p>
                  </div>
                )}
              </div>
            ) : (
              // Fiyat teklifi adımı
              <div className="fiyat-teklif-container">
                <div className="tarih-ozeti">
                  <p><strong>Seçilen Tarih Aralığı:</strong> {new Date(baslangicTarihi).toLocaleDateString('tr-TR')} - {new Date(bitisTarihi).toLocaleDateString('tr-TR')}</p>
                  <p><strong>Toplam Gün:</strong> {toplamGun}</p>
                  <p><strong>Normal Fiyat:</strong> {(gunlukFiyat * toplamGun).toLocaleString('tr-TR')} TL</p>
                </div>
                
                <div className="fiyat-input-group">
                  <label htmlFor="teklif-fiyati">Teklif Edilecek Fiyat (TL):</label>
               <input
                  type="number"
                  id="teklif-fiyati"
                  min="1"
                  value={teklifFiyati}
                  onChange={e => teklifFiyatiAyarla(e.target.value)}
                  ref = {fiyatInputRef}
                  required
                />
                </div>
                
                {teklifFiyati && (
                  <div className="teklif-bilgisi">
                    <p>
                      <strong>Normal Fiyata Göre:</strong> {' '}
                      {parseFloat(teklifFiyati) < (gunlukFiyat * toplamGun) ? (
                        <span className="indirimli-fiyat">
                          %{(100 - (parseFloat(teklifFiyati) / (gunlukFiyat * toplamGun) * 100)).toFixed(2)} İndirimli
                        </span>
                      ) : parseFloat(teklifFiyati) > (gunlukFiyat * toplamGun) ? (
                        <span className="arttirilmis-fiyat">
                          %{((parseFloat(teklifFiyati) / (gunlukFiyat * toplamGun) * 100) - 100).toFixed(2)} Fazla
                        </span>
                      ) : (
                        <span>Standart Fiyat</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="teklif-modal-footer">
            {teklifAdim === 1 ? (
              <>
                <button 
                  className="teklif-iptal-btn" 
                  onClick={kapat}
                >
                  İptal
                </button>
                <button 
                  className="teklif-devam-btn" 
                  onClick={() => {
                    if (!baslangicTarihi || !bitisTarihi) {
                      alert('Lütfen geçerli tarihler seçin!');
                      return;
                    }
                    teklifAdimAyarla(2);
                  }}
                >
                  Devam Et
                </button>
              </>
            ) : (
              <>
                <button 
                  className="teklif-geri-btn" 
                  onClick={() => teklifAdimAyarla(1)}
                >
                  Geri
                </button>
                <button 
                  className="teklif-gonder-btn" 
                  onClick={teklifGonder}
                >
                  Teklif Gönder
                </button>
              </>
            )}
          </div>
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
// Fiyat hesaplama fonksiyonu
const fiyatHesapla = (tip) => {
  if (!ilan || !ilan.fiyat) return 'Fiyat belirtilmemiş';
  
  const gunlukFiyat = parseFloat(ilan.fiyat) || 0;
  
  switch(tip) {
    case 'gunluk':
      return `${gunlukFiyat.toLocaleString('tr-TR')} TL`;
    case 'haftalik':
      // Haftalık için indirim yapılmış mı kontrolü
      const normalHaftalik = gunlukFiyat * 7;
      const haftalikFiyat = normalHaftalik - 100; // Örnek indirim: 100 TL
      return `${haftalikFiyat.toLocaleString('tr-TR')} TL`;
    case 'aylik':
      // Aylık için indirim yapılmış mı kontrolü
      const normalAylik = gunlukFiyat * 30;
      const aylikFiyat = normalAylik - 500; // Örnek indirim: 500 TL
      return `${aylikFiyat.toLocaleString('tr-TR')} TL`;
    case 'haftalikIndirim':
      // Haftalık indirimi hesapla
      const haftalikNormal = gunlukFiyat * 7;
      const haftalikIndirimliFiyat = haftalikNormal - 100; // Örnek indirim: 100 TL
      return haftalikNormal - haftalikIndirimliFiyat;
    case 'aylikIndirim':
      // Aylık indirimi hesapla
      const aylikNormal = gunlukFiyat * 30;
      const aylikIndirimliFiyat = aylikNormal - 500; // Örnek indirim: 500 TL
      return aylikNormal - aylikIndirimliFiyat;
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
    // Teklif modalını aç
    teklifModalAcikAyarla(true);
  };

  // Yorum ekleme fonksiyonu
  const yorumEkle = async (e) => {
    e.preventDefault();

    if (yeniYorum.trim() === '') {
      alert('Lütfen bir yorum yazınız!');
      return;
    }

    if (!_KULLANICIID) {
      navigate("/giris");
      return;
    }

    try {
      const yanit = await fetch('http://localhost:5000/api/ilanyorumlari', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sahipid: _KULLANICIID,
          yorum: yeniYorum,
          ilanid: ilanid
        }),
      });

      if (yanit.status === 200) {
        alert('Yorum başarıyla eklendi.');
        yeniYorumAyarla(''); // input temizlensin
        // yorumları yeniden çek
        await ilanyorumlarini_cek(); 
      } else {
        alert('Yorum eklenirken bir hata oluştu.');
      }
    } catch (hata) {
      alert('Sunucu hatası!');
      console.error(hata);
    }
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
      
      {/* Teklif Verme Modalı */}
      {teklifModalAcik && (
        <TeklifModal 
          kapat={() => {
            teklifModalAcikAyarla(false);
            teklifAdimAyarla(1); // Modal kapanınca adım 1'e dön
            baslangicTarihiAyarla('');
            bitisTarihiAyarla('');
            teklifFiyatiAyarla('');
          }}
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
          <div className="price-type-value">{fiyatHesapla('gunluk').metin}</div>
        </div>
        <div className="price-type-item">
          <div className="price-type-label">Haftalık</div>
          <div className="price-type-value">{fiyatHesapla('haftalik').metin}</div>
              <div className="gunluk-esdeger">
              (Günlük {Math.round(fiyatHesapla('haftalik').deger / 7).toLocaleString('tr-TR')} TL)
                  </div>
        </div>

        <div className="price-type-item">
          <div className="price-type-label">Aylık</div>
          <div className="price-type-value">{fiyatHesapla('aylik').metin}</div>
           <div className="gunluk-esdeger">
            (Günlük {Math.round(fiyatHesapla('aylik').deger / 30).toLocaleString('tr-TR')} TL)
                  </div>
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


      {/* Tab içeriği */}
      <div className="tab-content">
        <div className="yorumlar-content">
          <h3>Kullanıcı Yorumları</h3>
          
        {/* Yorumlar listesi - Geliştirilmiş versiyon */}
      <div className="comments">
        {_ILANYORUMLARI.length > 0 ? (
          _ILANYORUMLARI.map((yorum) => (
            <div className="comment-item" key={`comment-${yorum.sahipid}`}>
              <div className="comment-header">
                <div className="comment-user-info">
                  {/* Kullanıcı avatarı */}
                  <div className="comment-avatar">
                    {yorum.avatar ? (
                      <img 
                        src={yorum.avatar} 
                        alt={`${yorum.ad} profil resmi`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = `<div class="avatar-placeholder">${yorum.ad ? yorum.ad.charAt(0).toUpperCase() : '?'}</div>`;
                        }} 
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {yorum.ad ? yorum.ad.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  {/* Kullanıcı adı ve tarihi */}
                  <div className="comment-user-details">
                    <strong className="comment-username">{yorum.ad}</strong>
                    <span className="comment-date">{yorum.tarih}</span>
                  </div>
                </div>
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
            <form onSubmit={yorumEkle}>
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