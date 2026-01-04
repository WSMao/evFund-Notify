import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { PlanUpdates } from './pages/PlanUpdates';
import { CertificatesPage } from './pages/Certificates';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/updates" element={<PlanUpdates />} />
        <Route path="/certificates" element={<CertificatesPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
