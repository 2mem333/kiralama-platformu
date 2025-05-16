import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UstCubuk2 from './UstCubukProfil';
import './IlanYonetimi.css';
import moment from 'moment'; // Tarih işlemleri için

function IlanYonetimi() {
  const { kullaniciid } = useParams();
  const navigate = useNavigate();
  const [ilanlar, setIlanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [duzenlenenIlan, setDuzenlenenIlan] = useState(null);
  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    fiyat: '',
    bitisTarihi: ''
  });

  const placeholderImage = "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png";

  // ── ① parseResimler fonksiyonu ─────────────────────────────
  const parseResimler = (resimString) => {
    try {
      const cleaned = resimString
        .replace(/\\+/g, '')                       // backslash'leri temizle
        .replace(/^\{\s*"?|"?\s*\}$/g, '');       // baştaki { ve sondaki } işaretlerini çıkar

      return cleaned
        .split(',')
        .map(url => url.trim().replace(/^"|"$/g, ''))
        .filter(url => url.length > 0);
    } catch (e) {
      console.error('Resim parse hatası:', e);
      return [];
    }
  };

  // ── ② İlanları çekerken parse et ────────────────────────────
  useEffect(() => {
    const fetchIlanlar = async () => {
      try {
        const params = new URLSearchParams({ sahipid: kullaniciid });
        const response = await fetch(`http://localhost:5000/api/ilanlar?${params}`);
        if (!response.ok) throw new Error('Veri alınamadı');
        const data = await response.json();

        const mapped = data.map(ilan => {
          const resimler = ilan.resim ? parseResimler(ilan.resim) : [];
          return {
            ...ilan,
            resimler: resimler.length ? resimler : [placeholderImage],
            olusturulmaTarihi: moment(ilan.olusturulmaTarihi).format('DD.MM.YYYY'),
            kalanSure: moment(ilan.bitisTarihi).diff(moment(), 'days') + ' gün'
          };
        });

        setIlanlar(mapped);
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
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Güncelleme başarısız');
      
      const updatedIlan = await response.json();
      setIlanlar(ilanlar.map(ilan => 
        ilan.ilanid === updatedIlan.ilanid ? {
          ...updatedIlan,
          olusturulmaTarihi: moment(updatedIlan.olusturulmaTarihi).format('DD.MM.YYYY'),
          kalanSure: moment(updatedIlan.bitisTarihi).diff(moment(), 'days') + ' gün'
        } : ilan
      ));
      setDuzenlenenIlan(null);
      alert('İlan başarıyla güncellendi!');
    } catch (err) {
      setError(err.message);
    }
  };

  // Form input değişiklikleri
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Görsel URL'sini işleme
  const getImageUrl = (resimler) => {
    if (!resimler || resimler.length === 0) return placeholderImage;
    return resimler[0]; // İlk resmi göster
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
                    name="baslik"
                    value={formData.baslik}
                    onChange={handleChange}
                    placeholder="İlan Başlığı"
                    required
                  />
                  <textarea
                    name="aciklama"
                    value={formData.aciklama}
                    onChange={handleChange}
                    placeholder="Açıklama"
                    required
                  />
                  <input
                    type="number"
                    name="fiyat"
                    value={formData.fiyat}
                    onChange={handleChange}
                    placeholder="Günlük Fiyat"
                    required
                  />
                  <input
                    type="date"
                    name="bitisTarihi"
                    value={formData.bitisTarihi}
                    onChange={handleChange}
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
                  <div className="ilan-resimler">
                     {ilan.resimler.map((src, index) => (
                      <img
                        key={index}
                        src={src}                        // doğru alan: src zaten doğrudan URL
                       alt={`${ilan.baslik} ${index+1}`}
                       onError={e => { e.target.onerror = null; e.target.src = placeholderImage; }}
                      />
                     ))}
                  </div>
                  <div className="ilan-bilgileri">
                    <div className="ilan-meta">
                      <span>Oluşturulma: {ilan.olusturulmaTarihi}</span>
                      <span>Kalan Süre: {ilan.kalanSure}</span>
                    </div>
                    <h3>{ilan.baslik}</h3>
                    <p className="aciklama">{ilan.aciklama}</p>
                    <div className="ilan-fiyat">
                      {ilan.fiyat}₺
                    </div>
                    <div className="ilan-aksiyonlar">
                      <button
                        onClick={() => {
                          setDuzenlenenIlan(ilan);
                          setFormData({
                            baslik: ilan.baslik,
                            aciklama: ilan.aciklama,
                            fiyat: ilan.fiyat,
                            bitisTarihi: moment(ilan.bitisTarihi).format('YYYY-MM-DD')
                          });
                        }}
                      >
                        İlanı Güncelle
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