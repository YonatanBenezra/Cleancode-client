import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      data: { clientSecret },
    } = await axios.post("/create-payment", { amount: 1000 });

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");
      }
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body p-4">
              <h5 className="card-title text-center mb-4">
                Complete your payment
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="card-details">Card details</label>
                  <CardElement
                    id="card-details"
                    className="StripeElement form-control"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block mt-4"
                >
                  Pay $10
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CheckoutForm;

