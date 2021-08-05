import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from '../CheckoutForm/Checkout/Review';
const request = require('request');


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout }) => {
  alert('Make sure you repeat "4242" as your payment card info. A real card WILL be charged!')

  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

    if (error) {
      console.log('error', error);
    } else {
      const orderData = {
        line_items: checkoutToken.live.line_items,
        customer: { firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email },
        shipping: { name: 'Primary', street: shippingData.address1, town_city: shippingData.city, county_state: shippingData.shippingSubdivision, postal_zip_code: shippingData.zip, country: shippingData.shippingCountry },
        fulfillment: { shipping_method: shippingData.shippingOption },
        payment: {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id,
          },
        },
      };

        var url = "https://apis.ticket-generator.com/client/v1/ticket/send/?eventId=60a18db76470e44f306034eb";

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.setRequestHeader("accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              console.log(xhr.status);
              console.log(xhr.responseText);
          }};

        var data = `email=${orderData.customer.email}&subject=Your%20Tickets%20Are%20Here!&body=Here%20Are%20You%20Tickets!%20Make%20sure%20to%20show%20this%20to%20the%20ticketing%20agent%20before%20entry%20to%20the%20event&fromName=WebTix&replyTo=webtix%40gmail.com&value_1=${orderData.customer.firstname + " " + orderData.customer.lastname}&header_2=Seat%3A&value_2=General%20Admission&header_5=Price%3A&value_5=%241.00`;

        xhr.send(data);
        onCaptureCheckout(checkoutToken.id, orderData);
        nextStep();
    }
  };


  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>Payment method</Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>{({ elements, stripe }) => (
          <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
            <CardElement />
            <br /> <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={backStep}>Back</Button>
              <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                Pay {checkoutToken.live.subtotal.formatted_with_symbol}
              </Button>
            </div>
          </form>
        )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm;













