import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../components/firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { doc, setDoc } from 'firebase/firestore'; 
import Navbar from '../components/Navbar';

const Signup = () => {
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [signupImage, setSignupImage] = useState(null); 

  const signup = async (e) => {
    e.preventDefault();

    if (signupPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
     
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;


      let imageURL = '';
      if (signupImage) {
        const imageRef = ref(storage, `${user.uid}`);
        const snapshot = await uploadBytes(imageRef, signupImage);
        imageURL = await getDownloadURL(snapshot.ref);
      }

      await updateProfile(user, {
        displayName: signupName,
        photoURL: imageURL,
      });


      await setDoc(doc(db, 'users', user.uid), {
        name: signupName,
        email: signupEmail,
        profilePic: imageURL,
        uid: user.uid,
        createdAt: new Date(),
      });


      console.log('User signed up and profile updated:', user);
    } catch (error) {
      console.log('Error signing up:', error.message);
      alert(`Error during sign-up: ${error.message}`);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      <form className='flex justify-center flex-col items-center mt-10 gap-7' onSubmit={signup}>
        <label>
          Full Name:
          <input
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 hover:border-gray-300 transition duration-300'
            type="text"
            placeholder="Enter Your Full Name"
            value={signupName}
            onChange={(event) => setSignupName(event.target.value)}
            required
          />
        </label>

        <label>
          Email:
          <input
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 hover:border-gray-300 transition duration-300'
            type="email"
            placeholder="Enter Your Email"
            value={signupEmail}
            onChange={(event) => setSignupEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password:
          <input
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 hover:border-gray-300 transition duration-300'
            type="password"
            placeholder="Enter Your Password"
            value={signupPassword}
            onChange={(event) => setSignupPassword(event.target.value)}
            required
          />
        </label>

        <label>
          Confirm Password:
          <input
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 hover:border-gray-300 transition duration-300'
            type="password"
            placeholder="Confirm Your Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </label>

        <input
          className='px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 hover:border-gray-300 transition duration-300'
          type="file"
          accept="image/*"
          onChange={(event) => setSignupImage(event.target.files[0])}
        />

        <button type="submit" className="bg-[#7749F8] text-white py-2 px-3 rounded-md">Signup</button>
      </form>
    </>
  );
};

export default Signup;
