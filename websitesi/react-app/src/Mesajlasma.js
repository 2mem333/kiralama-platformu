import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import UstCubuk from './UstCubuk';
import './Mesajlasma.css';

const Mesajlar = () => {
  const [yeniMesaj, setYeniMesaj] = useState('');
  const [seciliKonusma, setSeciliKonusma] = useState(null);
  const [konusmalar, setKonusmalar] = useState([]);
  const [aramaKelimesi, setAramaKelimesi] = useState('');
  const mesajlarContainerRef = useRef(null);
  const [ilanlar, setIlanlar] = useState([]);
  const [kullaniciid, setKullaniciId] = useState(null);
  const location = useLocation();

  const {ilanId, sahipId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
  // Token'dan kullanıcı ID'sini çek
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setKullaniciId(payload.kullaniciid);
    } catch (error) {
      console.error('Token parsing error:', error);
    }
  }
}, []);

  useEffect(() => {
    if (location.state?.ilan) {
      const newKonusma = {
        id: Date.now(),
        kullanici: location.state.alici,
        ilan: location.state.ilan,
        mesajlar: [],
        okunmamis: 0,
        sonMesajTarih: new Date().toISOString()
      };
      setKonusmalar(prev => {
      // Aynı id’li konuşma varsa ekleme
      if (prev.some(k => k.ilan.id === location.state.ilan.id && k.kullanici.id === location.state.alici.id)) {
        return prev;
      }
      return [...prev, newKonusma];
    });
    setSeciliKonusma(newKonusma);
      
    } else {
      // Sadece ilk yüklemede fake verileri ekleyin
      if(konusmalar.length === 0) {
        const fakeKonusmalar = [
  {
    id: 1,
    kullanici: {
      id: 2,
      ad: "Ahmet Yılmaz",
      avatar: "https://via.placeholder.com/50"
    },
    ilan: {
      id: 123,
      baslik: "Samsung Galaxy S23",
      foto: "https://via.placeholder.com/80"
    },
    mesajlar: [ // MESAJLAR DİZİSİNİ KONTROL EDİN
      {
        id: 1,
        icerik: "Merhaba, ürün hala satılık mı?", // icerik alanı olmalı
        gonderen: 2,
        tarih: "2023-09-15T10:30:00"
      },
      {
        id: 2,
        icerik: "Evet, hala satılık.", // icerik alanı olmalı
        gonderen: 1,
        tarih: "2023-09-15T10:32:00"
      }
    ],
    okunmamis: 1,
    sonMesajTarih: "2023-09-15T10:32:00"
  }
];
        setKonusmalar(fakeKonusmalar);
        setSeciliKonusma(fakeKonusmalar[0]);
      }
    }
  }, [location.state]); // Bağımlılık eklendi

  // Mesaj gönderme fonksiyonu güncellendi
  const mesajGonder = (e) => {
  e.preventDefault();
  if (!yeniMesaj.trim() || !seciliKonusma) return;

  const yeniMesajObj = {
    id: Date.now(),
    icerik: yeniMesaj,
    gonderen: 1,
    tarih: new Date().toISOString()
  };

  // Tüm durumlar için ortak güncelleme
  const guncellenmisKonusmalar = konusmalar.map(konusma => {
    if (konusma.id === seciliKonusma.id) {
      return {
        ...konusma,
        mesajlar: [...konusma.mesajlar, yeniMesajObj],
        sonMesajTarih: new Date().toISOString()
      };
    }
    return konusma;
  });

  setKonusmalar(guncellenmisKonusmalar);
  setSeciliKonusma(guncellenmisKonusmalar.find(k => k.id === seciliKonusma.id));
  setYeniMesaj('');
};

  const filtreliKonusmalar = konusmalar.filter(konusma => 
    konusma.kullanici.ad.toLowerCase().includes(aramaKelimesi.toLowerCase()) ||
    konusma.ilan.baslik.toLowerCase().includes(aramaKelimesi.toLowerCase())
  );

  return (
    <div className="mesajlar-container">
      <UstCubuk kullaniciId={kullaniciid} />
      
      <div className="mesajlar-paneli">
        {/* Sol panel - Konuşma listesi */}
        <div className="konusma-listesi">
          <div className="konusma-arama">
            <input
              type="text"
              placeholder="Konuşma ara..."
              value={aramaKelimesi}
              onChange={(e) => setAramaKelimesi(e.target.value)}
            />
          </div>
          
          {filtreliKonusmalar.map(konusma => (
            <div 
                key={konusma.id}
                className={`konusma-item ${seciliKonusma?.id === konusma.id ? 'aktif' : ''}`}
                onClick={() => setSeciliKonusma(konusma)}
            >
                <div className="konusma-kullanici">
                <img 
                    src={konusma.kullanici.avatar} 
                    alt={konusma.kullanici.ad}
                    className="konusma-avatar"
                />
                <div className="konusma-bilgi">
                    <h4>{konusma.kullanici.ad}</h4>
                    <p className="konusma-onizleme">
                    {konusma.mesajlar?.[konusma.mesajlar.length - 1]?.icerik || 'Mesaj yok'}
                    </p>
                </div>
                </div>
                <div className="konusma-detay">
                <span className="konusma-tarih">
                    {new Date(konusma.sonMesajTarih).toLocaleDateString()}
                </span>
                {konusma.okunmamis > 0 && (
                    <span className="okunmamis-badge">{konusma.okunmamis}</span>
                )}
                </div>
            </div>
            ))}
        </div>

        {/* Sağ panel - Mesajlaşma alanı */}
        {seciliKonusma ? (
          <div className="mesajlasma-alani">
            <div className="mesajlasma-header">
              <div className="mesaj-kullanici-bilgi">
              <img 
                src={seciliKonusma.kullanici.avatar} 
                alt={seciliKonusma.kullanici.ad}
                className="kullanici-avatar"
              />
              <div>
                <h3>{seciliKonusma.kullanici.ad}</h3>
                <p>Online</p>
              </div>
            </div>
              <div className="mesaj-ilan-bilgi">
                <img 
                  src={seciliKonusma.ilan.foto} 
                  alt={seciliKonusma.ilan.baslik}
                  className="ilan-kucuk-resim"
                />
                <div>
                  <h3>{seciliKonusma.ilan.baslik}</h3>
                  <p>{seciliKonusma.kullanici.ad} ile iletişim</p>
                </div>
              </div>
              <Link 
                to={`/ilanlar/${ilanId}/${seciliKonusma.ilan.baslik}`}
                className="ilan-git-btn"
              >
                İlana Git
              </Link>
            </div>

            <div className="mesajlar-listesi" ref={mesajlarContainerRef}>
                {seciliKonusma?.mesajlar?.map(mesaj => (
                    <div 
                    key={mesaj.id}
                    className={`mesaj-item ${mesaj.gonderen === 1 ? 'gonderici' : 'alicı'}`}
                    >
                    <div className="mesaj-icerik">
                        <p>{mesaj.icerik || 'Boş mesaj'}</p> {/* Fallback ekle */}
                        <span className="mesaj-tarih">
                        {new Date(mesaj.tarih).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                        </span>
                    </div>
                    </div>
                ))}
            </div>

            <form className="mesaj-gonder-form" onSubmit={mesajGonder}>
              <textarea
                value={yeniMesaj}
                onChange={(e) => setYeniMesaj(e.target.value)}
                placeholder="Mesajınızı yazın..."
                rows="1"
              />
              <button type="submit" disabled={!yeniMesaj.trim()}>
                Gönder
              </button>
            </form>
          </div>
        ) : (
          <div className="konusma-secimi">
            <p>Lütfen bir konuşma seçin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mesajlar;