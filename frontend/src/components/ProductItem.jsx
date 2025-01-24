import React from 'react'
import { Link } from 'react-router-dom'

const ProductItem = ({id, image ,name ,price}) => {
  return (
    <Link className='cursor-pointer' to={`/buy/product/${id}`}>
      <div className='border border-gray-400 p-2 rounded-md'>
        <img src={image} alt="" />
        <p>Rs 42000 OFF</p>
        <h2>{name} - Refurnished</h2>
        <div className='flex gap-2 py-4'>
            <div className=' text-white bg-blue-900 p-1 text-sm rounded-sm'>Republic Day Sale</div>
            <div className='border rounded-sm py-1 px-2 text-sm'>4.8</div>
        </div>
        <div className='flex gap-3 font-semibold'>
            <p className='text-red-600'>-53%</p>
            <p className='text-md'>Rs {price}</p>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
