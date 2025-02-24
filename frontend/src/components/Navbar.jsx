import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { navigate, getCartCount } = useContext(ShopContext);
  return (
    <div className='sticky top-0 z-50 border-b border-transparent shadow-lg bg-white'>
      <div className='flex items-center justify-between py-5 font-sans px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Link to='/'><img className='w-36' alt="" /></Link>
        <ul className='hidden sm:flex gap-10 text-sm text-black font-semibold'>
          <NavLink to='/' className='flex flex-col items-center gap-1' >
            <p>HOME</p>
          </NavLink>
          <NavLink to='/sell' className='flex flex-col items-center gap-1' >
            <p>SELL</p>
          </NavLink>
          <NavLink to='/buy' className='flex flex-col items-center gap-1' >
            <p>BUY</p>
          </NavLink>
          <NavLink to='/about' className='flex flex-col items-center gap-1' >
            <p>ABOUT</p>
          </NavLink>
          <NavLink to='/contact' className='flex flex-col items-center gap-1' >
            <p>CONTACT</p>
          </NavLink>
        </ul>
        <ul>
          <div className="flex items-center gap-6 font-bold">
            <img className='w-5 cursor-pointer' src={assets.search_icon} alt="" />
            <div className='group relative'>
              <img src={assets.profile_icon} onClick={() => navigate('/login')} className='w-5 cursor-pointer' alt="" />
              <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <p className='cursor-pointer hover:text-black'>My Profile</p>
                  <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                  <p className='cursor-pointer hover:text-black'>Logout</p>
                </div>
              </div>
            </div>
            <Link to='/cart' className='relative'>
              <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
              <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
            </Link>
            <img src={assets.menu_icon} onClick={() => setVisible(true)} className='w-5 cursor-pointer sm:hidden' alt="" />
          </div>
          {/* sidebar for smallscreens */}
          <div className={`absolute top-0 right-0 bottom-0 overflow-auto bg-white transition-all ${visible ? 'w-full h-screen' : 'w-0'}`}>
            <div className="flex flex-col text-gray-600">
              <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
                <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                <p>Back</p>
              </div>
              <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/'>HOME</NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/buy'>BUY</NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/sell'>SELL</NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/about'>ABOUT</NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to='/contact'>Contact</NavLink>
            </div>
          </div>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
