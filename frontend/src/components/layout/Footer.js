import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="copyright">© {new Date().getFullYear()} Know Your Plant of India. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;