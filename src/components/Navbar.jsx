import React, { useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('#home')

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#work", label: "My Work" },
    { href: "#aboutme", label: "About Me" },
  ]

  return (
    <nav className='fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm'>
      <div className='w-full container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20 h-16'>

        {/* Logo */}
        <div className='flex items-center gap-1 cursor-pointer'>
          <div>
            <img src="/src/assets/mainlogo.png" alt='logo' className='w-11 h-11 bg-black opacity-88 rounded-full hover:opacity-100 transition-opacity' />
          </div>
        </div>

        {/* Mobile Menu Button with animation */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className='md:hidden transition-transform duration-300 ease-in-out'
        >
          <div className={`transition-transform duration-300 ease-in-out ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
            {isMenuOpen ? <HiX className='size-6' /> : <HiMenu className='size-6' />}
          </div>
        </button>

        {/* Nav Items */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              onClick={() => setActiveLink(link.href)}
              className={`text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-red-800 after:transition-all ${
                activeLink === link.href ? 'text-red-800 after:w-full' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Contact Button */}
        <button className='hidden md:block bg-red-800 text-white px-6 py-2.5 rounded-lg hover:bg-red-900 text-sm font-medium transition-all hover:shadow-lg hover:shadow-red-100'>
          <a href="#newsletter">Contact Me</a>
        </button>

        {/* Mobile Menu with animation */}
        <div className={`absolute top-full left-0 w-full bg-white z-50 border-t border-gray-100 py-4 transform transition-all duration-500 ease-in-out origin-top ${
          isMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        }`}>
          <div className='container mx-auto px-4 space-y-3 text-center'>
            {navLinks.map((link, index) => (
              <a
                key={index}
                className={`block text-sm font-medium py-2 ${
                  activeLink === link.href ? "text-red-800" : "text-gray-600 hover:text-gray-900"
                }`}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.href);
                  setIsMenuOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}

            <button className='w-full bg-red-800 text-white px-6 py-2.5 rounded-lg hover:bg-red-900 text-sm font-medium transition-all hover:shadow-lg hover:shadow-red-100'>
              <a href="#newsletter">Contact Me</a>
            </button>
          </div>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
