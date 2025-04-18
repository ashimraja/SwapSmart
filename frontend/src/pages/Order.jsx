import React, { useState, useEffect, useContext } from 'react';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Order = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/orders/userorders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserOrders();
    }
  }, [token, backendUrl]);

  const trackOrder = (orderId) => {
    // Implement actual tracking functionality here
    alert(`Tracking order ${orderId} - This would open tracking details`);
  };

  if (loading) {
    return (
      <div className="border-t pt-16 min-h-[50vh] flex items-center justify-center">
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="border-t pt-16 min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-lg mb-4">You haven't placed any orders yet</p>
        <button 
          onClick={() => window.location.href = '/buy'}
          className="bg-black text-white px-6 py-2 rounded-sm"
        >
          Browse Phones
        </button>
      </div>
    );
  }

  return (
    <div className="border-t pt-16">
      <h2 className="text-2xl font-semibold mb-6 text-center">MY ORDERS</h2>

      <div>
        {orders.map((order) => (
          <div key={order.id} className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-6 text-sm">
              {order.image && order.image.length > 0 ? (
                <img className="w-16 sm:w-20" src={order.image[0]} alt={order.phone_name} />
              ) : (
                <div className="w-16 sm:w-20 h-20 bg-gray-100 flex items-center justify-center">
                  <span>No Image</span>
                </div>
              )}
              <div>
                <p className="sm:text-base font-medium">{order.phone_name} {order.model}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p>₹{order.amount?.toLocaleString('en-IN')}</p>
                  <p>Quantity: 1</p>
                </div>
                <p className="mt-1">Date: <span className="text-gray-400">{new Date(order.created_at).toDateString()}</span></p>
                <p className="mt-1">Payment: <span className="text-gray-400">{order.payment_method}</span></p>
                <p className="mt-1">Status: <span className="text-gray-400">{order.status}</span></p>
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => trackOrder(order.id)} 
                className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100 transition-colors"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;