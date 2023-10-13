import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../../utils/CheckoutForm";
import { useParams } from "react-router-dom";

const Payment = () => {
  const { quizId } = useParams();
  const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");

  return (
    <div className="container py-5">
      <div
        className="payment-section card p-4 my-4"
        style={{ backgroundColor: "rgb(38,70,83)" }}
      >
        <h2 className="text-center display-5 text-white">Quiz Purchase</h2>
        <p className="text-center text-white">
          Unlock and take the quiz of your choice! Complete the payment process
          below.
        </p>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>

      <div className="terms-and-conditions">
        <h3 className="mb-3 text-center">Terms and Conditions</h3>
        <ul className="list-group">
          <li className="list-group-item">
            All sales are final and non-refundable.
          </li>
          <li className="list-group-item">
            Once a quiz is purchased, you'll have access to it indefinitely.
          </li>
          <li className="list-group-item">
            We respect your privacy and do not share your payment details with
            third parties.
          </li>
          <li className="list-group-item">
            For any payment related issues, please contact our support team.
          </li>
          <li className="list-group-item">
            By making a payment, you agree to our full terms and conditions and
            privacy policy (link to full T&Cs and privacy policy).
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Payment;
