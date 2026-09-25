import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root')!;
// Prerendered pages ship real markup, so hydrate over it instead of clearing and re-rendering
// (avoids a content flash and keeps the page usable/crawlable even before JS finishes loading).
hydrateRoot(
  root,
  <StrictMode>
    <App />
  </StrictMode>,
);
