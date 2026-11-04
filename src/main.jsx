import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Newsreader with optical-size axis (opsz) so display sizes get the finer cut.
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';

import './styles/tokens.css';
import './styles/base.css';
import App from './App.jsx';

if (import.meta.env.DEV) {
  import('./data/validateProducts.js').then((m) => m.default());
}

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
