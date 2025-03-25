import React from 'react'

const Sell = () => {
  return (
    <div className='p-6'>
      <h1 className='mb-2 text-xl font-bold'>Sell Your Product</h1>
      <p className='mb-4 text-gray-500'>Start selling your products quickly and easily.</p>
      
      <form className='flex flex-col gap-3'>
        <input type='text' placeholder='Product Name' className='p-2 border rounded'/>
        <input type='number' placeholder='Price' className='p-2 border rounded'/>
        <textarea placeholder='Description' className='p-2 border rounded'></textarea>
        <button className='p-2 text-white bg-blue-500 rounded hover:bg-blue-600'>Submit</button>
      </form>
    </div>
  )
}

export default Sell