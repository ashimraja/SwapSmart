import React from 'react';

const Contact = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-10 p-12'>
      {/* Heading */}
      <h2 className='mb-6 text-3xl font-semibold text-center'>Contact Us</h2>
      
      {/* Content Wrapper */}
      <div className='flex flex-col items-center w-full max-w-4xl gap-10 md:flex-row'>
        {/* Image Section */}
        <div className='w-full md:w-1/2'>
          <img src='/contact_img.png' alt='Office setup' className='w-full rounded-md' />
        </div>
        
        {/* Contact Info Section */}
        <div className='w-full text-center md:w-1/2 md:text-left'>
          <div className='space-y-4 text-gray-700'>
            <div>
              <p className='text-lg font-bold'>Our Store</p>
              <p className='text-base'>Rajkot 360001, Gujarat, India</p>
              <p className='text-base'>Tel: (+91) 7970751234</p>
            </div>
            <div>
              <p className='text-lg font-bold'>Careers at SwapSmart</p>
              <p className='text-base'>Learn more about our teams and job openings.</p>
            </div>
          </div>
          <button className='px-6 py-3 mt-6 text-sm font-medium border rounded hover:bg-gray-100'>BUY NOW</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;