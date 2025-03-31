import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod'); // Default payment method: Cash on Delivery
  const {navigate}=useContext(ShopContext)

  // Static form data (pre-filled for testing)
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipcode: '10001',
    country: 'USA',
    phone: '1234567890',
  });

  // Handle form input change
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  // Handle form submission (static behavior)
  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log('Order Placed:', formData);
    alert('Order placed successfully!'); // Simulate order confirmation
    navigate('/orders');
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* Left Side - Delivery Information */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <h2 className="text-xl sm:text-2xl my-3">DELIVERY INFORMATION</h2>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First name" />
          <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last name" />
        </div>
        <input required onChange={onChangeHandler} name="email" value={formData.email} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email address" />
        <input required onChange={onChangeHandler} name="street" value={formData.street} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" />
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="city" value={formData.city} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" />
          <input required onChange={onChangeHandler} name="state" value={formData.state} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="State" />
        </div>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Zipcode" />
          <input required onChange={onChangeHandler} name="country" value={formData.country} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country" />
        </div>
        <input required onChange={onChangeHandler} name="phone" value={formData.phone} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Phone" />
      </div>

      {/* Right Side - Payment Section */}
      <div className="mt-8">
        <h2 className="text-xl sm:text-2xl my-3">PAYMENT METHOD</h2>
        
        {/* Payment Options */}
        <div className="flex gap-3 flex-col lg:flex-row">
          <div onClick={() => setMethod('stripe')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-500' : ''}`}></p>
            <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe Logo" />
          </div>
          <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-500' : ''}`}></p>
            <img className="h-5 mx-4" src={assets.razorpay_logo} alt="Razorpay Logo" />
          </div>
          <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-500' : ''}`}></p>
            <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
          </div>
        </div>

        {/* Order Summary (Static Data) */}
        <div className="mt-8 p-5 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <p className="mt-2 text-gray-700">Total Items: <strong>2</strong></p>
          <p className="text-gray-700">Total Price: <strong>₹67,798</strong></p>
          <p className="text-gray-700">Delivery Fee: <strong>₹50</strong></p>
          <hr className="my-3" />
          <p className="text-lg font-bold">Grand Total: ₹67,848</p>
        </div>

        {/* Place Order Button */}
        <div className="w-full text-end mt-8">
          <button type="submit" className="bg-black text-white px-16 py-3 text-sm">PLACE ORDER</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
