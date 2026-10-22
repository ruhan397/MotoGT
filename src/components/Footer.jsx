
import logo from '../assets/GTM.jpeg'

function Footer() {
  return (
    <footer>
      <a className="brand" href="#">
        <img src={logo} alt="MotoGT logo" />
      </a>

      <p>Car Accessories · Dent &amp; Paint</p>

      <span>© {new Date().getFullYear()} MotoGT</span>
    </footer>
  )
}

export default Footer
