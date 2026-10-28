import './styles/Services.css';
import './styles/Hero.css';
import './styles/Navbar.css';
import "./styles/style.css";
import './styles/Contact.css';
import './styles/Footer.css';
import './App.css'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/ServicesTemp'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <Contact />
      <Footer />
    </main>
  )
}

export default App
