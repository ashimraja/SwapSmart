import React, { useState } from 'react'
import { assets } from '../assets/assets'
import RelatedProducts from './RelatedProducts'

const Product = () => {
    const [size, setSize] = useState('')
    const [image,setImage] = useState('')
  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Image */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
          <img src={assets.iphone} onClick={()=>setImage(assets.iphone)} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
          <img src={assets.iphone2} onClick={()=>setImage(assets.iphone2)} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
          <img src={assets.iphone3} onClick={()=>setImage(assets.iphone3)} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
          <img src={assets.iphone4} onClick={()=>setImage(assets.iphone4)} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className='w-full h-auto' alt=""/>
          </div>
        </div>
        {/* Product Details */}
        <div className="flex-1">
          <h1 className='font-medium text-2xl mt-2'>Iphone 14 Pro Max</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className='w-3'/>
            <img src={assets.star_icon} alt="" className='w-3'/>
            <img src={assets.star_icon} alt="" className='w-3'/>
            <img src={assets.star_icon} alt="" className='w-3'/>
            <img src={assets.star_dull_icon} alt="" className='w-3'/>
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>Rs 47000</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum labore animi aut ratione possimus ducimus ab quo quos, qui, beatae impedit dolorem molestias numquam in dolore fugiat temporibus vitae maxime?</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
                <button onClick={()=>setSize('S')} className={`border py-2 px-4 bg-gray-100 ${size === "S" ?'border-orange-500' : ''}`} >S</button>
                <button onClick={()=>setSize('M')} className={`border py-2 px-4 bg-gray-100 ${size === "M" ?'border-orange-500' : ''}`} >M</button>
                <button onClick={()=>setSize('L')} className={`border py-2 px-4 bg-gray-100 ${size === "L" ?'border-orange-500' : ''}`} >L</button>
                <button onClick={()=>setSize('XL')} className={`border py-2 px-4 bg-gray-100 ${size === "XL" ?'border-orange-500' : ''}`} >XL</button>
            </div>
          </div>
          <button className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5'/>
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Trusted Website.</p>
            <p>Cash on delivery is available for this product</p>
          </div>
        </div>
      </div>

      {/* Sescription and Review Section */}
      <div className='mt-20'>
        <div className="flex">
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>An e-commerce website is an Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum sequi perspiciatis harum quidem veniam totam quam aperiam numquam. A, rerum. Sed necessitatibus explicabo rerum asperiores minima deserunt eos consequatur expedita.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis recusandae fugit rerum, provident officiis debitis illum nemo? Numquam doloribus officia, architecto eos error atque provident quasi voluptas sit unde quis.
          </p>
        </div>
      </div>
      {/* display related product */}
      <RelatedProducts />
    </div>
  )
}

export default Product
