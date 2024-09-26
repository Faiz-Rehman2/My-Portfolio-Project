import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../components/firebaseconfig.js'; 
import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';

const Signin = () => {
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  const signin = (e) => {
    e.preventDefault(); 
    signInWithEmailAndPassword(auth, signinEmail, signinPassword)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("User signed in: ", user);
      })
      
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error: ", errorCode, errorMessage);
      });
  };



  return (
    <>
    <Navbar />

      <form   className='flex justify-center flex-col items-center mt-10 gap-7 '
      onSubmit={signin}>
        <input  className='w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 hover:border-gray-300 transition duration-300'
          type="email"
          placeholder="Enter Your Email..."
          value={signinEmail}
          onChange={(event) => {
            setSigninEmail(event.target.value);
          }}
        />
        <input  className='w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 hover:border-gray-300 transition duration-300'
          type="password"
          placeholder="Enter Your Password..."
          value={signinPassword}
          onChange={(event) => {
            setSigninPassword(event.target.value);
          }}
        />
        <button type="submit"  className="bg-[#7749F8] text-white py-2 px-3 rounded-md">Signin</button>
       <Link to={"/Signup"}> <button type=""  className="bg-[#7749F8] text-white py-2 px-3 rounded-md">Register Here!</button></Link>
      </form>
    </>
  );
};

export default Signin;
