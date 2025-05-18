//chcp 1254
/*
CREATE DATABASE ilanlar_db
WITH 
    ENCODING 'UTF8'
    LOCALE_PROVIDER = 'icu'
    ICU_LOCALE = 'tr-TR'
    TEMPLATE template0;
*/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken'); //token olusturur
const SECRET_KEY = '1337';


const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
//???
app.use(express.json({ extended: true }));
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});
//????

const sha256 = async(metin) => {
  const msgBuffer = new TextEncoder().encode(metin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// PostgreSQL bağlantısı
const pool = new Pool({
  user: 'postgres', //postgre adı
  host: 'localhost',
  database: 'kullanicilar_db',
  password: '1337', //postgre sifre
  port: 5432
});

// PostgreSQL bağlantısı
const pool2 = new Pool({
  user: 'postgres', //postgre adı
  host: 'localhost',
  database: 'ilanlar2_db',
  password: '1337', //postgre sifre
  port: 5432,
  client_encoding: 'UTF8'
});

const pool_pd = new Pool({
  user: 'postgres', //postgre adı
  host: 'localhost',
  database: 'profildegerlendirmeleri_db',
  password: '1337', //postgre sifre
  port: 5432,
  client_encoding: 'UTF8'
});

const pool_ilanyorumlari = new Pool({
  user: 'postgres', //postgre adı
  host: 'localhost',
  database: 'ilanyorumlari_db',
  password: '1337', //postgre sifre
  port: 5432,
  client_encoding: 'UTF8'
});

const pool_profil = new Pool({
  user: 'postgres', //postgre adı
  host: 'localhost',
  database: 'profilonizlemesi_db',
  password: '1337', //postgre sifre
  port: 5432,
  client_encoding: 'UTF8'
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const hashSifre = await sha256(password);
  try {
    const result = await pool.query('SELECT * FROM kullanicilar WHERE eposta = $1 AND sifre = $2;', [email, hashSifre]);
    const kullanici = result.rows[0]; // ilk satır

    if (result.rows.length > 0) { //eger sorgu dogru yanit dondururse.
      const token = jwt.sign({ kullaniciid: kullanici.id }, SECRET_KEY, { expiresIn: '24h' });
      console.log(kullanici.eposta);
      console.log(kullanici.id);
      res.status(200).json({ message: 'dogru', token: token});
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
  const hashSifre = await sha256(sifre);
  try {
    const result = await pool.query(
      'INSERT INTO kullanicilar (eposta, ad, soyad, dogumtarihi, telefon, adres, postakodu, sifre) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [eposta, ad, soyad, dogumTarihi, telefon, adres, postaKodu, hashSifre]
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

app.post('/api/profilidegerlendir', async (req, res) => {
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

//kullanicilar
app.get('/api/profiller', async (req, res) => {
  let { kullaniciid } = req.query;
  
  let query = 'SELECT * FROM kullanicilar';
  let values = [];
  let conditions = [];

  if (kullaniciid) {
    conditions.push(`id = $${values.length + 1}`);
    values.push(kullaniciid);
  }

  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  try {
    const result = await pool.query(query, values);
    console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Veri çekilirken hata oluştu:', error);
    res.status(500).json({ error: 'Veri çekilirken hata oluştu' });
  }
});

app.get('/api/ilanlar', async (req, res) => {
  let { arama, kategori, siralama,limit,ilanid,sahipid } = req.query;
  
  let query = 'SELECT * FROM ilanlar';
  let values = [];
  let conditions = [];

  // Metin araması filtresi
  if (arama) {
    conditions.push(`baslik ILIKE $${values.length + 1}`);
    values.push(`%${arama}%`);
  }

  if (ilanid) {
    conditions.push(`ilanid = $${values.length + 1}`);
    values.push(ilanid);
  }

  if (sahipid) {
    conditions.push(`sahipid = $${values.length + 1}`);
    values.push(sahipid);
  }

  // Kategori filtresi
  if (kategori && kategori !== 'Tüm Kategoriler') {
    conditions.push(`kategori = $${values.length + 1}`);
    values.push(kategori);
  }

  // Eğer filtreleme yapıldıysa WHERE ekle
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  // Sıralama kısmı
  if (siralama === 'fiyat-artan') {
    query += ' ORDER BY fiyat ASC';
  } else if (siralama === 'fiyat-azalan') {
    query += ' ORDER BY fiyat DESC';
  } else if (siralama === 'en-yeni') {
    query += ' ORDER BY tarih DESC';
  }

  if (limit) {
    query += ` LIMIT $${values.length + 1}`;
    values.push(limit);  // Limit parametresini values array'ine ekliyoruz
  }

  try {

    const result = await pool2.query(query, values);
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error('Veri çekilirken hata oluştu:', error);
    res.status(500).json({ error: 'Veri çekilirken hata oluştu' });
  }
});

app.get('/api/degerlendirmeler', async (req, res) => {
  let { degerlendirilen_id,limit } = req.query;
  
  let query = 'SELECT * FROM degerlendirmeler';
  let values = [];
  let conditions = [];

  if (degerlendirilen_id) {
    conditions.push(`degerlendirilen_id = $${values.length + 1}`);
    values.push(degerlendirilen_id);
  }

  // Eğer filtreleme yapıldıysa WHERE ekle
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

 if (limit) {
    query += ` LIMIT $${values.length + 1}`;
    values.push(limit);  // Limit parametresini values array'ine ekliyoruz
  }

  try {

    const result = await pool_pd.query(query, values);
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error('Veri çekilirken hata oluştu:', error);
    res.status(500).json({ error: 'Veri çekilirken hata oluştu' });
  }
});

app.post('/api/ilanolustur', async (req, res) => {
  const { baslik, fiyat,konum,resim,durum,aciklama,tarih,sahipid} = req.body;
  console.log('Baslik:', baslik);
  console.log('Fiyat:', fiyat);
  console.log('Konum:', konum);
  console.log('Resim:', resim);
  console.log('Durum:', durum);
  console.log('Aciklama:', aciklama);
  console.log('Tarih:', tarih);
  
  try {
    const result = await pool2.query(
      'INSERT INTO ilanlar (baslik, fiyat, lokasyon, resim, durum, aciklama, tarih,sahipid) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)',
      [baslik, fiyat,konum,resim,durum,aciklama,tarih,sahipid]
    );
    
    // Ekleme başarılı olduysa, 200 döndür
    res.status(200).json({ message: 'İlan başarıyla oluşturuldu' });
  
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

//profil onizlemesi
app.get('/api/profil', async (req, res) => {
  let { sahipid } = req.query;
  
  let query = 'SELECT * FROM profilonizlemesi';
  let values = [];
  let conditions = [];

  if (sahipid) {
    console.log("aktifff");
    conditions.push(`sahipid = $${values.length + 1}`);
    values.push(sahipid);
  }

  // Eğer filtreleme yapıldıysa WHERE ekle
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  try {

    const result = await pool_profil.query(query, values);
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error('Veri çekilirken hata oluştu:', error);
    res.status(500).json({ error: 'Veri çekilirken hata oluştu' });
  }
});

app.get('/api/ilanyorumlari', async (req, res) => {
  let { ilanid,limit } = req.query;
  
  let query = 'SELECT * FROM ilanyorumlari';
  let values = [];
  let conditions = [];

  if (ilanid) {
    conditions.push(`ilanid = $${values.length + 1}`);
    values.push(ilanid);
  }

  // Eğer filtreleme yapıldıysa WHERE ekle
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

 if (limit) {
    query += ` LIMIT $${values.length + 1}`;
    values.push(limit);  // Limit parametresini values array'ine ekliyoruz
  }

  try {

    const result = await pool_ilanyorumlari.query(query, values);
    res.json(result.rows);
    console.log("İlan yorumlari: ");
    console.log(result.rows);
  } catch (error) {
    console.error('Veri çekilirken hata oluştu:', error);
    res.status(500).json({ error: 'Veri çekilirken hata oluştu' });
  }
});

app.post('/api/ilanyorumlari', async (req, res) => {
  const { sahipid,yorum,ilanid } = req.body;

  try {
    const result = await pool_ilanyorumlari.query(
      'INSERT INTO ilanyorumlari (sahipid, yorum, ilanid) VALUES ($1, $2, $3)',
      [sahipid,yorum,ilanid]
    );
    
    // Ekleme başarılı olduysa, 200 döndür
    res.status(200).json({ message: 'Kayıt başarıyla oluşturuldu' });
  
  } catch (error) {
    console.error(error);
  
    // Eğer hata UNIQUE kısıtlaması ile ilgiliyse (email ya da telefon numarası çakışması)
    if (error.code === '23505') { // 23505 PostgreSQL hata kodu, unique constraint ihlali
      res.status(401).json({ message: 'Zaten yorum yapilmis' });
    } else {
      // Diğer sunucu hataları için
      res.status(500).json({ message: 'Sunucu hatası!' });
    }
  }
});

app.listen(port,() => {
  console.log(`Server running at http://localhost:${port}`);
});
