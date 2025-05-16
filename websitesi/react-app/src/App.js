import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AnaSayfa from './AnaSayfa';
import GirisPaneli from './GirisPaneli';
import KayitPaneli from './KayitPaneli';
import IlanOlusturma from './ilanolusturma';
import IlanArayuzu from './IlanArayuzu';
import PremiumUyelik from './PremiumUyelik';
import Profiller from './Profiller';
import IlanYonetimi from './IlanYonetimi';

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
        <Route path="/uyelik" element={<PremiumUyelik />} /> 
        <Route path="/profiller/:kullaniciid/" element={<Profiller/>} />
        <Route path="/ilan-yonetimi/:kullaniciid" element={<IlanYonetimi />} />
      </Routes>
    </Router>
  );
}

export default App;
