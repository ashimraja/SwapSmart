import React from 'react'
import { assets } from '../assets/assets'

const OurService = () => {
  return (
    <div className='my-24'>
      <h1 className='mb-7 font-bold text-2xl'>Our Services</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
        <div className='text-center'>
            <img src={assets.sell_phone} alt="" />
            <p className='font-semibold'>Sell Phone</p>
        </div>
        <div className='text-center'>
            <img src={assets.buy_phone} alt="" />
            <p className='font-semibold'>Buy Phone</p>
        </div>
        <div className='text-center'>
            <img src={assets.repair_phone} alt="" />
            <p className='font-semibold'>Repair Phone</p>
        </div>
        <div className='text-center'>
            <img src={assets.find_new_phone} alt="" />
            <p className='font-semibold'>Find New Phone</p>
        </div>
      </div>
    </div>
  )
}

export default OurService
