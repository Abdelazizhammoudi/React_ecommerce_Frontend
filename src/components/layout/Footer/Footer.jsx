import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { STORE_NAME, APP_CONTACT, SOCIAL_MEDIA } from '@/config/constants';
import { Facebook, Instagram, WhatsApp, Room, Email, Phone } from '@mui/icons-material';
import "@/styles/global.css";
import "./footer.css";

function Footer() {
  const { t, i18n } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Store Information */}
        {/* <div className="footer-section">
          <h3 className="store-name">{STORE_NAME[i18n.language]}</h3>
          <div className="store-info">
            <Room className="location-icon" />
            <a
              href={APP_CONTACT.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              {APP_CONTACT.address[i18n.language]}
            </a>
          </div>
        </div> */}

        {/* Contact Section */}
        {/* <div className="footer-section">
          <h4>{t('footer.contact')}</h4>
          <div className="contact-info">
            <p>
              <a
                href={`tel:${APP_CONTACT.phone.replace(/\s+/g, '')}`}
                className="phone-link"
                style={{ color: 'inherit', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Phone className="phone-icon" />
                 {APP_CONTACT.phone}
              </a>
            </p>
            <p>{APP_CONTACT.email}</p>
          </div>
        </div> */}

        {/* Social Media */}
        <div className="footer-section">
          <h4 className="follow">{t('footer.followUs')}</h4>
          <div className="social-icons">
            <a href={SOCIAL_MEDIA.facebook} target="_blank" rel="noopener noreferrer">
              <Facebook className="social-icon" />
            </a>
            <a href={SOCIAL_MEDIA.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram className="social-icon" />
            </a>
            <a href={SOCIAL_MEDIA.whatsapp} target="_blank" rel="noopener noreferrer">
              <WhatsApp className="social-icon" />
            </a>
          </div>
        </div>

        {/* Contact Developer Section */}
        {/* <div className="footer-section">
          <h4>{t('footer.ContactDev')}</h4>
          <div className="contact-developer">
              <div>
                <a
                  href={`mailto:${APP_CONTACT.developerEmail}`}
                  className="developer-email-link"
                  // style={{ color: 'inherit', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Email className="email-icon" />
                  {APP_CONTACT.developerEmail}
                </a>
              <div/>
              <div >
                <a
                  href={`tel:${APP_CONTACT.developperPhone.replace(/\s+/g, '')}`}
                  className="developer-phone-link"
                  // style={{ color: 'inherit', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem' }}
                >
                  <Phone className="phone-icon" />
                  {APP_CONTACT.developperPhone}
                </a>
              </div>
          </div>
        </div> 
       </div> */}
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p className="copyright-text">
          {STORE_NAME[i18n.language]} 2025  {t('footer.rights')}
          <Link to="/admin/login" className="admin">
            {t('footer.madeBy')}    
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;