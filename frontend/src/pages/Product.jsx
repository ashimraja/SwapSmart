import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Product = () => {
  const { productId } = useParams();
  const [image, setImage] = useState(assets.iphone);
  const { currency, addToCart } = useContext(ShopContext);

  return (
    <div className='pt-10 transition-opacity duration-500 ease-in opacity-100'>
      {/* Product Data */}
      <div className='flex flex-col gap-12 sm:flex-row'>
        {/* Product Image */}
        <div className='flex flex-col-reverse flex-1 gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal w-full sm:w-[18.7%]'>
            {[assets.iphone, assets.iphone2, assets.iphone3, assets.iphone4].map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setImage(img)}
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'
                alt='Product Thumbnail'
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} className='w-full h-auto' alt='Selected Product' />
          </div>
        </div>
        {/* Product Details */}
        <div className='flex-1'>
          <h1 className='mt-2 text-2xl font-medium'>iPhone 14 Pro Max</h1>
          <div className='flex items-center gap-1 mt-2'>
            {[...Array(4)].map((_, i) => (
              <img key={i} src={assets.star_icon} alt='Star' className='w-3' />
            ))}
            <img src={assets.star_dull_icon} alt='Star' className='w-3' />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>Rs 47,000</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum labore animi aut ratione possimus ducimus ab quo quos, qui, beatae impedit dolorem molestias numquam in dolore fugiat temporibus vitae maxime?</p>
          <div className='flex flex-row gap-4'>
            <button className='px-8 py-3 my-4 text-sm text-white bg-black active:bg-gray-700'>BUY NOW</button>
            <button
              onClick={() => addToCart(productId)}
              className='px-8 py-3 my-4 text-sm text-white bg-black active:bg-gray-700'
            >
              ADD TO CART
            </button>
          </div>
          <hr className='mt-5 sm:w-4/5' />
          <div className='flex flex-col gap-1 mt-5 text-sm text-gray-500'>
            <p>100% Trusted Website.</p>
            <p>Cash on delivery is available for this product.</p>
          </div>
        </div>
      </div>

      {/* Description and Review Section */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='px-5 py-3 text-sm border'>Description</b>
          <p className='px-5 py-3 text-sm border'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 px-6 py-6 text-sm text-gray-500 border'>
          <p>An e-commerce website is an Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum sequi perspiciatis harum quidem veniam totam quam aperiam numquam. A, rerum. Sed necessitatibus explicabo rerum asperiores minima deserunt eos consequatur expedita.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis recusandae fugit rerum, provident officiis debitis illum nemo? Numquam doloribus officia, architecto eos error atque provident quasi voluptas sit unde quis.</p>
        </div>
      </div>

      {/* Display related products */}
      <RelatedProducts />
    </div>
  );
};

export default Product;