import React, { useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
  const { token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const verifyPayment = async () => {
    try {
      if (!token) {
        toast.error('Please login to verify payment');
        return navigate('/login');
      }

      const response = await axios.post(
        `${backendUrl}/api/orders/verifyStripe`,
        { success, orderId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Payment verified successfully!');
        setCartItems([]);
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.response?.data?.message || 'Error verifying payment');
    } finally {
      navigate('/orders');
    }
  };

  useEffect(() => {
    if (orderId) {
      verifyPayment();
    } else {
      navigate('/');
    }
  }, [orderId, token]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          {success === 'true' ? 'Verifying Payment...' : 'Payment Cancelled'}
        </h1>
        <p className="text-lg">
          {success === 'true'
            ? 'Please wait while we verify your payment.'
            : 'You cancelled the payment process.'}
        </p>
      </div>
    </div>
  );
};

export default Verify;