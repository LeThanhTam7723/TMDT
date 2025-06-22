import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import { FiCreditCard, FiLock, FiCheck, FiDollarSign } from 'react-icons/fi';
import { FaCcVisa, FaCcPaypal, FaCcMastercard, FaCcApplePay } from 'react-icons/fa';

const paymentMethods = [
  {
    id: 'credit',
    name: 'Credit Card',
    logo: <FaCcVisa className="w-6 h-6 text-blue-600" />, // You can swap for your own logo
    input: (
      <>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <input type="text" name="cardNumber" placeholder="1234 5678 9012 3456" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
          <input type="text" name="cardName" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input type="text" name="expiryDate" placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <input type="text" name="cvv" placeholder="123" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </>
    )
  },
  {
    id: 'paypal',
    name: 'PayPal',
    logo: <FaCcPaypal className="w-6 h-6 text-blue-500" />,
    input: <div className="py-8 text-center text-gray-500">You will be redirected to PayPal to complete your purchase.</div>
  },
  {
    id: 'applepay',
    name: 'Apple Pay',
    logo: <FaCcApplePay className="w-6 h-6 text-black" />,
    input: <div className="py-8 text-center text-gray-500">You will be redirected to Apple Pay to complete your purchase.</div>
  }
];

const CheckoutPage = () => {
  const { products } = useProduct();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: 'credit',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: '',
    fullName: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});

  const handlePaymentMethodChange = (id) => {
    setFormData({ ...formData, paymentMethod: id });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Get course from URL params or default to first course
  const courseId = new URLSearchParams(window.location.search).get('courseId');
  const course = products.find(p => p.id == courseId) || products[0] || { name: 'Sample Course', price: 99.99 };
  
  const calculateSubtotal = () => course.price || 0;
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.1;
    return subtotal + tax;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Thank you for your purchase. You will receive a confirmation email shortly.</p>
          <button
            onClick={() => navigate('/shop')}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Start Learning
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-gray-200 flex items-center justify-end px-6 py-3 border-b border-gray-300">
        <button className="text-gray-700" onClick={() => navigate(-1)}>Cancel</button>
      </div>
      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full bg-white mt-8 rounded-lg shadow overflow-hidden">
        {/* Left: Payment */}
        <div className="w-full lg:w-2/3 p-8 border-r border-gray-200">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          <form onSubmit={e => { e.preventDefault(); setSuccess(true); }}>
            {/* Payment Method */}
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Payment Method</h2>
              <div className="space-y-4">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer ${formData.paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
                    onClick={() => handlePaymentMethodChange(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={formData.paymentMethod === method.id}
                        onChange={() => handlePaymentMethodChange(method.id)}
                        className="accent-blue-500"
                      />
                      <span className="font-medium">{method.name}</span>
                    </div>
                    <div>{method.logo}</div>
                  </div>
                ))}
              </div>
              {/* Payment input for selected method */}
              <div className="mt-4">
                {formData.paymentMethod === 'credit' && (
                  <div className="border rounded-lg p-6 bg-white">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="1234 5678 9012 3456" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                      <input type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="123" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                )}
                {formData.paymentMethod === 'paypal' && (
                  <div className="border rounded-lg p-6 bg-white text-center text-gray-500">You will be redirected to PayPal to complete your purchase.</div>
                )}
                {formData.paymentMethod === 'applepay' && (
                  <div className="border rounded-lg p-6 bg-white text-center text-gray-500">You will be redirected to Apple Pay to complete your purchase.</div>
                )}
              </div>
            </div>
            {/* User Info */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </form>
        </div>
        {/* Right: Order Summary */}
        <div className="w-full lg:w-1/3 bg-gray-50 p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-xs bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Order summary</h2>
            {/* Course item */}
            <div className="mb-4 divide-y">
              {course ? (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                      {course.image ? (
                        <img src={course.image} alt={course.name} className="object-cover w-full h-full" />
                      ) : (
                        <FiDollarSign className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{course.name}</div>
                      <div className="text-xs text-gray-500">x1</div>
                    </div>
                  </div>
                  <span className="font-medium text-sm">${course.price.toFixed(2)}</span>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">No course selected.</div>
              )}
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Original Price:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            {/* Discounts placeholder */}
            <div className="flex justify-between mb-2">
              <span className="font-medium">Discounts ("X% & Reason"):</span>
              <span>$0.00</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <button
              className="w-full py-3 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition"
              onClick={() => setSuccess(true)}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 