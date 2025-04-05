import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import Etherland from './pages/Etherland';
import Astroverse from './pages/Astroverse';
import DashboardPage from './pages/DashboardPage';
import UserProfile from './pages/UserProfile';
import Gallery from './pages/Gallery';
import SpaceBabiezManager from './components/SpaceBabiezManager';
import ContractInteraction from './components/ContractInteraction';
import { UserAuthContextProvider } from './context/UserAuthContext';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { dark } from './styles/Themes';
import { loadSolanaWeb3 } from './utils/solanaWeb3Helper';
import ScrollToTop from './components/ScrollToTop';

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
      <UserAuthContextProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/etherland" element={<Etherland />} />
              <Route path="/astroverse" element={<Astroverse />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/manager" element={<SpaceBabiezManager />} />
              <Route path="/contracts" element={<ContractInteraction />} />
            </Routes>
          </Layout>
        </Router>
      </UserAuthContextProvider>
    </ThemeProvider>
  );
}

export default App;