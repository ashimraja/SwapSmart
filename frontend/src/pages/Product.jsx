import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import RelatedProducts from '../components/RelatedProducts';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const [phone, setPhone] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { currency, addToCart, navigate, cartItems } = useContext(ShopContext);
  
  useEffect(() => {
    const fetchPhoneDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/phones/${productId}`);
        setPhone(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setSelectedImageIndex(0);
        }
      } catch (error) {
        console.error('Failed to fetch phone details:', error);
      }
    };

    fetchPhoneDetails();
  }, [productId]);


  const handleBuyNow = () => {
    if (!phone) return;
    navigate(`/place-order/${phone.id}`);
  };

  const handleAddToCart = () => {
    if (!phone) return;
    
    // Check if item is already in cart (quantity > 0)
    const alreadyInCart = cartItems.some(item => item.phone_id === phone.id);
    
    if (alreadyInCart) {
      toast.success('Increased quantity in cart');
    } else {
      toast.success('Item added to cart');
    }
    
    addToCart(phone.id);
  };

  if (!phone) return <p>Loading...</p>;

  const selectedImage = phone.images && phone.images.length > 0 
    ? phone.images[selectedImageIndex] 
    : assets.placeholder_image;

  return (
    <div className='pt-10 transition-opacity duration-500 ease-in opacity-100'>
      {/* Product Data */}
      <div className='flex flex-col gap-12 sm:flex-row'>
        {/* Product Images */}
        <div className='flex flex-col-reverse flex-1 gap-3 sm:flex-row'>
          {/* Thumbnails */}
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal w-full sm:w-[18.7%] gap-2'>
            {phone.images && phone.images.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border-2 ${selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                alt={`Thumbnail ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Main Image */}
          <div className='w-full sm:w-[80%]'>
            <img 
              src={selectedImage} 
              className='w-full h-auto object-contain max-h-[500px]' 
              alt='Selected Product' 
            />
          </div>
        </div>
        
        {/* Product Details */}
        <div className='flex-1'>
          <h1 className='mt-2 text-2xl font-medium'>{phone.phoneName} {phone.model}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {[...Array(4)].map((_, i) => (
              <img key={i} src={assets.star_icon} alt='Star' className='w-3' />
            ))}
            <img src={assets.star_icon} alt='Star' className='w-3' />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>Rs {phone.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{phone.description}</p>
          <div className='flex flex-row gap-4'>
            <button 
              onClick={handleBuyNow}
              className='px-8 py-3 my-4 text-sm text-white bg-black active:bg-gray-700'
            >
              BUY NOW
            </button>
            <button
              onClick={handleAddToCart}
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
          <p>{phone.description}</p>
          {phone.ram && <p><strong>RAM:</strong> {phone.ram}</p>}
          {phone.rom && <p><strong>Storage:</strong> {phone.rom}</p>}
        </div>
      </div>

      {/* Display related products */}
      <RelatedProducts />
    </div>
  );
};

export default Product;