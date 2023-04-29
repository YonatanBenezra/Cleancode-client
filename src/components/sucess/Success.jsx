import SuccessAnimation from "../../assets/success.json";
import { useLottie } from "lottie-react";
import './success.scss'
import { NavLink } from "react-router-dom";
const Success = ({setSubmitted}) => {
  const options = {
    animationData: SuccessAnimation,
    loop: false,
  };

  const { View } = useLottie(options);

  return (
    <div>
      {View}
      <div className="success-btns">
        <NavLink to="/add-exercise" onClick={() => setSubmitted(false)}><h1 className="success-btn">Add another exercise</h1></NavLink>
        <NavLink to="/home"><h1 className="success-btn">Home</h1></NavLink>
      </div>
    </div>
  );
};

export default Success;
