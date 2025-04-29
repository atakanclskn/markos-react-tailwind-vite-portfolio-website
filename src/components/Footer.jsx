import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white/5 backdrop-blur-lg text-white py-16 px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-12">
        {/* Markos Studio Başlığı ve Açıklama */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 select-none">Markos Studio</h2>
          <p className="text-white/80 text-sm max-w-md mx-auto select-none">
            Crafting modern web experiences with passion and precision.
          </p>
        </div>

        {/* Footer İçeriği */}
        <div className="w-full flex flex-col md:flex-row md:justify-around items-start space-y-8 md:space-y-0">
          {/* Social Media */}
        <div>
          <h3 className="select-none mb-4 text-xl font-semibold tracking-wide">Social Media</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:scale-105 cursor-default">Instagram</a></li>
            <li><a href="#" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:scale-105 cursor-default">Twitter</a></li>
            <li><a href="#" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:scale-105 cursor-default">LinkedIn</a></li>
            <li><a href="#" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:scale-105 cursor-default">GitHub</a></li>
            <li><a href="#" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:scale-105 cursor-default">YouTube</a></li>
          </ul>
        </div>
          {/* Products */}
          <div>
            <h3 className="mb-4 text-xl font-semibold tracking-wide select-none">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#work" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 inline-block">Product 1</a></li>
              <li><a href="#work" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 inline-block">Product 2</a></li>
              <li><a href="#work" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 inline-block">Product 3</a></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-xl font-semibold tracking-wide select-none">Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 inline-block">Home</a></li>
              <li><a href="#work" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 inline-block">Works</a></li>
              <li><a href="#about" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 inline-block">About</a></li>
              <li><a href="#services" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 inline-block">Services</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xl font-semibold tracking-wide select-none">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:info@markosstudio.com" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 inline-block">info@markosstudio.com</a></li>
              <li><a href="tel:+1234567890" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 inline-block">+1 234 567 890</a></li>
              <li><a href="#location" className="text-white/80 hover:text-white transition duration-300 ease-in-out hover:translate-x-1 inline-block">Our Location</a></li>
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
