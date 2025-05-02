import React from 'react';
import facebook from '../assets/Facebook_Logo.png';
import instagram from '../assets/Instagram_icon.png';
import x from '../assets/x_Logo.png';
import linkedin from '../assets/Linkedin_Logo.png';
import youtube from '../assets/YouTube_Logo.png';
import tiktok from '../assets/TikTok_Logo.png';
import pinterest from '../assets/Pinterest_Logo.png';

const CompanyLogo = () => {
  const logos = [
    { src: facebook, alt: 'Facebook', href: 'https://www.facebook.com' },
    { src: instagram, alt: 'Instagram', href: 'https://www.instagram.com' },
    { src: x, alt: 'X', href: 'https://twitter.com' },
    { src: linkedin, alt: 'LinkedIn', href: 'https://www.linkedin.com' },
    { src: youtube, alt: 'YouTube', href: 'https://www.youtube.com' },
    { src: tiktok, alt: 'TikTok', href: 'https://www.tiktok.com' },
    { src: pinterest, alt: 'Pinterest', href: 'https://www.pinterest.com' },
  ];

  return (
    <div className='w-full overflow-hidden container mx-auto py-20 gap-8 flex sm:flex-row flex-col sm:items-center items-start'>
      {/* Sabit yazı - fade'den etkilenmemeli */}
      <div className='w-[300px] shrink-0 px-5 text-gray-600 border-l-4 border-red-700 bg-white py-2 z-10 sm:text-base text-xl font-semibold text-left'>
        Follow me <br /> on socials!
      </div>

      {/* Logolar + fade maskesi birlikte sarılıyor */}
      <div className='relative w-full overflow-hidden'>
        {/* Fade katmanı */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 gradient-mask" />

        {/* Kayan logolar */}
        <div className='flex animate-marquee whitespace-nowrap'>
          {[...Array(3)].flatMap(() => logos).map((logo, index) => (
            <a
              key={index}
              href={logo.href}
              target='_blank' // Yeni sekmede açılması için
              rel='noopener noreferrer' // Güvenlik için önerilir
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className='mx-22 h-8 w-36 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 cursor-pointer'
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyLogo;