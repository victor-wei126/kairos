import React, { Component } from 'react';
import axios from 'axios';
import {CardElement} from '@stripe/react-stripe-js';

export default class PaymentPage extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <div className="container mt-4">
        <h1>Enter Payment Details</h1>
        <CardSection />
      </div>
      
    )
  }
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function CardSection() {
  return (
    <label>
      Card details
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </label>
  );
};
