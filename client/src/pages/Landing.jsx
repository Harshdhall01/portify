import WaterBackground from '../components/WaterBackground.jsx'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Features from '../components/Features.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import TemplateShowcase from '../components/TemplateShowcase.jsx'
import Footer from '../components/Footer.jsx'

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <WaterBackground />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <TemplateShowcase />
      <Footer />
    </main>
  )
}