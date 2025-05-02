import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCube,
  FaBoxes,
  FaCubes,
  FaHome,
  FaFolderOpen,
  FaUserAlt,
  FaTools
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white/5 backdrop-blur-lg text-white py-16 px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-12">
        {/* Markos Studio Başlığı ve Açıklama */}
        <div className="text-center">
        <h2 className="shine-effect text-2xl font-bold mb-2 select-none">
          Markos Studio
        </h2>
        </div>

        {/* Footer İçeriği */}
        <div className="w-full flex flex-col md:flex-row md:justify-around items-start space-y-8 md:space-y-0">

          {/* Social Media */}
          <div>
            <h3 className="select-none mb-4 text-xl font-semibold tracking-wide">Social Media</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:scale-105 cursor-default flex items-center gap-2"><FaInstagram className="text-lg" /> Instagram</a></li>
              <li><a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:scale-105 cursor-default flex items-center gap-2"><FaTwitter className="text-lg" /> Twitter</a></li>
              <li><a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:scale-105 cursor-default flex items-center gap-2"><FaLinkedin className="text-lg" /> LinkedIn</a></li>
              <li><a href="https://www.github.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:scale-105 cursor-default flex items-center gap-2"><FaGithub className="text-lg" /> GitHub</a></li>
              <li><a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:scale-105 cursor-default flex items-center gap-2"><FaYoutube className="text-lg" /> YouTube</a></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-4 text-xl font-semibold tracking-wide select-none flex items-center gap-2">
               Products
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#work" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 flex items-center gap-2"><FaCube className="text-base" /> <span>Product 1</span></a></li>
              <li><a href="#work" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 flex items-center gap-2"><FaBoxes className="text-base" /> <span>Product 2</span></a></li>
              <li><a href="#work" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 flex items-center gap-2"><FaCubes className="text-base" /> <span>Product 3</span></a></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-xl font-semibold tracking-wide select-none">Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 flex items-center gap-2"><FaHome className="text-base" /> Home</a></li>
              <li><a href="#work" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 flex items-center gap-2"><FaFolderOpen className="text-base" /> Works</a></li>
              <li><a href="#about" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 flex items-center gap-2"><FaUserAlt className="text-base" /> About</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xl font-semibold tracking-wide select-none flex items-center gap-2">
               Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:info@markosstudio.com" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 flex items-center gap-2"><FaEnvelope className="text-base" /> <span>info@markosstudio.com</span></a></li>
              <li><a href="tel:+1234567890" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 flex items-center gap-2"><FaPhoneAlt className="text-base" /> <span>+1 234 567 890</span></a></li>
              <li><a href="#location" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 flex items-center gap-2"><FaMapMarkerAlt className="text-base" /> <span>Our Location</span></a></li>
            </ul>
          </div>

        </div>

        {/* Telif Hakkı */}
        <div className="text-center mt-12 text-xs text-white/60 select-none">
          &copy; 2025 All Rights Reserved.
          <div className="mt-1 tracking-wider font-mono text-white/50">atakanclskn</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;