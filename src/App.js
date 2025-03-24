import GlobalStyles from "./styles/GlobalStyles";
import {dark} from "./styles/Themes";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';

import Navigation from "./components/Navigation";
import About from "./components/sections/About";
import Rm from "./components/sections/Rm";
import Home from "./components/sections/Home";
import Team from "./components/sections/Team";
import Footer from "./components/Footer";
import Showcase from "./components/sections/Showcase";
import Faq from "./components/sections/Faq";
import ScrollToTop from "./components/ScrollToTop";
import Oath from "./components/sections/Oath";
import Astroverse from "./components/sections/Astroverse";
import Etherland from './pages/Etherland';
import UserProfile from './pages/UserProfile';
import Gallery from './pages/Gallery';
import bgr from './assets/media/BGR3.png';
import LevelUpSystem from './components/LevelUpSystem';

// Import the new components
import DashboardPage from './pages/DashboardPage';
import CommunityHub from './components/CommunityHub';

// Define the styled components needed for MetroVerse route
const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${props => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Container = styled.div`
  width: 80%;
  max-width: 1200px;
  background-color: rgba(36, 37, 38, 0.9);
  border-radius: 20px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontxxl};
  text-transform: uppercase;
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: 3px;
`;

const Subtitle = styled.h2`
  font-size: ${props => props.theme.fontlg};
  color: ${props => props.theme.text};
  margin-bottom: 1.5rem;
  text-align: center;
`;

function App() {
  return (
    <Router>
      <ThemeProvider theme={dark}>
        <GlobalStyles />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={
            <>
              <Navigation />
              <Home />
              <About />
              <Rm/>
              <Showcase />
              <Oath/>
              <Team />
              <Faq />
              <Footer />
            </>
          } />
          
          <Route path="/astroverse" element={
            <>
              <Navigation />
              <Astroverse />
              <Footer />
            </>
          } />

          <Route path="/etherland" element={
            <>
              <Navigation />
              <Etherland />
              <Footer />
            </>
          } />

          <Route path="/profile" element={<UserProfile />} />
          <Route path="/gallery" element={<Gallery />} />

          {/* Add this redirect for capitalized route */}
          <Route path="/DashboardPage" element={<Navigate to="/dashboard" replace />} />
          
          {/* Existing dashboard route */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/community" element={<CommunityHub />} />
          <Route path="/metroverse" element={
            <Section style={{ background: `url(${bgr}) no-repeat`, backgroundSize: 'cover' }}>
              <Container>
                <Title>METROVerse</Title>
                <Subtitle>Level Up Your Space Babiez</Subtitle>
                <LevelUpSystem />
              </Container>
            </Section>
          } />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
