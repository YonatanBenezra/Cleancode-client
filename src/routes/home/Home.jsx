import { NavLink } from "react-router-dom";
import "./home.scss";

const Home = () => {
  return (
    <section className="hero">
      <h1 className="hero-heading">
        <span>
          <span className="top-animation">F</span>
          <span className="bottom-animation">u</span>
          <span className="top-animation">l</span>
          <span className="top-animation">l</span>
          <span className="bottom-animation">S</span>
          <span className="top-animation">t</span>
          <span className="bottom-animation">a</span>
          <span className="top-animation">c</span>
          <span className="bottom-animation">k</span>
        </span>
        <span>&nbsp;</span>
        <span>
          <span className="top-animation">M</span>
          <span className="bottom-animation">a</span>
          <span className="top-animation">s</span>
          <span className="bottom-animation">t</span>
          <span className="top-animation">e</span>
          <span className="bottom-animation">r</span>
          <span className="top-animation">y</span>
        </span>
      </h1>
      <p className="hero-subheading">
        Learn and exercise FullStack technologies with our exercises.
      </p>
      <NavLink to="/get-started" className="hero-button">
        Get started
      </NavLink>
    </section>
  );
};

export default Home;
