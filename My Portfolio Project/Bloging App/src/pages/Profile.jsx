import React, { useState, useEffect } from 'react';
import { auth, storage } from '../components/firebaseconfig'; 
import { updateProfile, updatePassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import Navbar from '../components/Navbar'; 

const Profile = () => {
  const [fullName, setFullName] = useState(''); 
  const [profilePic, setProfilePic] = useState(null); 
  const [password, setPassword] = useState(''); 
  const [user, setUser] = useState(null); 


  // Current User Data
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setFullName(currentUser.displayName || ''); 
    }
  }, []);



// Image Update function Here
  const PictureUpdate = async () => {
    if (profilePic) {
      const fileRef = ref(storage, `/${user.uid}`);
      await uploadBytes(fileRef, profilePic);
      const downloadURL = await getDownloadURL(fileRef);
      await updateProfile(user, { photoURL: downloadURL });
      console.log('Profile picture updated');
    }
  };



// Start here
// Name Update Here
  const profileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (fullName) {
        await updateProfile(user, {
          displayName: fullName,
        });
        console.log('Full name updated');
      }
 
      await PictureUpdate();

      if (password) {
        await updatePassword(user, password);
        console.log('Password updated');
      }

      setUser(auth.currentUser);
    } catch (error) {
      console.log('Error updating profile: ', error.message);
    }
  };



  return (
    <>
      <Navbar />

      <div className="profile-page flex justify-center items-center flex-col mt-10">
        {user && (
          <>
            <h1 className="text-2xl font-bold mb-5">Profile Page</h1>
            <p className="text-gray-600 mb-5">Update your profile information</p>

            <form onSubmit={profileUpdate} className="flex flex-col gap-4 items-center">
              <div className="flex flex-col items-center">
                <img
                  src={user.photoURL || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  width="150"
                  height="150"
                  className="mb-4"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                  className="file-input"
                />
              </div>

              <div>
                <label className="block text-gray-700">Full Name:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="border rounded px-4 py-2 w-80"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700">New Password (optional):</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  className="border rounded px-4 py-2 w-80"
                />
              </div>

              <button type="submit" className="bg-[#7749F8] text-white py-2 px-4 rounded-md mt-4">
                Update Profile
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
