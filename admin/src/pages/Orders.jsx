import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({token}) => {
  const [orders, setOrders] = useState([])
  
  const getOrders = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/orders/list`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.data.success) {
            setOrders(response.data.orders.reverse());
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                toast.error("Unauthorized - Please login again");
            } else if (error.response.status === 403) {
                toast.error("Admin privileges required");
            } else {
                toast.error(error.response.data?.message || "Failed to fetch orders");
            }
        } else {
            toast.error("Network error - Could not connect to server");
        }
    }
};

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/orders/status`,
        { orderId, status: event.target.value },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.data.success) {
        toast.success('Status updated successfully')
        await getOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getOrders()
    }
  }, [token])

  return (
    <div className="p-4 md:p-8">
      <h3 className="text-2xl font-bold mb-6">All Orders (Admin)</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Product</th>
              <th className="py-2 px-4 border-b">Buyer</th>
              <th className="py-2 px-4 border-b">Seller</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Payment</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">No orders found</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">#{order.id}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center">
                      <img 
                        src={order.image || assets.parcel_icon} 
                        alt={order.phone_name} 
                        className="w-10 h-10 mr-2 object-cover"
                      />
                      <div>
                        <p className="font-medium">{order.phone_name}</p>
                        <p className="text-sm text-gray-500">{order.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <p>{order.buyer_name}</p>
                    <p className="text-sm text-gray-500">{order.buyer_email}</p>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <p>{order.seller_name}</p>
                    <p className="text-sm text-gray-500">{order.seller_email}</p>
                  </td>
                  <td className="py-2 px-4 border-b">{currency}{order.amount}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.payment ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={order.status || 'Order Placed'}
                      onChange={(e) => statusHandler(e, order.id)}
                      className="p-1 border rounded text-sm"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Orders