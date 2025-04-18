import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ id, image, name, price, firstHandPrice }) => {
  // Calculate discount information
  const discountAmount = firstHandPrice - price;
  const discountPercentage = Math.round((discountAmount / firstHandPrice) * 100);

  // Format price with commas for Indian rupees
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  return (
    <Link className="cursor-pointer" to={`/product/${id}`}>
      <div className="border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-5 rounded-sm p-4 items-center">
        <img
          src={image}
          alt=""
          className="w-full sm:w-1/4 object-contain max-h-32"
        />
        <div className="text-center sm:text-left flex flex-col justify-between w-full">
          {/* Display actual discount amount */}
          <p className="text-sm text-gray-600 sm:mb-2">Rs {formatPrice(discountAmount)} OFF</p>
          
          <h2 className="text-lg font-semibold">{name} - Refurbished</h2>

          <div className="flex justify-center sm:justify-start gap-2 py-3">
            <div className="text-white bg-blue-900 px-2 py-1 text-sm rounded-sm">
              Republic Day Sale
            </div>
            
            <div className="border rounded-sm px-2 py-1 text-sm">4.8</div>
          </div>

          <div className="flex justify-center sm:justify-start gap-3 font-semibold">
            {/* Display actual discount percentage */}
            <p className="text-red-600 text-sm sm:text-base">-{discountPercentage}%</p>
            <p className="text-md">Rs {formatPrice(price)}</p>
          </div>

          <div className='py-3'>
            <p className='text-sm text-gray-600'>Free Delivery · COD Available</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;