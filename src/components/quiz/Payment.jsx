import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}`
      );
      setQuiz(response.data.data.data);
    })();
  }, [quizId]);

  const handlePayment = async () => {
    try {
      setIsLoading(true); // Set loading state to true

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments`,
        {
          quiz: quizId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { links } = response.data;
      const approvalLink = links.find((link) => link.rel === "approve");

      if (approvalLink) {
        window.location.href = approvalLink.href;
      }
    } catch (error) {
      console.error("Error creating payment", error);
    } finally {
      setIsLoading(false); // Set loading state back to false after the request is complete
    }
  };

  return (
    <div className="card mx-auto mt-5" style={{ maxWidth: "500px" }}>
      <div className="card-header text-center bg-primary text-white">
        <h4>Complete Your Purchase</h4>
      </div>
      <div className="card-body">
        <form>
          <h3>{quiz.description}</h3>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="text"
              className="form-control"
              id="amount"
              placeholder="$3.00"
              readOnly
            />
          </div>
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={handlePayment}
            disabled={isLoading} 
          >
            {isLoading ? "Loading..." : "Pay with PayPal"} 
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
