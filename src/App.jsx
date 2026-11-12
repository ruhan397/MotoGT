
import { useEffect } from 'react';
import './styles/Services.css';
import './styles/Hero.css';
import './styles/Navbar.css';
import './styles/style.css';
import './styles/Contact.css';
import './styles/Footer.css';
import './styles/VisitStore.css';
import './styles/Auth.css';
import './App.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/ServicesTemp';
import Contact from './components/Contact';
import Footer from './components/Footer';
import VisitStore from './components/VisitStore';
import MembershipCard from './components/MembershipCard';

import Login from './pages/Login';
import Register from './pages/Register';
import Accessories from './pages/Accessories';
import DentPaint from './pages/DentPaint';

function App() {
  const currentPath = window.location.pathname;

  useEffect(() => {
    if (currentPath !== '/') return;

    const elements = document.querySelectorAll(
      '.contact-section, .visit-store-card, footer'
    );

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('moto-is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('moto-is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    elements.forEach((element) => {
      element.classList.add('moto-reveal');
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [currentPath]);

  return (
    <main>
      <Navbar />

      {currentPath === '/login' ? (
        <Login />
      ) : currentPath === '/register' ? (
        <Register />
      ) : currentPath === '/accessories' ? (
        <>
          <Accessories />
          <Footer />
        </>
      ) : currentPath === '/dent-paint' ? (
        <>
          <DentPaint />
          <Footer />
        </>
      ) : (
        <>
          <Hero />
          <Services />

          {localStorage.getItem('motogtToken') && <MembershipCard />}

          <Contact />
          <VisitStore />
          <Footer />
        </>
      )}
    </main>
  );
}

export default App;
