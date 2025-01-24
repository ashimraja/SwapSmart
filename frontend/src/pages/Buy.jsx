import React, { useState } from 'react'
import { assets } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const Buy = () => {
  const [showFilter,setShowFilter] = useState(false);
  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-5 border-t'>
      <div className='min-w-60'>
        <p onClick={()=>setShowFilter(!showFilter)} className='my-1 pb-2 text-xl flex items-center cursor-pointer gap-2 font-medium'>FILTERS
        <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        <div className={`${showFilter ? '' :'hidden'} sm:block shadow-md`}>
          {/* Category Filter */}
          <div className='border-b-2 pl-5 py-3 mt-6'>
            <p className='mb-3 text-sm font-medium'>Brand</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'iphone'} />IPhone
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'samsung'} />Samsung
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'redmi'} />Redmi
              </p>
            </div>
          </div>
          {/* SubCategory filter */}
          <div className='border-b-2 pl-5 pb-3 my-5'>
            <p className='mb-3 text-sm font-medium'>RAM</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'2gb'} />2GB
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'3gb'} />3GB
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'4gb'} />4GB
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'6gb'} />6GB
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'8gb'} />8GB
              </p>
            </div>
          </div>
          <div className='pl-5 pb-3 my-5'>
            <p className='mb-3 text-sm font-medium'>STORAGE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'2gb'} />1 TB
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'3gb'} />128 GB
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'4gb'} />256 GB
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'6gb'} />512 GB
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'8gb'} />64 GB
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col gap-4'>
        <h1 className='text-xl font-medium mb-4'>Buy Refurbished Mobile Phone</h1>
        <ProductCard id={1} name={"Apple Iphone 14"} price={"37,799"} image={assets.iphone} />
        <ProductCard id={1} name={"Apple Iphone 14"} price={"37,799"} image={assets.iphone} />
        <ProductCard id={1} name={"Apple Iphone 14"} price={"37,799"} image={assets.iphone} />
        <ProductCard id={1} name={"Apple Iphone 14"} price={"37,799"} image={assets.iphone} />
        <ProductCard id={1} name={"Apple Iphone 14"} price={"37,799"} image={assets.iphone} />
        <ProductCard id={1} name={"Apple Iphone 14"} price={"37,799"} image={assets.iphone} />
      </div>
    </div>
  )
}

export default Buy
