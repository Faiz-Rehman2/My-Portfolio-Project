import React, { useState, useEffect } from 'react';
import { auth, db } from '../components/firebaseconfig'; 
import { signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [user, setUser] = useState(null); 
  const [blogs, setBlogs] = useState([]); 
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editingBlog, setEditingBlog] = useState(null); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchBlogs(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);


  const fetchBlogs = async (userId) => {
    const blogsRef = collection(db, 'blogs'); 
    const q = query(blogsRef, where('userId', '==', userId), orderBy('createdAt', 'desc')); 
    const querySnapshot = await getDocs(q); 
    const userBlogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
    setBlogs(userBlogs); 
  };

const addBlog = async (e) => {
  e.preventDefault();
  try {
    await addDoc(collection(db, 'blogs'), {
      title,
      body,
      userId: user.uid, 
      authorName: user.displayName, 
      createdAt: new Date(),
    });
    setTitle('');
    setBody('');
    fetchBlogs(user.uid);
  } catch (error) {
    console.log('Error adding blog:', error);
  }
};



  const editBlog = async (blogId) => {
    if (editingBlog) {
      try {
        await updateDoc(doc(db, 'blogs', blogId), { 
          title: editingBlog.title,
          body: editingBlog.body,
          updatedAt: new Date(), 
        });
        setEditingBlog(null); 
        fetchBlogs(user.uid); 
      } catch (error) {
        console.log('Error updating blog:', error);
      }
    }
  };


  // Delete a blog
  const deleteBlog = async (blogId) => {
    try {
      await deleteDoc(doc(db, 'blogs', blogId)); 
      fetchBlogs(user.uid); 
    } catch (error) {
      console.log(error);
    }
  };


  const handleLogout = async () => {
    await signOut(auth); // Sign out the user
    console.log('User logged out');
  };

  return (
    <>
      <Navbar />
  
      <div>
        {user && (
          <>
            <h1 className='text-center mt-2 font-serif'>Welcome, {user.displayName}</h1>
            <button className='float-end bg-[#7749F8] rounded p-1' onClick={handleLogout}>Logout</button>
            <br /><br />
  
            <h2 className='text-center'>Post a New Blog</h2>
            <div className="w-[70%] px-20 py-11 shadow-gray-200 shadow-xl bg-white flex justify-center">
                <form id="blog-form">
                    <input id="title" className="w-full mb-4 p-2 border-2 border-gray-200 rounded-lg outline-1 outline-[#7749F8]" type="text" placeholder="Title" required />
                    <textarea id="content" className="w-full mb-4 p-2 border-2 border-gray-200 rounded-lg outline-1 outline-[#7749F8]" placeholder="What is in your mind?" rows="4" required></textarea>
                    <button className="button p-1 rounded bg-[#7749F8]" type="submit"> Publish Blog </button>
                </form>
            </div>
  
            <h2 className='text-2xl text-center'>Your Blogs</h2>
            <div className="flex flex-wrap justify-center">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <div key={blog.id} className="bg-white shadow-md rounded-lg p-4 m-4 w-[300px]">
                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                    <p className="text-gray-700">{blog.body.slice(0, 100)}...</p>
                    <p className="text-gray-500 text-sm">Published on: {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}</p>
                    <p className="text-gray-500 text-sm">By: {user.displayName}</p>
                    <div className="flex justify-between mt-4">
                      <button onClick={() => setEditingBlog(blog)} className="text-blue-500">Edit</button>
                      <button onClick={() => deleteBlog(blog.id)} className="text-red-500">Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No blogs found</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
