import React, { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const persistedLists = [
  { key: 'phoenix_studios_profiles_v2', requireItems: true },
  { key: 'phoenix_studios_artworks_v2', requireItems: true },
  { key: 'phoenix_studios_commissions_v2', requireItems: false },
  { key: 'phoenix_studios_orders_v2', requireItems: false }
];

// A stale or incomplete localStorage snapshot should never prevent the app from mounting.
for (const { key, requireItems } of persistedLists) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) continue;
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed) || (requireItems && parsed.length === 0)) {
      localStorage.removeItem(key);
    }
  } catch {
    localStorage.removeItem(key);
  }
}

class AppErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('PhoenixStudios failed to render:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ padding: '2rem', color: '#e4e4e7', background: '#121216', minHeight: '100vh', fontFamily: 'system-ui' }}>
          <h1>PhoenixStudios could not load</h1>
          <p>Refresh the page. If this continues, open the browser console and share this error:</p>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#fbbf24' }}>{this.state.error.message}</pre>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>
);
