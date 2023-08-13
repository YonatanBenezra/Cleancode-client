import SuccessAnimation from "../../assets/success.json";
import { useLottie } from "lottie-react";
import "./success.scss";
import { NavLink } from "react-router-dom";
const Success = ({ setSubmitted }) => {
  const options = {
    animationData: SuccessAnimation,
    loop: false,
  };

  const { View } = useLottie(options);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", width: "100%" }}
    >
      <div className="w-100">
        <div style={{ width: "30%" }} className="d-block mx-auto mb-5">
          {View}
        </div>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <NavLink to="/add-exercise" onClick={() => setSubmitted(false)}>
            <button className="btn">Add another exercise</button>
          </NavLink>
          <NavLink to="/home">
            <button className="btn">Home</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Success;
