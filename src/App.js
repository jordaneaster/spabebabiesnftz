import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { dark } from './styles/Themes';
import { loadSolanaWeb3 } from './utils/solanaWeb3Helper';
import { UserAuthProvider } from './context/UserAuthContext';
import ScrollToTop from './components/ScrollToTop';

// Import pages
import HomePage from './pages/HomePage';
import Etherland from './pages/Etherland';
import Astroverse from './pages/Astroverse';
import Profile from './pages/Profile';

function App() {
  // Load Solana Web3 when app starts
  useEffect(() => {
    loadSolanaWeb3().catch(err => {
      console.warn("Could not load Solana Web3:", err);
    });
  }, []);

  return (
    <ThemeProvider theme={dark}>
      <GlobalStyles />
      <UserAuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/etherland" element={<Etherland />} />
            <Route path="/astroverse" element={<Astroverse />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </UserAuthProvider>
    </ThemeProvider>
  );
}

export default App;