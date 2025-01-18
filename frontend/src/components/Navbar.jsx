import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {assests} from '../assests/assests'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {navigate} = useContext(ShopContext);
  return (
    <div className='flex items-center justify-between py-5 font-sans'>
      <Link to='/'><img className='w-36' alt="" /></Link>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1' >
          <p>HOME</p>
        </NavLink>
        <NavLink to='/sell' className='flex flex-col items-center gap-1' >
          <p>SELL</p>
        </NavLink>
        <NavLink to='/buy' className='flex flex-col items-center gap-1' >
          <p>BUY</p>
        </NavLink>
      </ul>
      <ul>
        <div className="flex items-center gap-6">
          <img className='w-5 cursor-pointer' src={assests.search_icon} alt="" />
          <div className='group relative'>
              <img src={assests.profile_icon} onClick={()=>navigate('/login')} className='w-5 cursor-pointer' alt="" />
              <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                    <p className='cursor-pointer hover:text-black'>My Profile</p>
                    <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                    <p className='cursor-pointer hover:text-black'>Logout</p>
                </div>
              </div>
          </div>
          <Link to='/cart' className='relative'>
              <img src={assests.cart_icon}  className='w-5 min-w-5' alt="" />
              <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>0</p>
          </Link>
          <img src={assests.menu_icon} onClick={()=>setVisible(true)}  className='w-5 cursor-pointer sm:hidden' alt="" />
        </div>
        {/* sidebar for smallscreens */}
        <div className={`absolute top-0 right-0 bottom-0 overflow-auto bg-white transition-all ${visible?'w-full':'w-0'}`}>
            <div className="flex flex-col text-gray-600">
                <div onClick={()=>setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
                    <img className='h-4 rotate-180' src={assests.dropdown_icon} alt="" />
                    <p>Back</p>
                </div>
                <NavLink onClick={()=>setVisible(false)} className="py-2 pl-6 border" to='/'>HOME</NavLink>
                <NavLink onClick={()=>setVisible(false)} className="py-2 pl-6 border" to='/collection'>COLLECTION</NavLink>
                <NavLink onClick={()=>setVisible(false)} className="py-2 pl-6 border" to='/about'>ABOUT</NavLink>
                <NavLink onClick={()=>setVisible(false)} className="py-2 pl-6 border" to='/contact'>Contact</NavLink>
            </div>
        </div>
      </ul>
    </div>
  )
}

export default Navbar
