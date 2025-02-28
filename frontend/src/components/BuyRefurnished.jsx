import React from 'react'
import { assets } from '../assets/assets'
import ProductItem from './ProductItem'

const BuyRefurnished = () => {
  return (
    <div className='my-10'>
      <h1 className='mb-7 font-bold text-2xl'>Buy Refurnished Phone</h1>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        <ProductItem id={1} name={"Apple Iphone 14"} price={"37,799"} image={assets.iphone} />
        <ProductItem id={1} name={"Apple Iphone 14"} price={"37,799"} image={assets.iphone} />
        <ProductItem id={1} name={"Apple Iphone 14"} price={"37,799"} image={assets.iphone} />
        <ProductItem id={1} name={"Apple Iphone 14"} price={"37,799"} image={assets.iphone} />
        <ProductItem id={1} name={"Apple Iphone 14"} price={"37,799"} image={assets.iphone} />
        <ProductItem id={1} name={"Apple Iphone 14"} price={"37,799"} image={assets.iphone} />
        <ProductItem id={1} name={"Apple Iphone 14"} price={"37,799"} image={assets.iphone} />
      </div>
    </div>
  )
}

//
//
// 

export default BuyRefurnished 
