import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const { productId } = useParams();
  const [method, setMethod] = useState('cod');
  const { navigate, token, backendUrl } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/phones/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Failed to load product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, backendUrl, token]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!product) {
      toast.error('Product information not available');
      return;
    }

    try {
      const orderData = {
        productId,
        address: formData,
        paymentMethod: method,
        amount: product.price + 50, // Product price + delivery fee
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      let response;
      
      switch(method) {
        case 'cod':
          response = await axios.post(`${backendUrl}/api/orders/place`, orderData, config);
          break;

        case 'stripe':
          response = await axios.post(`${backendUrl}/api/orders/stripe`, orderData, config);
          break;

        case 'razorpay':
          toast.info('Razorpay integration coming soon');
          return;

        default:
          toast.error('Invalid payment method');
          return;
      }

      if (response.data.success) {
        if (method === 'stripe') {
          window.location.replace(response.data.session_url);
        } else {
          toast.success('Order placed successfully!');
          navigate('/orders');
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error.response?.data?.message || 'Error placing order');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <p>Loading product details...</p>
    </div>
  );

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
  
        {/* Order Summary */}
        <div className="mt-8 p-5 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <p className="mt-2 text-gray-700">Total Items: <strong>1</strong></p>
          <p className="text-gray-700">Total Price: <strong>₹{product?.price}</strong></p>
          <p className="text-gray-700">Delivery Fee: <strong>₹50</strong></p>
          <hr className="my-3" />
          <p className="text-lg font-bold">Grand Total: ₹{product ? product.price + 50 : 0}</p>
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