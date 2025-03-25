import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-10 p-12'>
      {/* Heading */}
      <h2 className='mb-6 text-3xl font-semibold text-center'>Contact Us</h2>
      
      {/* Content Wrapper */}
      <div className='flex flex-col items-center w-full max-w-4xl gap-10 md:flex-row'>
        {/* Image Section */}
        <div className='w-full md:w-1/2'>
          <img src={assets.contact_img} alt='Office setup' className='w-full' />
        </div>
        
        {/* Contact Info Section */}
        <div className='w-full text-center md:w-1/2 md:text-left'>
          <div className='space-y-4 text-gray-700'>
            <div>
              <p className='my-3 text-lg font-semibold'>Our Store</p>
              <p className='my-3 text-base font-light text-gray-700'>Rajkot 360001, Gujarat, India</p>
              <p className='my-3 text-base font-light text-gray-700'>Tel: (+91) 7970751234</p>
            </div>
            <div>
              <p className='my-3 text-lg font-semibold'>Careers at SwapSmart</p>
              <p className='my-3 text-base font-light text-gray-700'>Learn more about our teams and job openings.</p>
            </div>
          </div>
          <button className='px-6 py-2 mt-4 text-sm font-medium text-gray-500 border-2 border-gray-300 hover:bg-gray-100'>BUY NOW</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;