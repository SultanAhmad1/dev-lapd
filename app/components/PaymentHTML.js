"use client";
import { Elements } from '@stripe/react-stripe-js';
import React from 'react'
import stripePromise from './paymentcomponent/Stripe';
import PaymentForm from './paymentcomponent/PaymentForm';

function PaymentHTML() {
    
    return(
        <>
            <div className='e5ald0m1m2amc5payment-desk'>
                <div className="m3m4m5gim6payment-desk">
                    <div className="hmg1payment-desk">
                        <div className="hmg1mhb0payment-desk">
                            <div className='mimjepmkmlmmpayment-desk'>
                                <h3 className="eik5ekk6payment-desk">
                                    <span className="d1payment-desk-span">Payment Window</span>
                                </h3>
                            </div>

                            <hr className='edfhmthtpayment-desk'></hr>
                            <div className='mimjepmkmlmmpayment-desk'>
                                <h3 className="eik5ekk6payment-desk">
                                    <span className="d1payment-desk-span">Payment</span>
                                </h3>
                                <div className='d1g1payment-desk'>
                                    <a className="allzc5payment-desk">
                                        <div className="f2payment-desk">
                                            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdpayment">
                                                <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                                            </svg>
                                        </div>
                                        
                                        <div className="alamd1g1payment-desk">
                                            <span className="chd2cjd3b1payment-desk">Credit or debit card</span>
                                        </div>
                                    </a>

                                    <div className="btaupayment-window">
                                        {/* <input type="email" placeholder="Enter your card" defaultValue="" className="payment_card" /> */}
                                        <Elements stripe={stripePromise}>
                                            <PaymentForm />
                                        </Elements>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div></div>
                    </div>

                    <div className="d1g1payment-desk subpayment-desk">
                        <div className='gmgngoalamgppayment-desk'>
                            <div className="gqpayment-desk">
                                <div className='boh7bqh8payment-desk'>
                                    <button className="h7brboe1payment-btn" onClick={handleSubmit}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sbpayment">
                        <div className="akgzcheckout">
                            <div className="atbaagcheckout">
                                <div className="">
                                    <button className="fwbrbocheckout-place-order">Submit Payment</button>
                                    <div style={{height: "10px"}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentHTML