import React, { useState, useEffect, useContext } from 'react';
import { assets } from '../assets/assets';
import ProductItem from './ProductItem';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const BuyRefurbished = () => {
  const { backendUrl } = useContext(ShopContext);
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailablePhones = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/phones`);
        if (response.data.success) {
          // Filter for available phones only
          const availablePhones = response.data.phones.filter(
            phone => phone.is_available === true
          );
          setPhones(availablePhones);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching phones:', error);
        toast.error('Failed to load phones');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailablePhones();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="my-10">
        <h1 className="mb-7 font-bold text-2xl">Buy Refurbished Phone</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-40 rounded-md"></div>
              <div className="bg-gray-200 h-4 mt-2 rounded"></div>
              <div className="bg-gray-200 h-4 mt-1 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-10">
      <h1 className="mb-7 font-bold text-2xl">Buy Refurbished Phone</h1>
      {phones.length === 0 ? (
        <p className="text-center py-10">No refurbished phones available at the moment</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {phones.map((phone) => (
            <ProductItem
              key={phone.id}
              id={phone.id}
              name={`${phone.brand} ${phone.phoneName}`}
              price={phone.price.toLocaleString('en-IN')}
              image={phone.image && phone.image.length > 0 ? phone.image[0] : assets.phone_placeholder}
              condition="Refurbished"
              ram={phone.ram}
              rom={phone.rom}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyRefurbished;