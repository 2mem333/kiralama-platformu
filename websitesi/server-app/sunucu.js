const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL bağlantısı
const pool = new Pool({
  user: 'postgres', //postgre adı
  host: 'localhost',
  database: 'kullanicilar_db',
  password: '1337', //postgre sifre
  port: 5432
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM kullanicilar WHERE eposta = $1 AND sifre = $2;', [email, password]);

    if (result.rows.length > 0) { //eger sorgu dogru yanit dondururse.
      res.status(200).json({ message: 'dogru' });
    } else {
      res.status(401).json({ message: 'hatali' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası!' });
  }
});

app.post('/api/kayit', async (req, res) => {
  const { eposta, ad,soyad,dogumTarihi,telefon,adres,postaKodu,sifre } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO kullanicilar (eposta, ad, soyad, dogumtarihi, telefon, adres, postakodu, sifre) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [eposta, ad, soyad, dogumTarihi, telefon, adres, postaKodu, sifre]
    );
    
    // Ekleme başarılı olduysa, 200 döndür
    res.status(200).json({ message: 'Kayıt başarıyla oluşturuldu' });
  
  } catch (error) {
    console.error(error);
  
    // Eğer hata UNIQUE kısıtlaması ile ilgiliyse (email ya da telefon numarası çakışması)
    if (error.code === '23505') { // 23505 PostgreSQL hata kodu, unique constraint ihlali
      res.status(401).json({ message: 'Email veya telefon numarası zaten mevcut!' });
    } else {
      // Diğer sunucu hataları için
      res.status(500).json({ message: 'Sunucu hatası!' });
    }
  }
});


app.listen(port,() => {
  console.log(`Server running at http://localhost:${port}`);
});
