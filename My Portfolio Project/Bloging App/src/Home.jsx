import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './components/firebaseconfig';
import Navbar from './components/Navbar';



const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getBlogs();
  }, []);


  const getBlogs = async () => {
    try {
      const blogsRef = collection(db, 'blogs');
      const q = query(blogsRef, orderBy('createdAt', 'asc')); 
      const querySnapshot = await getDocs(q);
      const allBlogs = querySnapshot.docs.map(doc => (
        { id: doc.id,  ...doc.data() 
      }
    ));
      setBlogs(allBlogs);
      console.log(allBlogs)
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };



  return (
    <>
      <Navbar />
      <h2 className='text-2xl text-center'>All Blogs</h2>
      <div className="flex flex-wrap justify-center">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="bg-white shadow-md rounded-lg p-4 m-4 w-[300px]">
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-gray-700">{blog.body.slice(0, 100)}...</p>
              <p className="text-gray-500 text-sm">Published on: {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}</p>
              <p className="text-gray-500 text-sm">By: {blog.authorName || "Guest"}</p>
              <button className="text-blue-500 mt-2">Read More</button>
            </div>
          ))
        ) : (
          <p>No blogs found</p>
        )}
      </div>
    </>
  );
};

export default Home;
