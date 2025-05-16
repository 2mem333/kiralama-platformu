import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AnaSayfa from './AnaSayfa';
import GirisPaneli from './GirisPaneli';
import KayitPaneli from './KayitPaneli';
import IlanOlusturma from './ilanolusturma';
import Profil from './ProfilSayfa'; // Profil sayfasının doğru yolu
import KullaniciProfil from './KullaniciProfil';
import IlanArayuzu from './IlanArayuzu';

function App() {
  return (
    <Router>
      <Routes>
        {/* "/" adresine girince otomatik olarak "/anasayfa"ya yönlendir */}
        <Route path="/" element={<Navigate to="/anasayfa" />} />
        <Route path="/anasayfa" element={<AnaSayfa />} />
        <Route path="/giris" element={<GirisPaneli />} />
        <Route path="/kayit" element={<KayitPaneli />} />
        <Route path="/ilanolustur" element={<IlanOlusturma/>} />
        <Route path="/ilanlar/:ilanid/:baslik" element={<IlanArayuzu />} />
        <Route path="/profil" element={<Profil />} /> {/* Profil sayfası */}
        <Route path="/kullaniciprofil" element={<KullaniciProfil />} /> 
      </Routes>
    </Router>
  );
}

export default App;
