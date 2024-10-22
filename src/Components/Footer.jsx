import React from 'react';
import '../css/footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About the Tournament</h3>
          <p>
            Welcome to the most exciting padel tournaments of the year! Stay tuned for updates and results.
          </p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Groups</a></li>
            <li><a href="#">Schedule</a></li>
            <li><a href="#">Results</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: Walidyoussef711@gmail.com</p>
          <p>Phone: +201110400455</p>
          <p>Follow us on social media:</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Padel Tournament. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
