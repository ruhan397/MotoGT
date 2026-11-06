
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

function App() {
  const currentPath = window.location.pathname;

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
