import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Features from './components/Features.jsx'
import Products from './components/Products.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Benefits from './components/Benefits.jsx'
import Download from './components/Download.jsx'
import Footer from './components/Footer.jsx'
import Admin from './pages/Admin.jsx'

function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Products />
        <HowItWorks />
        <Benefits />
        <Download />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-ink">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
