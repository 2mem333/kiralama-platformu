import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UstCubuk2 from './UstCubukProfil';
import './IlanYonetimi.css';

function IlanYonetimi() {
  const { kullaniciid } = useParams();
  const navigate = useNavigate();
  const [ilanlar, setIlanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [duzenlenenIlan, setDuzenlenenIlan] = useState(null);
  const [ilanBaslik, setIlanBaslik] = useState('');
  const [ilanFiyat, setIlanFiyat] = useState('');

  // İlanları çekme
  useEffect(() => {
    const fetchIlanlar = async () => {
      try {
        const params = new URLSearchParams({ sahipid: kullaniciid });
        const response = await fetch(`http://localhost:5000/api/ilanlar?${params}`);
        
        if (!response.ok) throw new Error('Veri alınamadı');
        
        const data = await response.json();
        setIlanlar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIlanlar();
  }, [kullaniciid]);

  // İlan düzenleme formu gönderimi
  const handleGuncelle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/ilanlar/${duzenlenenIlan.ilanid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baslik: ilanBaslik,
          fiyat: ilanFiyat
        }),
      });
      
      if (!response.ok) throw new Error('Güncelleme başarısız');
      
      const updatedIlan = await response.json();
      setIlanlar(ilanlar.map(ilan => 
        ilan.ilanid === updatedIlan.ilanid ? updatedIlan : ilan
      ));
      setDuzenlenenIlan(null);
      alert('İlan başarıyla güncellendi!');
    } catch (err) {
      setError(err.message);
    }
  };

  // Görsel URL'sini işleme
  const getImageUrl = (resimYolu) => {
    return resimYolu || "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png";
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">Hata: {error}</div>;

  return (
    <>
      <UstCubuk2 />
      <div className="profil-container">
        <div className="profil-header">
          <h1 className="profil-isim">İlan Yönetimi</h1>
          <button 
            className="yeni-ilan-btn"
            onClick={() => navigate(`/ilanolustur`)}
            >
            + Yeni İlan Ekle
          </button>
        </div>

        <div className="ilanlar-grid">
          {ilanlar.map(ilan => (
            <div key={ilan.ilanid} className="ilan-karti">
              {duzenlenenIlan?.ilanid === ilan.ilanid ? (
                <form onSubmit={handleGuncelle} className="ilan-duzenleme-formu">
                  <input
                    type="text"
                    value={ilanBaslik}
                    onChange={(e) => setIlanBaslik(e.target.value)}
                    placeholder="İlan Başlığı"
                    required
                  />
                  <input
                    type="number"
                    value={ilanFiyat}
                    onChange={(e) => setIlanFiyat(e.target.value)}
                    placeholder="Fiyat"
                    required
                  />
                  <div className="duzenleme-butonlar">
                    <button type="submit">Kaydet</button>
                    <button type="button" onClick={() => setDuzenlenenIlan(null)}>
                      İptal
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <img 
                    src={getImageUrl(ilan.resim)} 
                    alt={ilan.baslik} 
                    className="ilan-resim" 
                  />
                  <div className="ilan-bilgileri">
                    <h3>{ilan.baslik}</h3>
                    <p>{ilan.fiyat}₺</p>
                    <div className="ilan-aksiyonlar">
                      <button
                        onClick={() => {
                          setDuzenlenenIlan(ilan);
                          setIlanBaslik(ilan.baslik);
                          setIlanFiyat(ilan.fiyat);
                        }}
                      >
                        Düzenle
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default IlanYonetimi;