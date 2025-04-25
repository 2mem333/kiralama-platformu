import React, { useState } from 'react';
import './AnaSayfa.css';
import UstCubuk from './UstCubuk';

// Örnek veri
const tumIlanlar = [
  {
    id: 1,
    baslik: "Modern Koltuk Takımı",
    fiyat: 5500,
    lokasyon: "İstanbul, Kadıköy",
    resim: "/koltuk.webp", // Resim yolları başında "/" olan URL'ler olarak tanımlanmış
    durum: "Az Kullanılmış",
    aciklama: "2 yıllık, çok iyi durumda modern koltuk takımı. 3'lü, 2'li ve tekli koltuktan oluşmaktadır.",
    tarih: "2 gün önce",
    favoriSayisi: 24,
    kategori: "Mobilya"
  },
  {
    id: 2,
    baslik: "Vintage Yemek Masası",
    fiyat: 3200,
    lokasyon: "Ankara, Çankaya",
    resim: "/vintage_yemek_masası.webp",
    durum: "İkinci El",
    aciklama: "Ahşap, 6 kişilik vintage yemek masası. Özel dizayn, sağlam meşeden üretilmiştir.",
    tarih: "5 gün önce",
    favoriSayisi: 15,
    kategori: "Mobilya"
  },
  {
    id: 3,
    baslik: "Çalışma Masası ve Sandalye",
    fiyat: 1800,
    lokasyon: "İzmir, Karşıyaka",
    resim: "/calisma_masasi.jpg",
    durum: "Yeni Gibi",
    aciklama: "Ev ofis için ideal, ergonomik çalışma masası ve sandalye seti. 1 yıllık, çok az kullanılmış.",
    tarih: "Dün",
    favoriSayisi: 8,
    kategori: "Mobilya"
  },
  {
    id: 4,
    baslik: "Samsung 55 inç Smart TV",
    fiyat: 7200,
    lokasyon: "İstanbul, Beşiktaş",
    resim: "/smart_tv.jpg",
    durum: "Az Kullanılmış",
    aciklama: "1 yıllık Samsung Smart TV. 4K UHD, HDR destekli, tüm uygulamalar çalışıyor.",
    tarih: "1 hafta önce",
    favoriSayisi: 19,
    kategori: "Elektronik"
  },
  {
    id: 5,
    baslik: "Bulaşık Makinesi Bosch",
    fiyat: 4300,
    lokasyon: "Ankara, Keçiören",
    resim: "/bulasik.jpg",
    durum: "İkinci El",
    aciklama: "3 yıllık Bosch marka bulaşık makinesi. A+++ enerji sınıfı, 5 programlı, sorunsuz çalışıyor.",
    tarih: "3 gün önce",
    favoriSayisi: 12,
    kategori: "Beyaz Eşya"
  },
  {
    id: 6,
    baslik: "IKEA Yatak ve Baza",
    fiyat: 2600,
    lokasyon: "İzmir, Bornova",
    resim: "/yatak.webp",
    durum: "İkinci El",
    aciklama: "IKEA'dan alınma çift kişilik yatak ve baza. 4 yıllık fakat temiz ve bakımlı.",
    tarih: "2 hafta önce",
    favoriSayisi: 5,
    kategori: "Mobilya"
  } 
];

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

const kategoriIkonlari = {
  "Tüm Kategoriler": "📋",
  "Mobilya": "🪑",
  "Elektronik": "🖥️",
  "Ev Eşyaları": "🏠",
  "Beyaz Eşya": "🧊",
  "Mutfak Eşyaları": "🍽️",
  "Dekorasyon": "🎨",
  "Bahçe": "🌳",
  "Diğer": "📦"
};

const kategoriSayilari = kategoriler.reduce((acc, kategori) => {
  if (kategori === "Tüm Kategoriler") {
    acc[kategori] = tumIlanlar.length;
  } else {
    acc[kategori] = tumIlanlar.filter(ilan => ilan.kategori === kategori).length;
  }
  return acc;
}, {});

const AnaSayfa = () => {
  const [aramaMetni, setAramaMetni] = useState('');
  const [seciliKategori, setSeciliKategori] = useState('Tüm Kategoriler');
  const [gorunumTipi, setGorunumTipi] = useState('grid'); 
  const [detayliIlan, setDetayliIlan] = useState(null);
  const [siralama, setSiralama] = useState('en-yeni');
  const [sidebarAcik, setSidebarAcik] = useState(true);

  const getImageUrl = (resimYolu) => {
    if (!resimYolu) {
      return placeholderImage;
    }
    return resimYolu;
  };

  const filtreliVeSiraliIlanlar = () => {
    let sonuclar = tumIlanlar.filter(ilan => {
      const metinUyumu = ilan.baslik.toLowerCase().includes(aramaMetni.toLowerCase());
      const kategoriUyumu = seciliKategori === 'Tüm Kategoriler' || ilan.kategori === seciliKategori;
      return metinUyumu && kategoriUyumu;
    });

    if (siralama === 'fiyat-artan') {
      sonuclar.sort((a, b) => a.fiyat - b.fiyat);
    } else if (siralama === 'fiyat-azalan') {
      sonuclar.sort((a, b) => b.fiyat - a.fiyat);
    }

    return sonuclar;
  };

  const sonucIlanlar = filtreliVeSiraliIlanlar();

  const ilanDetayiniGoster = (ilan) => {
    setDetayliIlan(ilan);
  };

  const ilanDetayiniKapat = () => {
    setDetayliIlan(null);
  };

  const siralamaDeğiştir = (e) => {
    setSiralama(e.target.value);
  };

  const kategoriDegistir = (yeniKategori) => {
    setSeciliKategori(yeniKategori);
  };

  const toggleSidebar = () => {
    setSidebarAcik(!sidebarAcik);
  };

  const handleAramaChange = (event) => {
    setAramaMetni(event.target.value);
  };

  return (
    <>
      <UstCubuk aramaMetni={aramaMetni} onAramaChange={handleAramaChange} />
      <div className="page-wrapper">
        <aside className={`kategori-sidebar ${sidebarAcik ? 'acik' : ''}`}>
          <h2 className="sidebar-baslik">Kategoriler</h2>
          <ul className="kategori-listesi">
            {kategoriler.map((kategori) => (
              <li 
                key={kategori} 
                className={`kategori-item ${seciliKategori === kategori ? 'aktif' : ''}`}
                onClick={() => kategoriDegistir(kategori)}
              >
                <span className="kategori-icon">{kategoriIkonlari[kategori]}</span>
                <span className="kategori-text">{kategori}</span>
                <span className="kategori-sayi">{kategoriSayilari[kategori]}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="main-container">
          <header className="header">
            <h1>İkinci El Eşya İlanları</h1>
            <p>İhtiyacınız olan eşyaları bulun veya kullanmadıklarınızı satın</p>
          </header>

          <button className="mobil-menu-btn" onClick={toggleSidebar}>
            {sidebarAcik ? '✕' : '☰'} Kategoriler
          </button>

          {/* Arama çubuğu buradan kaldırıldı */}

          <div className="results-sort-view">
            <div className="results-sort">
              <p className="results-count">{sonucIlanlar.length} ilan bulundu</p>
              <div className="sort-container">
                <span className="sort-icon">↕️</span>
                <span className="sort-label">Sırala:</span>
                <select 
                  className="sort-select"
                  value={siralama}
                  onChange={siralamaDeğiştir}
                >
                  <option value="en-yeni">En Yeniler</option>
                  <option value="fiyat-artan">Fiyat (Artan)</option>
                  <option value="fiyat-azalan">Fiyat (Azalan)</option>
                </select>
              </div>
            </div>
            <div className="view-options">
              <button
                className={`view-button ${gorunumTipi === 'grid' ? 'active' : ''}`}
                onClick={() => setGorunumTipi('grid')}
              >
                □
              </button>
              <button
                className={`view-button ${gorunumTipi === 'list' ? 'active' : ''}`}
                onClick={() => setGorunumTipi('list')}
              >
                ≡
              </button>
            </div>
          </div>

          <div className={`ilan-listesi ${gorunumTipi}`}>
            {sonucIlanlar.length > 0 ? (
              sonucIlanlar.map(ilan => (
                <div 
                  key={ilan.id} 
                  className="ilan-karti-yatay"
                  onClick={() => ilanDetayiniGoster(ilan)}
                >
                  <div className="ilan-resim-container">
                    <img 
                      src={getImageUrl(ilan.resim)} 
                      alt={ilan.baslik} 
                      className="ilan-resmi" 
                    />
                    <span className="ilan-durum">{ilan.durum}</span>
                  </div>
                  <div className="ilan-bilgileri">
                    <div className="ilan-ust-bilgi">
                      <div className="ilan-baslik-fiyat">
                        <h2 className="ilan-baslik">{ilan.baslik}</h2>
                        <span className="ilan-fiyat">{ilan.fiyat} TL</span>
                      </div>
                      <div className="ilan-detaylar">
                        <p className="ilan-lokasyon">📍 {ilan.lokasyon}</p>
                        <div className="ilan-durum-tarih">
                          <span className="ilan-tarih">{ilan.tarih}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ilan-kategori">🏷️ Kategori: {ilan.kategori}</div>
                    <p className="ilan-aciklama">{ilan.aciklama}</p>
                    <div className="ilan-alt-bilgiler">
                      <div className="ilan-favori">
                        <span className="favori-ikon">♥</span>
                        <span className="favori-sayi">{ilan.favoriSayisi}</span>
                      </div>
                      <button className="ilan-incele-btn">İlanı İncele</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>Aramanızla eşleşen ilan bulunamadı.</p>
                <button onClick={() => {setAramaMetni(''); setSeciliKategori('Tüm Kategoriler');}}>
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>

        {detayliIlan && (
          <div className="modal-arkaplan">
            <div className="modal-icerik">
              <div className="modal-header">
                <h2 className="modal-baslik">{detayliIlan.baslik}</h2>
                <button 
                  className="modal-kapat"
                  onClick={ilanDetayiniKapat}
                >
                  ✕
                </button>
              </div>
              <img 
                src={getImageUrl(detayliIlan.resim)} 
                alt={detayliIlan.baslik} 
                className="modal-resim" 
              />
              <div className="modal-fiyat-tarih">
                <span className="modal-fiyat">{detayliIlan.fiyat} TL</span>
                <span className="modal-tarih">{detayliIlan.tarih}</span>
              </div>
              <div className="modal-detaylar">
                <div className="modal-detay">
                  <h3 className="detay-baslik">Konum</h3>
                  <p className="detay-icerik">{detayliIlan.lokasyon}</p>
                </div>
                <div className="modal-detay">
                  <h3 className="detay-baslik">Durum</h3>
                  <p className="detay-icerik">{detayliIlan.durum}</p>
                </div>
                <div className="modal-detay">
                  <h3 className="detay-baslik">Kategori</h3>
                  <p className="detay-icerik">{detayliIlan.kategori}</p>
                </div>
              </div>
              <div className="modal-aciklama">
                <h3 className="detay-baslik">Açıklama</h3>
                <p className="detay-icerik">{detayliIlan.aciklama}</p>
              </div>
              <div className="modal-butonlar">
                <button className="favori-buton">
                  ♥ Favorilere Ekle
                </button>
                <button className="mesaj-buton">
                  ✉ Mesaj Gönder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AnaSayfa;