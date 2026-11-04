import "../styles/VisitStore.css";
import shopImage from "../assets/ShopFront.jpeg";

function VisitStore() {
  return (
    <section className="visit-store" id="visit-store">
      <div className="visit-store-card">

      <div className="visit-store-heading">
  <h2>
    <span className="word-visit">VISIT</span>{" "}
    <span className="word-our">OUR</span>{" "}
    <em className="word-store">STORE.</em>
  </h2>
</div>

        <div className="visit-store-image">
          <img src={shopImage} alt="MotoGT Shop Front" />
        </div>

        <div className="visit-store-address">
          <span className="location-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </span>

          <p>Kazi Tula Uchashorok, Sylhet</p>
        </div>

      </div>
    </section>
  );
}

export default VisitStore;