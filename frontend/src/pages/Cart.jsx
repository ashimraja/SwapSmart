import React, { useContext, useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cart = () => {
  const { navigate, cartItems, backendUrl, token, removeFromCart } = useContext(ShopContext);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        if (cartItems.length === 0) {
          setCartProducts([]);
          setTotal(0);
          setLoading(false);
          return;
        }

        const productPromises = cartItems.map(phoneId =>
          axios.get(`${backendUrl}/api/phones/${phoneId}`)
        );

        const responses = await Promise.all(productPromises);
        const products = responses.map(res => res.data);
        
        setCartProducts(products);
        setTotal(products.reduce((sum, product) => sum + product.price, 0));
        
      } catch (error) {
        console.error('Error fetching cart products:', error);
        toast.error('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [cartItems, backendUrl]);

  const handleRemoveItem = async (phoneId) => {
    try {
      await removeFromCart(phoneId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleBuyNow = (phoneId) => {
    navigate(`/place-order/${phoneId}`);
  };

  if (loading) {
    return (
      <div className='border-t pt-14'>
        <h2 className="text-2xl mb-5 font-semibold">Your Cart</h2>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className='border-t pt-14'>
      <h2 className="text-2xl mb-5 font-semibold">Your Cart</h2>
      
      {cartProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button 
            onClick={() => navigate('/buy')}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cartProducts.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard 
                  id={product.id} 
                  name={`${product.brand} ${product.phoneName}`} 
                  price={product.price} 
                  firstHandPrice={product.firstHandPrice}
                  image={product.images?.[0]} 
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleBuyNow(product.id)}
                    className="bg-black text-white px-4 py-1 text-sm rounded"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleRemoveItem(product.id)}
                    className="bg-red-500 text-white px-4 py-1 text-sm rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Subtotal:</span>
              <span className="font-semibold">Rs {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Delivery Fee:</span>
              <span className="font-semibold">Rs 100</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold">Rs {(total + 100).toLocaleString()}</span>
            </div>

            <div className="flex justify-end gap-4">
              <button 
                onClick={() => navigate('/buy')}
                className="border border-black text-black px-6 py-2 rounded hover:bg-gray-100"
              >
                Continue Shopping
              </button>
              
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;