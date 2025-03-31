import React, { useContext } from 'react';
import ProductCard from '../components/ProductCard';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';

const Cart = () => {
    const{navigate}=useContext(ShopContext);
  // Static cart data for testing
  const cartData = [
    {
      id: 1,
      name: "Apple iPhone 14",
      price: "37,799",
      image: assets.iphone,
    },
    {
      id: 2,
      name: "Samsung Galaxy S21",
      price: "29,999",
      image: assets.samsung,
    }
  ];

  return (
    <div className='border-t pt-14'>
      <h2 className="text-2xl mb-5 font-semibold">Your Cart</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cartData.map((item) => (
          <ProductCard key={item.id} id={item.id} name={item.name} price={item.price} image={item.image} />
        ))}
      </div>

      <div className="flex justify-end mt-10">
        <button onClick={()=>navigate('/place-order')} className='bg-black text-white text-sm px-8 py-3'>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
