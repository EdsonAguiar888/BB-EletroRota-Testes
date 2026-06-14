import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__legal">
        <p className="footer__legal-text"> © {new Date().getFullYear()} BBEletroRota. Todos os direitos reservados.        
        </p>
      </div>
    </footer>
  );
};

export default Footer;