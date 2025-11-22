import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './src/index.css';
import RealEstateSite from './site.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <RealEstateSite />
    </HelmetProvider>
  </React.StrictMode>
);

