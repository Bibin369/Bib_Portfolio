import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isTravelPage = location.pathname === '/travel';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', to: 'about' },
    { name: 'Experience', to: 'experience' },
    { name: 'Projects', to: 'projects' },
    { name: 'Contact', to: 'contact' },
  ];

  const handleNavClick = (to) => {
    setIsMobileMenuOpen(false);
    if (isTravelPage) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(to);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled glass-panel' : ''}`}>
      <div className="navbar-container">
        {isTravelPage ? (
          <RouterLink to="/" className="logo gradient-text" style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 700, textDecoration: 'none' }}>
            BT.
          </RouterLink>
        ) : (
          <ScrollLink to="hero" smooth={true} duration={500} className="logo gradient-text" style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 700 }}>
            BT.
          </ScrollLink>
        )}

        <div className="desktop-menu">
          {navLinks.map((link) => (
            isTravelPage ? (
              <a 
                key={link.to} 
                onClick={() => handleNavClick(link.to)} 
                className="nav-link" 
                style={{ cursor: 'pointer' }}
              >
                {link.name}
              </a>
            ) : (
              <ScrollLink
                key={link.to}
                to={link.to}
                smooth={true}
                duration={500}
                className="nav-link"
                style={{ cursor: 'pointer' }}
              >
                {link.name}
              </ScrollLink>
            )
          ))}
          <RouterLink to="/travel" className="nav-link" style={{ cursor: 'pointer', color: isTravelPage ? 'var(--accent-primary)' : '', textDecoration: 'none' }}>
            Travel
          </RouterLink>
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>
        </div>

        <div className="mobile-controls">
          <ThemeToggle />
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu glass-panel"
          >
            {navLinks.map((link) => (
              isTravelPage ? (
                <a 
                  key={link.to} 
                  onClick={() => handleNavClick(link.to)} 
                  className="mobile-nav-link"
                  style={{ cursor: 'pointer' }}
                >
                  {link.name}
                </a>
              ) : (
                <ScrollLink
                  key={link.to}
                  to={link.to}
                  smooth={true}
                  duration={500}
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </ScrollLink>
              )
            ))}
            <RouterLink 
              to="/travel" 
              className="mobile-nav-link" 
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ color: isTravelPage ? 'var(--accent-primary)' : '', textDecoration: 'none' }}
            >
              Travel
            </RouterLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
