import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AnaSayfa from './AnaSayfa';
import GirisPaneli from './GirisPaneli';
import KayitPaneli from './KayitPaneli';

function App() {
  return (
    <Router>
      <Routes>
        {/* "/" adresine girince otomatik olarak "/anasayfa"ya yönlendir */}
        <Route path="/" element={<Navigate to="/anasayfa" />} />
        <Route path="/anasayfa" element={<AnaSayfa />} />
        <Route path="/giris" element={<GirisPaneli />} />
        <Route path="/kayit" element={<KayitPaneli />} />
      </Routes>
    </Router>
  );
}

export default App;
