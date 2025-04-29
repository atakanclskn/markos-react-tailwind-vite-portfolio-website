import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CompanyLogo from './components/CompanyLogo'
import PurposeSection from './components/PurposeSection'
import PortfolioSection from './components/PortfolioSection'
import Footer from './components/Footer'
import AboutSection from './components/AboutSection'



function App() {
  const [count, setCount] = useState(0)

  return (
    <main className='relative min-h-screen overflow-x-hidden  '>
      <div className='absolute -top-38 -left-38 w-[500px] h-[500px] bg-gradient-to-tr from-red-600/20 to-pink-500/25 rounded-full blur-[120px] -z-10'></div>
      <div className=' overflow-hidden'>
        <Navbar />
        <Hero />
        <CompanyLogo />
        <PurposeSection/>
        <PortfolioSection />
        <AboutSection />

        <div className="bg-black text-white">
        <Footer />
        </div>

      </div>
    </main>
  )
}

export default App
