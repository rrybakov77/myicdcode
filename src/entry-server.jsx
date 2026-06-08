// Server-side entry point for prerendering
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import CodeDetail from './pages/CodeDetail.jsx';
import Browse from './pages/Browse.jsx';
import About from './pages/About.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfUse from './pages/TermsOfUse.jsx';
import Advertise from './pages/Advertise.jsx';
import { Routes, Route } from 'react-router-dom';
import './index.css';

export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/code/:code" element={<CodeDetail />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/advertise" element={<Advertise />} />
          </Routes>
        </main>
        <Footer />
      </StaticRouter>
    </StrictMode>
  );
}
