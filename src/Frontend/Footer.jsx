// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaHome, 
  FaCalendarPlus, 
  FaUserMd, 
  FaSignInAlt 
} from 'react-icons/fa';
import '../style/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section contact-section">
            <h5 className="footer-title">Contact Us</h5>
            <address className="contact-info">
              <p><FaMapMarkerAlt className="footer-icon" /> 123 Medical Avenue, Health City</p>
              <p><FaPhoneAlt className="footer-icon" /> +1 (555) 123-4567</p>
              <p><FaEnvelope className="footer-icon" /> info@medcare.com</p>
            </address>
          </div>
          <div className="footer-section links-section">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  <FaHome className="footer-icon" /> Home
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" className="footer-link">
                  <FaCalendarPlus className="footer-icon" /> Book Appointment
                </Link>
              </li>
              
             
            </ul>
          </div>
          <div className="footer-section map-section">
            <h5 className="footer-title">Our Location</h5>
            <div className="map-wrapper">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2176506380977!2d-73.98784482426508!3d40.75798293440652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzI4LjgiTiA3M8KwNTknMTMuMiJX!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus" 
                width="100%" 
                height="200" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Our Location"
                className="location-map"
              ></iframe>
            </div>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="footer-bottom">
          <p className="footer-copyright">© 2025 MedCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;