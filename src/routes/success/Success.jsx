import { useEffect } from "react";

const Success = () => {
  useEffect(() => {
    console.log("Success");
  }, []);
  return (
    <div>
      <h2>Success</h2>
    </div>
  );
};

export default Success;
