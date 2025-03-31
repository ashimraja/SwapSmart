import React, { useState } from 'react';
import { assets } from '../assets/assets';

const Order = () => {
  const currency = '₹'; // Static currency symbol

  // Static order data
  const [orderData, setOrderData] = useState([
    {
      id: 1,
      name: "Apple iPhone 14",
      price: "37,799",
      quantity: 1,
      size: "128GB",
      image: [assets.iphone], // Sample image from assets
      date: "2024-03-30",
      paymentMethod: "Credit Card",
      payment: "Paid",
      status: "Shipped",
    },
    {
      id: 2,
      name: "Samsung Galaxy S23",
      price: "49,999",
      quantity: 1,
      size: "256GB",
      image: [assets.iphone2], // Sample image
      date: "2024-03-25",
      paymentMethod: "Cash on Delivery",
      payment: "Pending",
      status: "Processing",
    }
  ]);

  // Simulated "Track Order" function
  const trackOrder = () => {
    alert("Tracking is not available in static mode.");
  };

  return (
    <div className="border-t pt-16">
      {/* Page Title (Without Title Component) */}
      <h2 className="text-2xl font-semibold mb-6 text-center">MY ORDERS</h2>

      <div>
        {orderData.map((item, index) => (
          <div key={index} className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={item.image[0]} alt={item.name} />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p>{currency}{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className="mt-1">Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span></p>
                <p className="mt-1">Payment: <span className="text-gray-400">{item.paymentMethod}</span></p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className={`min-w-2 h-2 rounded-full ${item.status === "Shipped" ? "bg-green-500" : "bg-yellow-500"}`}></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <button onClick={trackOrder} className="border px-4 py-2 text-sm font-medium rounded-sm">
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
