import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentPostsThunk, getAPostBySlugThunk, postSelector } from "../redux/reducers/postReducer";
import {Button, Spinner} from 'flowbite-react'
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const dispatch = useDispatch();
const {loading}=useSelector(postSelector);

async function getPostDetail() {
    const resultAction = await dispatch(getAPostBySlugThunk(slug));
    if (getAPostBySlugThunk.fulfilled.match(resultAction)) {
      setPost(resultAction.payload.posts[0]);
    }
  }

useEffect(()=>{
  fetchRecentPosts();
},[])

async function fetchRecentPosts(){
const resultAction=await dispatch(fetchRecentPostsThunk());
if(fetchRecentPostsThunk.fulfilled.match(resultAction)){
  console.log(resultAction.payload);
  setRecentPosts(resultAction.payload.posts);
}
}


  useEffect(() => {
    getPostDetail();
  }, [slug]);
  

if(loading)
    return (
        <div className='flex justify-center items-center min-h-screen'>
          <Spinner size='xl' />
        </div>
      );
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full"><CallToAction />
      
      {post && <CommentSection post={post} />}
      </div>
      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent Articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}

export default PostDetailPage;
