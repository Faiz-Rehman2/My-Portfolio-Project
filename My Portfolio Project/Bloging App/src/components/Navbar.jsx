import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseconfig'; 

const Navbar = () => {
  const [user] = useAuthState(auth);

  return (
    <>
      <header className='flex justify-between bg-[#7749F8] p-3 text-slate-100 font-medium'>
        <nav>
          <h3 className=' ml-14'>Blogging App</h3>
        </nav>
        <nav className='gap-5'>
          <Link to={"/"}><button className='mx-2 my-2 cursor-pointer'>Home</button></Link>
          <Link to={"/dashboard"}><button className='mx-2 my-2 cursor-pointer'>Dashboard</button></Link>
          <Link to={"/profile"}><button className='mx-2 my-2 cursor-pointer'>Profile</button></Link>
        </nav>
        <nav className='flex gap-5 mr-20'>
          <button className='cursor-pointer'>
            {user ? user.displayName || "No Name" : "Guest"}
          </button>
          <button className='cursor-pointer'>
            {user ? "Logged In" : "Logged Out"}
          </button>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
