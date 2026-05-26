import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import CodeDetail from './pages/CodeDetail.jsx';
import Browse from './pages/Browse.jsx';
import About from './pages/About.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfUse from './pages/TermsOfUse.jsx';
import Advertise from './pages/Advertise.jsx';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/code/:code" element={<CodeDetail />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/advertise" element={<Advertise />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
