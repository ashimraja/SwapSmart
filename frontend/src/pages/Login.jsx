import React from 'react';

const Login = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-6'>
      {/* Heading */}
      <h2 className='mb-6 text-3xl font-semibold text-center'>Login</h2>
      
      {/* Login Form */}
      <form className='flex flex-col w-full max-w-xs gap-4'>
        <input type='text' placeholder='Username' className='w-full p-5 border rounded' />
        <input type='password' placeholder='Password' className='w-full p-5 border rounded' />
        <button className='p-3 px-5 mx-auto mt-5 text-sm font-medium text-white bg-black w-fit hover:bg-gray-800'>LOGIN</button>
      </form>
      
      {/* Signup Link */}
      <p className='mt-4 text-sm'>Don't Have an account? <span className='font-semibold cursor-pointer'>SignUp</span></p>
    </div>
  );
};

export default Login;