import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userSelector } from '../redux/reducers/userReducer';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Textarea } from 'flowbite-react';
import sanitizeHtml from "sanitize-html";
import { commentSelector, createCommentThunk, getCommentsThunk, toggleLikeThunk } from '../redux/reducers/commentReducer';
import Comment from './Comment';

function CommentSection(props) {
    // console.log(props.post);
    const {post}=props;
    const {currentUser} =useSelector(userSelector);
    const {comments,error}=useSelector(commentSelector);
    // const [getComments,setGetComments]=useState([]);
    const [comment,setComment]=useState('');
    const [likes,setLikes]=useState(0);
    const [numberOfLikes,setNumberOfLikes]=useState('');
    const [publishError,setPublishError]=useState(null)
const dispatch=useDispatch();
const navigate=useNavigate();


useEffect(()=>{
dispatch(getCommentsThunk(post._id))
},[post._id])

    const handleSubmit=async (e)=>{
        e.preventDefault();
        if(comment.length>200){
            setPublishError("Comment cannot be more than 200 characters")
            return;
        }
        const sanitizedContent = sanitizeHtml(comment, { allowedTags: [] }).trim();
   
    
        if (sanitizedContent.length === 0) {
          setPublishError("Comment cannot be empty or only spaces.");
          return;
        }

const resultAction=await dispatch(createCommentThunk({content:comment.trim(),postId:post._id}));

if(createCommentThunk.fulfilled.match(resultAction)){
    setComment('');
    setPublishError(null)
}

if(createCommentThunk.rejected.match(resultAction)){
    setPublishError(resultAction.payload)
}
    }

    const handleLike=async(commentId)=>{
const resultAction=await dispatch(toggleLikeThunk(commentId))
if(toggleLikeThunk.fulfilled.match(resultAction)){
  console.log(resultAction.payload,'...fulfilled');
  setLikes([...likes,resultAction.payload.likes]);
  setNumberOfLikes(resultAction.payload.likes.length)
}

if(toggleLikeThunk.rejected.match(resultAction)){
  console.log(resultAction.payload,'...rejected');
  navigate('/signin')
}
    }

    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser?(
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as:</p>
                    <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt=""/>
                    <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
                    @ {currentUser.username}
                    </Link>
</div>
            ):(<div className='text-sm text-teal-500 my-5 flex gap-1'>
                You must be signed in to comment. 
                <Link className='text-blue-500 hover:underline' to={'/signin'}>
                    Sign In
                </Link>
            </div>)}
            {currentUser && (
                <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
                    <Textarea placeholder='Add a comment...' rows={3} maxLength={200} onChange={(e)=>setComment(e.target.value)} value={comment} />
                    <div className="flex justify-between items-center mt-5"><p className='text-gray-500 text-sm'>{200-comment.length} characters remaining</p>
                    <Button outline gradientDuoTone={'purpleToBlue'} type='Submit'>Submit</Button>
                    </div>
               {publishError && <Alert color={'failure'} className='mt-5'>
                {publishError}
                </Alert>}
                </form>
                
            )}
              {comments.length === 0 ? (
        <p className='text-sm my-5'>No comments yet!</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              handleLike={handleLike}
            />
          ))}
        </>
      )}
        </div>
    )
}

export default CommentSection
