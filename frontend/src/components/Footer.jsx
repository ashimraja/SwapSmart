import React from 'react'

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">

        <div>
          {/* <img src="" className='mb-5 w-32' alt="" /> logo */}
          <p className='w-full md:w-2/3 text-gray-600'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam expedita ducimus rerum molestias iure, recusandae explicabo reiciendis eaque quasi error similique accusamus maiores harum sunt aut soluta nemo. Voluptatibus, natus!
          </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+91-6314967974</li>
            <li>mraja378@rku.ac.in</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024@ SwapSmart.com - All Right Reserved</p>
      </div>

    </div>
  )
}

export default Footer
