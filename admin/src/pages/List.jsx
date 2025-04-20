import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl, currency } from '../App';

const AdminPhonesList = ({ token }) => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPhones = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/phones/all-phones`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setPhones(response.data.phones);
        console.log(response.data.phones);
        
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Fetch phones error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch phones');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (phoneId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/phones/toggleavailability`,
        { phoneId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchPhones(); // Refresh the list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle availability');
    }
  };

  const deletePhone = async (phoneId) => {
    if (!window.confirm('Are you sure you want to delete this phone?')) return;
    
    try {
      const response = await axios.delete(
        `${backendUrl}/api/phones/${phoneId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchPhones(); // Refresh the list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete phone');
    }
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  if (loading) return <div>Loading phones...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Phones (Admin)</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Details</th>
              <th className="py-2 px-4 border-b">Seller</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {phones.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No phones found</td>
              </tr>
            ) : (
              phones.map((phone) => (
                <tr key={phone.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <img 
                      src={phone.images?.[0] || '/placeholder-phone.jpg'} 
                      alt={phone.phoneName} 
                      className="w-16 h-16 object-contain"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <p className="font-medium">{phone.brand} {phone.phoneName}</p>
                    <p className="text-sm text-gray-600">{phone.model}</p>
                    <p className="text-sm">{phone.ram}GB RAM / {phone.rom}GB ROM</p>
                    <p className="text-sm">{phone.city}, {phone.country}</p>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <p>{phone.sellerInfo.name}</p>
                    <p className="text-sm text-gray-600">{phone.sellerInfo.email}</p>
                    <p className="text-sm">{phone.phone}</p>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <p>{currency}{phone.price}</p>
                    {phone.firstHandPrice && (
                      <p className="text-sm text-gray-600">Original: {currency}{phone.firstHandPrice}</p>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        phone.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {phone.isAvailable ? 'Available' : 'Sold'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => toggleAvailability(phone.id)}
                      className="mr-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      Toggle Status
                    </button>
                    <button
                      onClick={() => deletePhone(phone.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPhonesList;