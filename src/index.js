import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { GlobalStyles } from './GlobalStyled.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>
);
