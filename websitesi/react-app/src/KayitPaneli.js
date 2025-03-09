import React, { useState } from 'react';
import './KayitPaneli.css'; // CSS dosyasının adını da Türkçeleştirdik

const KayitPaneli = ({ girisPaneliYonlendirme }) => {
  const [formVerisi, setFormVerisi] = useState({
    email: '',
    ad: '',
    soyad: '',
    dogumTarihi: '',
    telefonNumarasi: '',
    adres: '',
    postaKodu: '',
    sifre: '',
    dogrulamaSifresi: ''
  });
  const [sifreGoster, setSifreGoster] = useState(false);
  const [hataMesaji, setHataMesaji] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const degerDegistir = (olay) => {
    const { name, value } = olay.target;
    setFormVerisi(oncekiDeger => ({
      ...oncekiDeger,
      [name]: value
    }));
  };

  const kayitOl = async (olay) => {
    olay.preventDefault();
    setHataMesaji('');
    
    // Basit doğrulama
    if (
      !formVerisi.email ||
      !formVerisi.ad ||
      !formVerisi.soyad ||
      !formVerisi.dogumTarihi ||
      !formVerisi.telefonNumarasi ||
      !formVerisi.adres ||
      !formVerisi.postaKodu ||
      !formVerisi.sifre ||
      !formVerisi.dogrulamaSifresi
    ) {
      setHataMesaji('Lütfen tüm alanları doldurun');
      return;
    }
    
    if (formVerisi.sifre !== formVerisi.dogrulamaSifresi) {
      setHataMesaji('Şifreler eşleşmiyor');
      return;
    }
    

    try { //SERVER ILE HABERLESME
      const yanit = await fetch('http://localhost:5000/api/kayit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eposta: formVerisi.email, ad: formVerisi.ad, soyad: formVerisi.soyad, dogumTarihi: formVerisi.dogumTarihi,telefon: formVerisi.telefonNumarasi,adres: formVerisi.adres,postaKodu: formVerisi.postaKodu,sifre: formVerisi.sifre }),
      });
      
      if (yanit.status === 200) {
        setMesaj('Kayıt başarıyla oluşturuldu!');
        setHataMesaji('');
      } else{
        const veri = await yanit.json();
        setHataMesaji(veri.message);
        setMesaj('');
      }
    } catch (hata) {
      setHataMesaji('Sunucuya ulaşılamıyor!');
      setMesaj('');
    }

  };

  
  return (
    <div className="kayit-konteyner">
      <div className="kayit-kart">
        <div className="kayit-baslik">
          <h1>Hesap Oluştur</h1>
          <p>Bilgilerinizi girerek kaydolun</p>
        </div>

        {hataMesaji && (
          <div className="hata-mesaji">
            <span className="hata-ikonu">⚠️</span>
            <span>{hataMesaji}</span>
          </div>
        )}


        {mesaj && (
          <div className="basarili-mesaj">
            <span>{mesaj}</span>
          </div>
        )}


        <form onSubmit={kayitOl}>
          <div className="form-satiri">
            <div className="form-grup">
              <label htmlFor="email">E-posta Adresi*</label>
              <div className="girdi-kapsayici">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formVerisi.email}
                  onChange={degerDegistir}
                  placeholder="ornek@email.com"
                  className="sifre-girdisi"
                />
              </div>
            </div>
          </div>

          <div className="form-satiri">
            <div className="form-grup">
              <label htmlFor="ad">Ad*</label>
              <div className="girdi-kapsayici">
                <input
                  id="ad"
                  name="ad"
                  type="text"
                  value={formVerisi.ad}
                  onChange={degerDegistir}
                  placeholder="Ad"
                  className="sifre-girdisi"
                />
              </div>
            </div>
          </div>

          <div className="form-satiri">
            <div className="form-grup">
              <label htmlFor="soyad">Soyad*</label>
              <div className="girdi-kapsayici">
                <input
                  id="soyad"
                  name="soyad"
                  type="text"
                  value={formVerisi.soyad}
                  onChange={degerDegistir}
                  placeholder="Soyad"
                  className="sifre-girdisi"
                />
              </div>
            </div>
          </div>

          <div className="form-satiri">
            <div className="form-grup">
              <label htmlFor="dogumTarihi">Doğum Tarihi*</label>
              <div className="girdi-kapsayici">
                <input
                  id="dogumTarihi"
                  name="dogumTarihi"
                  type="date"
                  value={formVerisi.dogumTarihi}
                  onChange={degerDegistir}
                  className="sifre-girdisi"
                />
              </div>
            </div>
          </div>

          <div className="form-satiri">
            <div className="form-grup">
              <label htmlFor="telefonNumarasi">Telefon Numarası*</label>
              <div className="girdi-kapsayici">
                <input
                  id="telefonNumarasi"
                  name="telefonNumarasi"
                  type="tel"
                  value={formVerisi.telefonNumarasi}
                  onChange={degerDegistir}
                  placeholder="05XX XXX XX XX"
                  className="sifre-girdisi"
                />
              </div>
            </div>
          </div>

          <div className="form-satiri">
            <div className="form-grup">
              <label htmlFor="adres">Adres*</label>
              <div className="girdi-kapsayici">
                <textarea
                  id="adres"
                  name="adres"
                  value={formVerisi.adres}
                  onChange={degerDegistir}
                  placeholder="Adres bilgilerinizi girin"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="form-satiri">
            <div className="form-grup">
              <label htmlFor="postaKodu">Posta Kodu*</label>
              <div className="girdi-kapsayici">
                <input
                  id="postaKodu"
                  name="postaKodu"
                  type="text"
                  value={formVerisi.postaKodu}
                  onChange={degerDegistir}
                  placeholder="34XXX"
                  className="sifre-girdisi"
                />
              </div>
            </div>
          </div>

          <div className="form-satiri">
            <div className="form-grup">
              <label htmlFor="sifre">Şifre*</label>
              <div className="girdi-kapsayici">
                <input
                  id="sifre"
                  name="sifre"
                  type={sifreGoster ? "text" : "password"}
                  value={formVerisi.sifre}
                  onChange={degerDegistir}
                  placeholder="••••••••"
                  className="sifre-girdisi"
                />
                <button
                  type="button"
                  className="sifre-goster"
                  onClick={() => setSifreGoster(!sifreGoster)}
                >
                  {sifreGoster ? "Gizle" : "Göster"}
                </button>
              </div>
            </div>
          </div>

          <div className="form-satiri">
            <div className="form-grup">
              <label htmlFor="dogrulamaSifresi">Şifre (Tekrar)*</label>
              <div className="girdi-kapsayici">
                <input
                  id="dogrulamaSifresi"
                  name="dogrulamaSifresi"
                  type={sifreGoster ? "text" : "password"}
                  value={formVerisi.dogrulamaSifresi}
                  onChange={degerDegistir}
                  placeholder="••••••••"
                  className="sifre-girdisi"
                />
              </div>
            </div>
          </div>

          <div className="form-grup">
            <button
              type="submit"
              disabled={yukleniyor}
              className="kayit-buton"
            >
              {yukleniyor ? (
                <span className="yukleniyor-yazi">
                  <span className="yukleniyor-spinner"></span>
                  Kaydediliyor...
                </span>
              ) : (
                "Kaydol"
              )}
            </button>
          </div>
        </form>

        <div className="giris-link">
          <p>
            Zaten hesabınız var mı?{' '}
            <button type="button" onClick={girisPaneliYonlendirme}>
              Giriş Yap
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default KayitPaneli;
