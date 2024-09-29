import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../components/firebaseconfig';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom'; 

const UserBlog = () => {
  const { userId } = useParams(); 
  const [singleUserBlog, setSingleUserBlog] = useState([]); 

  useEffect(() => {
    fetchUserBlogs(userId);
  }, [userId]);


  // Single user blog
  const fetchUserBlogs = async (userId) => {
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const singleUserBlog = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSingleUserBlog(singleUserBlog);
  };

  return (
    <>
      <Navbar />

      <h2 className='text-2xl text-center'>User Blogs</h2>
      <div className="flex flex-wrap justify-center">
        {singleUserBlog.length > 0 ? (
          singleUserBlog.map((blog) => (
            <div key={blog.id} className="bg-white shadow-md rounded-lg p-4 m-4 w-[300px]">
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-gray-700">{blog.body.slice(0, 100)}...</p>
              <p className="text-gray-500 text-sm">Published on: {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}</p>
              {/* <button className="text-blue-500 mt-2">Read More</button> */}
            </div>
          ))
        ) : (
          <p>No blogs found</p>
        )}
      </div>
    </>
  );
};

export default UserBlog;

