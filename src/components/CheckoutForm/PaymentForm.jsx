import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from '../CheckoutForm/Checkout/Review';
const request = require('request');


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout }) => {
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


      const headers = {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
      };
      const dataString = `email=${orderData.customer.email}&phoneNumber=%2B${'12088804775'}&subject=${'DanceSport-Web Tickets'}&body=${'Your Tickets Are Here!'}&'fromName=${'parkerdlynn@gmail.com'}&fromEmail=${'parkerdlynn@gmail.com'}&replyTo=${'parkerdlynn@gmail.com'}&header_1=Name&value_1=${orderData.customer.firstname + " " + orderData.customer.lastname}&header_2=Table%3A&value_2=${'8'}&header_3=Seat&value_3=${'07'}&header_4=Session&value_4=${'Saturday Evening'}&header_5=Price&value_5=%24${'$90'}`;
      const options = {
          url: 'https://apis.ticket-generator.com/client/v1/ticket/send/?eventId=609984f3c4297d62dd8a3b4e',
          method: 'POST',
          headers: headers,
          body: dataString
      };
      function callback(error, response, body) {
          if (!error && response.statusCode === 200) {
              console.log(body);
          }
      }
        onCaptureCheckout(checkoutToken.id, orderData);
        request(options, callback);
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













