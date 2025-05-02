import React, { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const currentY = window.scrollY;
      setIsVisible(true);

      const newTimeoutId = setTimeout(() => {
        setIsVisible(currentY < scrollY || currentY < 100);
        setScrollY(currentY);
      }, 300);

      setTimeoutId(newTimeoutId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [scrollY, timeoutId]);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#work", label: "Work" },
    { href: "#aboutme", label: "About" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'} bg-black/30 backdrop-blur-md border-b border-white/10 shadow-md`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20 relative overflow-hidden">

          {/* Logo */}
          <div
            className={`flex items-center gap-2 transform transition-all duration-500 ease-in-out ${
              isMenuOpen ? '-translate-x-60 opacity-0' : 'translate-x-0 opacity-100'
            }`}
          >
            <img
              src="/src/assets/mainlogo.png"
              alt="logo"
              className="w-10 h-10 rounded-full bg-black/70 hover:opacity-100 transition-opacity"
            />
            <span className="text-white drop-shadow-md font-semibold tracking-wide text-lg hidden md:inline">Markos</span>
          </div>

          {/* Centered Title on Mobile Menu Open */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-700 text-white text-lg font-semibold tracking-widest ${
              isMenuOpen ? 'opacity-100 translate-y-0 animate-fade-in-down' : 'opacity-0 -translate-y-4'
            }`}
          >
            Markos Studio
          </div>

          {/* Hamburger (Mobile) */}
          <div className="md:hidden z-50 flex items-center justify-center h-full">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none flex items-center justify-center h-10 w-10"
            >
              {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={`text-sm relative transition-all duration-300 ease-in-out drop-shadow-md
                  ${activeLink === link.href ? 'text-white' : 'text-white/70 hover:text-white'}
                  after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 
                  after:bg-white after:transition-all after:duration-300 hover:after:w-full
                  ${activeLink === link.href ? 'after:w-full' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact Button - Desktop */}
          <div className="hidden md:block">
            <a
              href="#home"
              className="bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-xl text-sm hover:bg-white/20 transition-all backdrop-blur-sm drop-shadow-md"
            >
              Contact Me
            </a>
          </div>
        </div>
      </nav>

      {/* Overlay for Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu - Fullscreen with darker background */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-screen z-40 transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center space-y-4 pt-24 text-white text-sm">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              onClick={() => {
                setActiveLink(link.href);
                setIsMenuOpen(false);
              }}
              className={`transition-all drop-shadow-md ${
                activeLink === link.href ? 'text-white font-semibold' : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}

          <a
            href="#home"
            onClick={() => {
              setActiveLink('#home');
              setIsMenuOpen(false);
            }}
            className="bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-xl text-sm hover:bg-white/20 transition-all drop-shadow-md"
          >
            Contact Me
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
