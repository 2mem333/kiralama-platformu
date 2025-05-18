import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import UstCubuk from "./UstCubuk"; // UstCubuk bileşenini import ediyoruz
import "./ilanGuncelle.css";

export default function EditListing() {
  // Arama işlevi için state ekleyelim (UstCubuk için gerekli)
  const [aramaMetni, setAramaMetni] = useState("");
  
  // Kullanıcı ID (örnek olarak)
  const kullaniciId = "user123"; // Gerçek uygulamada bu değer kimlik doğrulama sisteminden alınacak
  
  // Arama metni değiştiğinde çalışacak fonksiyon
  const handleAramaChange = (e) => {
    setAramaMetni(e.target.value);
    // Gerçek uygulamada burada arama işlemini yapabilirsiniz
  };

  // Demo için varsayılan olarak mevcut resimleri ekleyelim (gerçek uygulamada bunlar API'den gelecek)
  const existingImages = [
    { id: 1, url: "/api/placeholder/400/320", name: "Mevcut Resim 1" },
    { id: 2, url: "/api/placeholder/400/320", name: "Mevcut Resim 2" },
  ];

  const [formData, setFormData] = useState({
    type: "rent", // 'rent' or 'sale'
    name: "Örnek İlan Başlığı", // Demo için varsayılan değerler
    category: "Daire",
    status: "Aktif",
    bedrooms: 2,
    bathrooms: 1,
    parking: false,
    furnished: true,
    address: "",
    description: "Örnek ilan açıklaması. Bu bir demo içeriğidir.",
    offer: false,
    dailyPrice: 150,
    weeklyPrice: 750,
    monthlyPrice: 3000,
    images: [],
  });

  const {
    type,
    name,
    category,
    status,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    dailyPrice,
    weeklyPrice,
    monthlyPrice,
    images,
  } = formData;

  // Mevcut yüklenen resimleri önizleme için yönetiyoruz
  const [imageFiles, setImageFiles] = useState([]); // Yeni yüklenen dosyalar
  const [previewUrls, setPreviewUrls] = useState([]); // Yeni yüklenen dosyaların önizlemeleri
  const [currentImages, setCurrentImages] = useState(existingImages); // Mevcut resimler

  // Toplam resim sayısını hesapla
  const totalImageCount = currentImages.length + previewUrls.length;
  const maxImages = 5;

  // Resim sayısı sınırı kontrolü
  const canAddMoreImages = totalImageCount < maxImages;

  const onChange = (e) => {
    let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Resim sayısı kontrolü
    const availableSlots = maxImages - totalImageCount;
    if (selectedFiles.length > availableSlots) {
      alert(`En fazla ${maxImages} resim ekleyebilirsiniz. Şu anda ${availableSlots} resim daha ekleyebilirsiniz.`);
      // Seçilen dosyaları ayarla
      const allowedFiles = selectedFiles.slice(0, availableSlots);
      
      // Yeni yüklenen dosyaları mevcut dosyalara ekle
      setImageFiles((prevFiles) => [...prevFiles, ...allowedFiles]);
      
      // Önizleme URL'leri oluştur
      const newImageUrls = allowedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newImageUrls]);
      
      // Form verilerinde images dizisini güncelle
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...allowedFiles],
      }));
    } else {
      // Yeni yüklenen dosyaları mevcut dosyalara ekle
      setImageFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
      
      // Önizleme URL'leri oluştur
      const newImageUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newImageUrls]);
      
      // Form verilerinde images dizisini güncelle
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...selectedFiles],
      }));
    }
  };

  // Yeni yüklenen bir resmi kaldır
  const removeNewImage = (index) => {
    // Seçilen resmi dizilerden kaldır
    const newImageFiles = [...imageFiles];
    const newPreviewUrls = [...previewUrls];
    
    // URL'i serbest bırak (memory leak'i önlemek için)
    URL.revokeObjectURL(previewUrls[index]);
    
    newImageFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setImageFiles(newImageFiles);
    setPreviewUrls(newPreviewUrls);
    
    // Form verilerindeki images dizisini güncelle
    setFormData((prev) => ({
      ...prev,
      images: newImageFiles,
    }));
  };
  
  // Mevcut bir resmi kaldır
  const removeExistingImage = (id) => {
    // Gerçek uygulamada burada API çağrısı yapılır
    // Şimdilik sadece UI'dan kaldırıyoruz
    const updatedImages = currentImages.filter(img => img.id !== id);
    setCurrentImages(updatedImages);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Tüm resimleri (mevcut ve yeni) birleştir
    const allImages = [
      ...currentImages.map(img => img.url), // Mevcut resimler
      ...images // Yeni yüklenen resimler
    ];
    
    // Burada veritabanına veri gönderme kodları olurdu.
    console.log("Gönderilecek formData:", {...formData, images: allImages});
    alert("İlan güncellendi (demo)");
  };

  const onDelete = () => {
    if (window.confirm("İlanı silmek istediğinize emin misiniz?")) {
      // Silme işlemi burada olurdu
      alert("İlan silindi (demo)");
    }
  };

  // Kategoriler
  const categories = [
  "Elektronik","Ev eşyaları","Bahçe Aletleri","Spor Ekipmanları",
  "Müzik Aletleri","Oyunlar","Kitaplar",
  ];

  // Durum seçenekleri
  const statuses = [
    'Sıfır ayarında', 'Yeni gibi', 'Az kullanılmış', 'Orta',
    'Biraz eski', 'Eski'
  ];

  return (
    <div className="app-container">
      {/* Üst çubuğu ekliyoruz */}
      <UstCubuk 
        aramaMetni={aramaMetni} 
        onAramaChange={handleAramaChange}
        kullaniciId={kullaniciId}
      />
      
      <div className="listing-update-container">
        <h1 className="form-title">İlan bilgilerini güncelle</h1>
        
        <form onSubmit={onSubmit}>
          {/* Resim Yükleme Alanı */}
          <div className="photos-section">
            <h2 className="section-title">Fotoğraflar ({totalImageCount}/{maxImages})</h2>
            
            {canAddMoreImages && (
              <div className="image-upload-container" onClick={() => document.getElementById('fileInput').click()}>
                <p>Fotoğrafları buraya sürükleyin veya eklemek için tıklayın</p>
                <input
                  id="fileInput"
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <div className="upload-help-text">
                  En fazla {maxImages} resim yükleyebilirsiniz. Şu anda {maxImages - totalImageCount} resim daha ekleyebilirsiniz.
                </div>
              </div>
            )}
            
            {!canAddMoreImages && (
              <div className="image-limit-warning">
                Maksimum resim sayısına ulaştınız. Yeni resim eklemek için önce bazı resimleri silmelisiniz.
              </div>
            )}
            
            {/* Mevcut Resimler ve Önizlemeler */}
            <div className="all-images-container">
              {/* Mevcut Resimler */}
              {currentImages.length > 0 && (
                <div className="image-section">
                  <h3>Mevcut Resimler</h3>
                  <div className="image-preview-grid">
                    {currentImages.map((img) => (
                      <div key={img.id} className="image-preview-item">
                        <img 
                          src={img.url} 
                          alt={img.name} 
                          className="preview-image"
                        />
                        <button
                          type="button"
                          className="remove-image-button"
                          onClick={() => removeExistingImage(img.id)}
                        >
                          Kaldır
                        </button>
                        <div className="image-name">{img.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Yeni Yüklenen Resimler */}
              {previewUrls.length > 0 && (
                <div className="image-section">
                  <h3>Yeni Yüklenen Resimler</h3>
                  <div className="image-preview-grid">
                    {previewUrls.map((url, index) => (
                      <div key={`new-${index}`} className="image-preview-item">
                        <img 
                          src={url} 
                          alt={`Yeni Resim ${index + 1}`} 
                          className="preview-image"
                        />
                        <button
                          type="button"
                          className="remove-image-button"
                          onClick={() => removeNewImage(index)}
                        >
                          Kaldır
                        </button>
                        <div className="image-name">Yeni Resim {index + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* İlan Adı */}
          <div className="form-group">
            <label className="form-label">
              İlan adı <span className="required-mark">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              className="form-input"
              placeholder="İlan başlığını girin"
            />
          </div>
          
          {/* Açıklama */}
          <div className="form-group">
            <label className="form-label">
              Açıklama <span className="required-mark">*</span>
            </label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              required
              className="form-textarea"
              placeholder="İlan açıklamasını girin"
            />
            <div className="char-counter">
              <span className="char-count">{description.length} / 1000</span>
            </div>
          </div>
          
          {/* Kategori */}
          <div className="form-group">
            <label className="form-label">
              Kategori <span className="required-mark">*</span>
            </label>
            <select
              name="category"
              value={category}
              onChange={onChange}
              required
              className="form-select"
            >
              <option value="" disabled>Kategori seçin</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
            {/* Durum */}
            <div className="form-group">
              <label className="form-label">
                Durum <span className="required-mark">*</span>
              </label>
              <select
                name="status"
                value={status}
                onChange={onChange}
                required
                className="form-select"
              >
                <option value="" disabled>Durum seçin</option>
                {statuses.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

      
          {/* Fiyat Bilgileri */}
          <div className="price-section">
            <h2>Fiyatları güncelle</h2>
            <div className="price-grid">
              <div className="form-group">
                <label className="form-label">Günlük</label>
                <input
                  type="number"
                  name="dailyPrice"
                  value={dailyPrice}
                  onChange={onChange}
                  min="0"
                  className="form-input"
                  placeholder="0 ₺"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Haftalık</label>
                <input
                  type="number"
                  name="weeklyPrice"
                  value={weeklyPrice}
                  onChange={onChange}
                  min="0"
                  className="form-input"
                  placeholder="0 ₺"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Aylık</label>
                <input
                  type="number"
                  name="monthlyPrice"
                  value={monthlyPrice}
                  onChange={onChange}
                  min="0"
                  className="form-input"
                  placeholder="0 ₺"
                />
              </div>
            </div>
          </div>
          
          {/* Form Butonları */}
          <div className="form-actions">
            <button 
              type="button" 
              className="delete-button"
              onClick={onDelete}
            >
              İlanı Sil
            </button>
            <div className="right-buttons">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => window.history.back()}
              >
                Vazgeç
              </button>
              <button 
                type="submit" 
                className="update-button"
              >
                İlanı Güncelle
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}