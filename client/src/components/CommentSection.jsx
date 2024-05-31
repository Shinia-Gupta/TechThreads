import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userSelector } from '../redux/reducers/userReducer';
import { Link } from 'react-router-dom';
import { Alert, Button, Textarea } from 'flowbite-react';
import sanitizeHtml from "sanitize-html";
import { createCommentThunk } from '../redux/reducers/comment.reducer';

function CommentSection({post}) {
    const {currentUser} =useSelector(userSelector);
    const [comment,setComment]=useState('');
    const [publishError,setPublishError]=useState(null)
const dispatch=useDispatch();


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

const resultAction=await dispatch(createCommentThunk({content:comment,postId:post._id}));

if(createCommentThunk.fulfilled.match(resultAction)){
    setComment('');
    setPublishError(null)
}

if(createCommentThunk.rejected.match(resultAction)){
    setPublishError(resultAction.payload)
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
        </div>
    )
}

export default CommentSection
