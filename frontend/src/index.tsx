import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App';
import { store } from './redux/store';
import { Provider } from 'react-redux';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
