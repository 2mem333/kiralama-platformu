import React, { useState } from 'react';
import './sikcaSorulanSorular.css';

//--------------------JAVASCRIPT KODLARI BAŞLANGIÇ-----------------------
function SikcaSorulanSorular() {
  // Tüm soru ve cevapları içeren state
  const [sorular, sorularAyarla] = useState([
    {
      id: 1,
      soru: "Nasıl üye olabilirim?",
      cevap: "Üye olmak için ana sayfadaki 'Üye Ol' butonuna tıklayarak gerekli formu doldurabilirsiniz. E-posta adresinizi onayladıktan sonra hesabınız aktif olacaktır.",
      acik: false
    },
    {
      id: 2,
      soru: "Ödeme seçenekleri nelerdir?",
      cevap: "Ödemeler ürün sahibi ile kiracı arasındadır. Platformumuz aracı değildir.",
      acik: false
    },
    {
      id: 3,
      soru: "İlan nasıl yayınlarım?",
      cevap: "İlan yayınlamak için önce üye olmanız gerekiyor. Üye girişi yaptıktan sonra, 'İlan Yayınla' butonuna tıklayarak formu doldurabilir ve ilanınızı yayınlayabilirsiniz. Detaylı açıklama ve kaliteli fotoğraflar eklemeniz tavsiye edilir.",
      acik: false
    },
    {
      id: 4,
      soru: "İade ve iptal koşulları nelerdir?",
      cevap: "İade ve iptal koşulları her satıcının kendi belirlediği politikalara göre değişiklik gösterebilir. İlan detay sayfasında bu bilgileri görebilirsiniz. Genel olarak, teslimat sonrası 14 gün içinde iade talebinde bulunabilirsiniz.",
      acik: false
    },
    {
      id: 5,
      soru: "İlan süresi ne kadardır?",
      cevap: "Standart ilanlar 30 gün boyunca yayında kalır. Premium üyeler 60 güne kadar ilan süresi uzatabilir. İlan süreniz dolmadan önce yenileme seçeneğini kullanarak süreyi uzatabilirsiniz.",
      acik: false
    },
    {
      id: 6,
      soru: "Güvenli alışveriş için nelere dikkat etmeliyim?",
      cevap: "Güvenli alışveriş için; satıcı değerlendirmelerini okuyun, kişisel bilgilerinizi özel mesajlarda paylaşmayın, ürünü görmeden ödeme yapmaktan kaçının ve platformun sunduğu güvenli ödeme yöntemlerini kullanın. Şüpheli bir durumla karşılaştığınızda hemen müşteri hizmetlerimizle iletişime geçin.",
      acik: false
    },
    {
      id: 7,
      soru: "Üyelik ücretli mi?",
      cevap: "Temel üyelik ücretsizdir. Premium üyelik seçenekleri farklı fiyatlarla sunulmaktadır. Premium üyelik ile öne çıkan ilanlar, detaylı istatistikler ve daha uzun ilan süreleri gibi avantajlardan yararlanabilirsiniz.",
      acik: false
    },
    {
      id: 8,
      soru: "Sorun yaşarsam kiminle iletişime geçebilirim?",
      cevap: "Herhangi bir sorun yaşamanız durumunda 'Yardım ve Destek' sayfamızdaki iletişim formunu kullanabilir, destek@ornek.com adresine e-posta gönderebilir veya 0850 123 45 67 numaralı müşteri hizmetleri hattımızı arayabilirsiniz.",
      acik: false
    }
  ]);

  // Arama için state
  const [aramaMetni, aramaMetniAyarla] = useState('');
  
  // Kategori seçimi için state
  const [aktifKategori, aktifKategoriAyarla] = useState('tumu');
  
  // Kategoriler
  const kategoriler = [
    { id: 'tumu', baslik: 'Tüm Sorular' },
    { id: 'uyelik', baslik: 'Üyelik' },
    { id: 'odeme', baslik: 'Ödeme' },
    { id: 'ilan', baslik: 'İlanlar' },
    { id: 'guvenlik', baslik: 'Güvenlik' }
  ];

  // SSS açma/kapama fonksiyonu
  const soruGosterGizle = (id) => {
    sorularAyarla(sorular.map(soru => 
      soru.id === id ? { ...soru, acik: !soru.acik } : soru
    ));
  };

  // Arama fonksiyonu
  const aramaYap = (e) => {
    aramaMetniAyarla(e.target.value);
  };

  // Soruları filtrele
  const filtrelenmisSSS = sorular.filter(soru => {
    // Arama metni filtresi
    const aramaSonucu = soru.soru.toLowerCase().includes(aramaMetni.toLowerCase()) || 
                          soru.cevap.toLowerCase().includes(aramaMetni.toLowerCase());
    
    // Kategori filtresi (şu an aktif değil, gerçek uygulamada kategori verisi ile ilişkilendirilmeli)
    const kategoriSonucu = aktifKategori === 'tumu' ? true : 
      // Örnek kategori eşleşmesi - gerçek verilere göre uyarlanmalı
      (aktifKategori === 'uyelik' && (soru.id === 1 || soru.id === 7)) ||
      (aktifKategori === 'odeme' && (soru.id === 2 || soru.id === 4)) ||
      (aktifKategori === 'ilan' && (soru.id === 3 || soru.id === 5)) ||
      (aktifKategori === 'guvenlik' && (soru.id === 6 || soru.id === 8));
      
    return aramaSonucu && kategoriSonucu;
  });
//-----------------JAVASCRIPT KODLARI BİTİŞ------------------

//-------------------JSX BLOĞU BAŞLANGIÇ-----------------------------
  return (
    <div className="sss-container">
      <div className="sss-header">
        <h1>Sıkça Sorulan Sorular</h1>
        <p>Platformumuz hakkında merak edilen sorular ve yanıtları</p>
      </div>

      {/* Arama ve Filtreleme Bölümü */}
      <div className="sss-filtre-alani">
        <div className="arama-kutusu">
          <input
            type="text"
            placeholder="Soru veya cevap ara..."
            value={aramaMetni}
            onChange={aramaYap}
          />
          <span className="arama-ikonu">🔍</span>
        </div>
        
        <div className="kategori-secimi">
          {kategoriler.map(kategori => (
            <button
              key={kategori.id}
              className={`kategori-buton ${aktifKategori === kategori.id ? 'aktif' : ''}`}
              onClick={() => aktifKategoriAyarla(kategori.id)}
            >
              {kategori.baslik}
            </button>
          ))}
        </div>
      </div>

      {/* Soru Listesi */}
      <div className="sss-liste">
        {filtrelenmisSSS.length > 0 ? (
          filtrelenmisSSS.map(soru => (
            <div key={soru.id} className={`sss-kart ${soru.acik ? 'acik' : ''}`}>
              <div className="sss-soru" onClick={() => soruGosterGizle(soru.id)}>
                <h3>{soru.soru}</h3>
                <span className="ikon-toggle">{soru.acik ? '−' : '+'}</span>
              </div>
              {soru.acik && (
                <div className="sss-cevap">
                  <p>{soru.cevap}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="sonuc-yok">
            <p>Aramanızla eşleşen soru bulunamadı.</p>
            <button onClick={() => {aramaMetniAyarla(''); aktifKategoriAyarla('tumu');}}>
              Tüm Soruları Göster
            </button>
          </div>
        )}
      </div>

      {/* İletişim Bölümü */}
      <div className="sss-iletisim">
        <h3>Sorularınıza cevap bulamadınız mı?</h3>
        <p>Müşteri hizmetlerimizle iletişime geçin, size yardımcı olalım!</p>
        <div className="iletisim-butonlar">
          <button className="iletisim-buton eposta">E-posta Gönder</button>
          <button className="iletisim-buton telefon">Bizi Arayın</button>
        </div>
      </div>
    </div>
  );
}
//-----------------------JSX BLOĞU BİTİŞ------------------------

export default SikcaSorulanSorular;