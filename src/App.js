import GlobalStyles from "./styles/GlobalStyles";
import {dark} from "./styles/Themes";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

function App() {
  return (
    <Router>
      <ThemeProvider theme={dark}>
        <GlobalStyles />
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
              <ScrollToTop />
            </>
          } />
          
          <Route path="/astroverse" element={
            <>
              <Navigation />
              <Astroverse />
              <Footer />
              <ScrollToTop />
            </>
          } />

          <Route path="/etherland" element={
            <>
              <Etherland />
              <ScrollToTop />
            </>
          } />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
