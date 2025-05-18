import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AnaSayfa from './AnaSayfa';
import GirisPaneli from './GirisPaneli';
import KayitPaneli from './KayitPaneli';
import IlanOlusturma from './ilanolusturma';
import IlanArayuzu from './IlanArayuzu';
import PremiumUyelik from './PremiumUyelik';
import Profiller from './Profiller';
import IlanYonetimi from './IlanYonetimi';
import IlanGuncelleme from './ilanGuncelle';
import SikcaSorulanSorular from './sikcaSorulanSorular';

function App() {
   const [_MEVCUTKULLANICIID, fMevcutKullaniciId] = useState(null);
    useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // exp alanı saniye cinsinden; JS Date.now() milisaniye cinsinden
        if (payload.exp * 1000 > Date.now()) {
          fMevcutKullaniciId(payload.kullaniciid);
        } else {
          // Süresi dolmuş token'ı temizle
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/anasayfa" />} />
          <Route path="/anasayfa" element={<AnaSayfa/>} />
          <Route path="/giris" element={<GirisPaneli onLoginSuccess={fMevcutKullaniciId}/>} />
          <Route path="/kayit" element={<KayitPaneli />} />
          <Route path="/ilanolustur" element={<IlanOlusturma />} />
          <Route path="/ilanlar/:ilanid/:baslik" element={<IlanArayuzu />} />
          <Route path="/uyelik" element={<PremiumUyelik />} />
          <Route path="/sss" element={<SikcaSorulanSorular />} />
          <Route path="/profiller/:kullaniciid" element={<Profiller />} />
          <Route path="/ilan-yonetimi/:kullaniciid" element={<IlanYonetimi />} />
          <Route path="/ilanguncelle/:ilanId" element={<IlanGuncelleme/>}/>
        </Routes>
    </Router>
  );
}

export default App;
