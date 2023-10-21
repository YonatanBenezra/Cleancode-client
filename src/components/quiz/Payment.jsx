import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Swal from "sweetalert2";
import GlobalContext from "../../contexts/Global-Context";
import Spinner from "../spinner/Spinner";

const Payment = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState({});
  const { user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}`
        );
        setQuiz(response.data.data.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [quizId]);

  const handleApprove = async (data) => {
    const payment = {
      quiz: quizId,
      accessGranted: true,
      orderID: data.id,
      user: user._id,
      intent: data.intent,
      status: data.status,
      purchase_units: [
        {
          amount: data.purchase_units[0].amount,
          description: data.purchase_units[0].description,
          payee: data.purchase_units[0].payee,
        },
      ],
    };
    setLoading(true);

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments`,
        payment,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire({
        title: "Success!",
        text: "Your payment has been successfully processed! Thank you for your purchase.",
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/quizzes/${quizId}`);
        }
      });
    } catch (error) {
      Swal.fire("Error", "Failed to process the payment!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mx-auto mt-5" style={{ maxWidth: "500px" }}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {" "}
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
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        description: quiz.description,
                        amount: {
                          value: "3.00",
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  const order = await actions.order.capture();
                  handleApprove(order);
                }}
                onError={() => {
                  Swal.fire("Error", "Failed to process the payment!", "error");
                }}
                onCancel={() => {
                  Swal.fire("Cancelled", "Payment was cancelled!", "info");
                }}
              />
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Payment;
