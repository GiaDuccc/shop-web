import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import { CssVarsProvider } from '@mui/material/styles';
import theme from './theme.ts';

const rootElement = document.getElementById('root') || null;

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </React.StrictMode>
);
