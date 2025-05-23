import React, { useState,useEffect } from 'react';
import './AnaSayfa.css';
import UstCubuk from './UstCubuk';
import { Link,useNavigate } from 'react-router-dom';
const placeholderImage = "https://via.placeholder.com/300x200?text=Ürün+Görseli";

const kategoriler = [
  "Tüm Kategoriler",
  "Mobilya",
  "Elektronik",
  "Ev Eşyaları",
  "Beyaz Eşya",
  "Mutfak Eşyaları",
  "Dekorasyon",
  "Bahçe",
  "Diğer"
];


//-----------------------JAVASCIPT KODLARI BASLANGIC---------------------------------------------------------------------------------------------------------
const AnaSayfa = () => {
  const [_ARAMAMETNI, fAramaMetni] = useState('');
  const [_SECILIKATEGORI, fSeciliKategori] = useState('Tüm Kategoriler');
  const [_GORUNUMTIPI, fGorunumTipi] = useState('grid'); // artık tüm görünümler yatay
  const [_DETAYLIILAN, fDetayliIlan] = useState(null);
  const [_SIRALAMA, fSiralama] = useState('en-yeni');
  const [_SIDEBARACIK, fSideBarAcik] = useState(true); // Mobil görünümde sidebar durumu
  const [_ILANLAR, fIlanlar] = useState([]);
  const [sayfaBasiIlanSayisi, setSayfaBasiIlanSayisi] = useState(20);
  const [aktifSayfa, setAktifSayfa] = useState(1);
 const [_KULLANICIID, fKullaniciId] = useState(null);
  const navigate = useNavigate();
  
  const cikisYap = () => {
    localStorage.removeItem('token');  // Tokeni sil
    navigate('/giris');
  };

//------------Başlangıçta ilanları çekebilmek için (Backend)---------
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

      const ilanlari_cek = async () => {
        try {
          const params = new URLSearchParams();
          params.append('limit', '100');
          const url = `http://localhost:5000/api/ilanlar?${params.toString()}`;
          const response = await fetch(url, {
            headers: {
              'Accept': 'application/json; charset=utf-8',
              'Content-Type': 'application/json; charset=utf-8'
            }
          });
          
          if (!response.ok) {
            throw new Error('API yanıtı başarısız oldu');
          }
          
          const rawText = await response.text();
          console.log('Ham API yanıtı:', rawText);
          
          const data = JSON.parse(rawText);
          console.log('Dönüştürülen veri:', data);
          
          fIlanlar(data);
        } catch (error) {
          console.error('Veri alınırken bir hata oluştu', error);
        }
      };
      ilanlari_cek();
    }, []);

 const getImageUrl = (resimYolu) => {
  if (!resimYolu) {
    return placeholderImage;
  }
  
  // parseImages fonksiyonunu kullanarak URL'leri doğru şekilde ayrıştır
  const imageUrls = parseImages(resimYolu);
  
  // Eğer geçerli bir URL varsa ilkini döndür, yoksa placeholder göster
  return imageUrls.length > 0 ? imageUrls[0] : placeholderImage;
};

  const parseImages = (resimYolu) => {
    try {
      if (!resimYolu) return []; // Boş string kontrolü eklendi
      
      // 1. Tüm gereksiz karakterleri temizle
      const cleanString = resimYolu
        .replace(/^[\s"{]+/g, '')  // Baştaki {, ", boşluk
        .replace(/[\s"}]+$/g, '')   // Sondaki }, ", boşluk
        .replace(/\\/g, '')        // Ters slash'ları kaldır
        .replace(/"/g, '');        // Kalan tırnakları temizle

      // 2. URL'leri virgülle ayır ve geçerli olanları filtrele
      return cleanString.split(',')
        .map(url => url.trim())
        .filter(url => {
          if (!url) return false; // Boş URL kontrolü eklendi
          try {
            new URL(url);
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

  const filtreliVeSirali_ILANLAR = () => {
    let sonuclar = _ILANLAR.filter(ilan => {
      const metinUyumu = ilan.baslik.toLowerCase().includes(_ARAMAMETNI.toLowerCase());
      const kategoriUyumu = _SECILIKATEGORI === 'Tüm Kategoriler' || ilan.kategori === _SECILIKATEGORI;
      return metinUyumu && kategoriUyumu;
    });

    if (_SIRALAMA === 'fiyat-artan') {
      sonuclar.sort((a, b) => a.fiyat - b.fiyat);
    } else if (_SIRALAMA === 'fiyat-azalan') {
      sonuclar.sort((a, b) => b.fiyat - a.fiyat);
    }

    return sonuclar;
  };

  // Tüm filtrelenmiş ve sıralanmış _ILANLARı al
  const tumFiltreli_ILANLAR = filtreliVeSirali_ILANLAR();
  
  // Toplam sayfa sayısını hesapla
  const toplamSayfaSayisi = Math.ceil(tumFiltreli_ILANLAR.length / sayfaBasiIlanSayisi);
  
  // Mevcut sayfa için _ILANLARı al (pagination)
  const mevcutSayfa_ILANLARi = tumFiltreli_ILANLAR.slice(
    (aktifSayfa - 1) * sayfaBasiIlanSayisi,
    aktifSayfa * sayfaBasiIlanSayisi
  );

  const kategoriSayilari = kategoriler.reduce((acc, kategori) => {
    if (kategori === "Tüm Kategoriler") {
      acc[kategori] = _ILANLAR.length;
    } else {
      acc[kategori] = _ILANLAR.filter(ilan => ilan.kategori === kategori).length;
    }
    return acc;
  }, {});
  
  const ilanDetayiniGoster = (ilan) => {
    fDetayliIlan(ilan);
  };

  const ilanDetayiniKapat = () => {
    fDetayliIlan(null);
  };

  const _SIRALAMADeğiştir = (e) => {
    fSiralama(e.target.value);
  };

  const kategoriDegistir = (yeniKategori) => {
    fSeciliKategori(yeniKategori);
    setAktifSayfa(1); // Kategori değiştiğinde ilk sayfaya dön
  };

  const toggleSidebar = () => {
    fSideBarAcik(!_SIDEBARACIK);
  };

  const handleAramaChange = (event) => {
    fAramaMetni(event.target.value);
    setAktifSayfa(1); // Arama kriteri değiştiğinde ilk sayfaya dön
  };

  // Sayfa değiştirme fonksiyonu
  const sayfaDegistir = (sayfaNo) => {
    if (sayfaNo < 1) {
      setAktifSayfa(1);
    } else if (sayfaNo > toplamSayfaSayisi) {
      setAktifSayfa(toplamSayfaSayisi);
    } else {
      setAktifSayfa(sayfaNo);
    }
    // Sayfa değiştiğinde sayfanın üstüne kaydır
    window.scrollTo(0, 0);
  };

  // Sayfalama numaralarını görüntülemek için yardımcı fonksiyon
  const sayfaNumaralariniGoster = () => {
    const sayfaNumaralari = [];
    
    // En fazla görüntülenecek sayfa numarası sayısı
    const maxGosterilecekSayfaSayisi = 5;
    
    let baslangicSayfasi = Math.max(1, aktifSayfa - Math.floor(maxGosterilecekSayfaSayisi / 2));
    let bitisSayfasi = Math.min(toplamSayfaSayisi, baslangicSayfasi + maxGosterilecekSayfaSayisi - 1);
    
    // Bitiş sayfası maxGosterilecekSayfaSayisi'ndan daha az ise, başlangıç sayfasını ayarla
    if (bitisSayfasi - baslangicSayfasi + 1 < maxGosterilecekSayfaSayisi) {
      baslangicSayfasi = Math.max(1, bitisSayfasi - maxGosterilecekSayfaSayisi + 1);
    }
    
    // "İlk Sayfa" butonu
    if (baslangicSayfasi > 1) {
      sayfaNumaralari.push(
        <button 
          key="first" 
          className="sayfa-numarasi" 
          onClick={() => sayfaDegistir(1)}
        >
          İlk
        </button>
      );
    }
    
    // Sayfa numaraları
    for (let i = baslangicSayfasi; i <= bitisSayfasi; i++) {
      sayfaNumaralari.push(
        <button 
          key={i} 
          className={`sayfa-numarasi ${i === aktifSayfa ? 'aktif' : ''}`} 
          onClick={() => sayfaDegistir(i)}
        >
          {i}
        </button>
      );
    }
    
    // "Son Sayfa" butonu
    if (bitisSayfasi < toplamSayfaSayisi) {
      sayfaNumaralari.push(
        <button 
          key="last" 
          className="sayfa-numarasi" 
          onClick={() => sayfaDegistir(toplamSayfaSayisi)}
        >
          Son
        </button>
      );
    }
    
    return sayfaNumaralari;
  };
//-----------------------JAVASCIPT KODLARI BİTİŞ----------------------------------------------------------------------------------------------------

//-----------------------JSX BLOGU BASLANGIC--------------------------------------------------------------------------------------------------------
  return (
    <>
      <UstCubuk _ARAMAMETNI={_ARAMAMETNI} onAramaChange={handleAramaChange} kullaniciId={_KULLANICIID}/>
      <div className="page-wrapper">
        <aside className={`kategori-sidebar ${_SIDEBARACIK ? 'acik' : ''}`}>
          <h2 className="sidebar-baslik">Kategoriler</h2>
          <ul className="kategori-listesi">
            {kategoriler.map((kategori) => (
              <li 
                key={kategori} 
                className={`kategori-item ${_SECILIKATEGORI === kategori ? 'aktif' : ''}`}
                onClick={() => kategoriDegistir(kategori)}
              >             
                <span className="kategori-text">{kategori}</span>
                <span className="kategori-sayi">{kategoriSayilari[kategori]}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="main-container">
          <header className="header">
            <h1>İkinci El Eşya İlanları</h1>
            <p>Atsan atılmaz, satsan satılmaz. En iyisi KİRALA!</p>
          </header>

          <button className="mobil-menu-btn" onClick={toggleSidebar}>
            {_SIDEBARACIK ? '✕' : '☰'} Kategoriler
          </button>

          <div className="results-sort-view">
            <div className="results-sort">
              <p className="results-count">{tumFiltreli_ILANLAR.length} ilan bulundu</p>
              <div className="sort-container">
                <span className="sort-icon">↕️</span>
                <span className="sort-label">Sırala:</span>
                <select 
                  className="sort-select"
                  value={_SIRALAMA}
                  onChange={_SIRALAMADeğiştir}
                >
                  <option value="en-yeni">En Yeniler</option>
                  <option value="fiyat-artan">Fiyat (Artan)</option>
                  <option value="fiyat-azalan">Fiyat (Azalan)</option>
                </select>
              </div>
            </div>
            <div className="view-options">
              <button
                className={`view-button ${_GORUNUMTIPI === 'grid' ? 'active' : ''}`}
                onClick={() => fGorunumTipi('grid')}
              >
                □
              </button>
              <button
                className={`view-button ${_GORUNUMTIPI === 'list' ? 'active' : ''}`}
                onClick={() => fGorunumTipi('list')}
              >
                ≡
              </button>
            </div>
          </div>

          <div className={`ilan-listesi ${_GORUNUMTIPI}`}>
            {mevcutSayfa_ILANLARi.length > 0 ? (
              mevcutSayfa_ILANLARi.map(ilan => (
                <div 
                  key={ilan.ilanid} 
                  className="ilan-karti-yatay"
                  onClick={() => ilanDetayiniGoster(ilan)}
                >
                  <div className="ilan-resim-container">
                    <img 
                      src={getImageUrl(ilan.resim)} 
                      alt={ilan.baslik} 
                      className="ilan-resmi" 
                    />
                    {/* <span className="ilan-durum">{ilan.durum}</span> */}
                  </div>
                  <div className="ilan-bilgileri">
                    <div className="ilan-ust-bilgi">
                      <div className="ilan-baslik-fiyat">
                        <h2 className="ilan-baslik">{ilan.baslik}</h2>
                        <span className="ilan-fiyat">{ilan.fiyat} TL</span>
                      </div>
                      <div className="ilan-detaylar">
                        <p className="ilan-lokasyon"> {ilan.lokasyon}</p>
                        <div className="ilan-durum-tarih">
                          <span className="ilan-tarih">{ilan.tarih}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="ilan-aciklama">{ilan.aciklama}</p>
                    <div className="ilan-alt-bilgiler">
                      <div className="ilan-favori">
                        <span className="favori-ikon">♥</span>
                        <span className="favori-sayi">{ilan.favoriSayisi}</span>
                      </div>
                      <Link to={`/ilanlar/${ilan.ilanid}/${encodeURIComponent(ilan.baslik)}`} className="ilan-incele-btn">
                        İlanı İncele
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>Aramanızla eşleşen ilan bulunamadı.</p>
                <button onClick={() => {fAramaMetni(''); fSeciliKategori('Tüm Kategoriler');}}>
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
          
          {/* Sayfalama bileşeni */}
          {tumFiltreli_ILANLAR.length > 0 && (
            <div className="sayfalama-container">
              <div className="sayfalama-bilgi">
                Toplam {tumFiltreli_ILANLAR.length} ilandan {(aktifSayfa - 1) * sayfaBasiIlanSayisi + 1}-
                {Math.min(aktifSayfa * sayfaBasiIlanSayisi, tumFiltreli_ILANLAR.length)} arası gösteriliyor
              </div>
              <div className="sayfalama-kontroller">
                <button 
                  className="sayfa-yon-butonu" 
                  onClick={() => sayfaDegistir(aktifSayfa - 1)}
                  disabled={aktifSayfa === 1}
                >
                  &lt; Önceki
                </button>
                
                <div className="sayfa-numaralari">
                  {sayfaNumaralariniGoster()}
                </div>
                
                <button 
                  className="sayfa-yon-butonu" 
                  onClick={() => sayfaDegistir(aktifSayfa + 1)}
                  disabled={aktifSayfa === toplamSayfaSayisi}
                >
                  Sonraki &gt;
                </button>
              </div>
              <div className="sayfa-basina-ilan">
                <label htmlFor="sayfaBasiIlan">Sayfa başına ilan sayısı:</label>
                <select 
                  id="sayfaBasiIlan" 
                  value={sayfaBasiIlanSayisi}
                  onChange={(e) => {
                    setSayfaBasiIlanSayisi(Number(e.target.value));
                    setAktifSayfa(1); // Sayfa başına gösterilecek ilan sayısı değiştiğinde ilk sayfaya dön
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          )}
        </div>
                                     
        
      </div>
<footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Hakkımızda</h3>
          <p>İkinci el eşya alım satım platformu olarak hizmet vermekteyiz.</p>
        </div>
        <div className="footer-section">
          <h3>Hızlı Linkler</h3>
          <ul>
            <li><Link to="/">Ana Sayfa</Link></li>
            <li><Link to="/ilan-ver">İlan Ver</Link></li>
            <li><Link to="/sss">SSS</Link></li>
            <li><Link to="/iletisim">İletişim</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>İletişim</h3>
          <p>Email: info@ikinciel.com</p>
          <p>Telefon: 0 (123) 456 78 90</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} İkinci El Eşya Platformu. Tüm hakları saklıdır.</p>
      </div>
    </footer>
      
    </>
    
  );
};

//-----------------------JSX BLOGU BITIS------------------------------------------------------------------------------------------------------------
export default AnaSayfa;