import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Swal from "sweetalert2";
import GlobalContext from "../../contexts/Global-Context";
import Spinner from "../spinner/Spinner";

// Constants for coupons
const COUPON_FREE = "CLEAN-FREE";
const COUPON_DISCOUNT10 = "CLEAN-DISCOUNT10";
const DISCOUNT10_PERCENTAGE = 0.1;

// Custom hook for fetching the quiz
const useFetchQuiz = (quizId) => {
  const [quiz, setQuiz] = useState({});
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
  return quiz;
};

const Payment = () => {
  const { quizId } = useParams();
  const quiz = useFetchQuiz(quizId);
  const { user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [finalAmount, setFinalAmount] = useState(3.0);
  const baseAmount = 3.0;

  const applyCoupon = () => {
    if (couponApplied) {
      Swal.fire("Coupon Applied", "You have already applied a coupon.", "info");
      return;
    }

    switch (couponCode) {
      case COUPON_FREE: {
        setFinalAmount(0);
        setCouponApplied(true);
        break;
      }
      case COUPON_DISCOUNT10: {
        const discountAmount = baseAmount * DISCOUNT10_PERCENTAGE;
        setFinalAmount(baseAmount - discountAmount);
        setCouponApplied(true);
        break;
      }
      default: {
        Swal.fire(
          "Invalid Coupon",
          "Please enter a valid coupon code!",
          "warning"
        );
        setCouponApplied(false);
      }
    }
  };

  const handleApprove = async (data) => {
    const { id, intent, status, purchase_units } = data;
    const payment = {
      quiz: quizId,
      accessGranted: true,
      orderID: id,
      user: user._id,
      intent,
      status,
      purchase_units: [
        {
          amount: purchase_units[0].amount,
          description: purchase_units[0].description,
          payee: purchase_units[0].payee,
        },
      ],
    };

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
                  value={`$${finalAmount.toFixed(2)}`}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="couponCode" className="form-label">
                  Coupon Code
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="couponCode"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter your coupon code"
                  />
                  <button className="btn" type="button" onClick={applyCoupon}>
                    Apply Coupon
                  </button>
                </div>
                {couponApplied && (
                  <span className="text-success d-block mt-2">
                    Coupon applied successfully!
                  </span>
                )}
              </div>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        description: quiz.description,
                        amount: {
                          value: finalAmount.toString(),
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
