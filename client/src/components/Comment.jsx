import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getUserForCommentThunk } from '../redux/reducers/userReducer';
import moment from 'moment';


function Comment({comment,key}) {
const dispatch=useDispatch();
const [user,setUser]=useState([]);

const getUserForComment=async ()=>{
    const resultAction=await dispatch(getUserForCommentThunk(comment.userId))
    if(getUserForCommentThunk.fulfilled.match(resultAction)){
        setUser(resultAction.payload)
    }
}

useEffect(()=>{
    getUserForComment();
},[comment])



    return (
        <div key={key} className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className="flex-shrink-0 mr-3">
            <img src={user.profilePicture} className='w-10 h-10 rounded-full bg-gray-200'  alt={user.username} />
        </div>
        <div className="flex-1">
<div className="flex items-center mb-1">
    <span className='font-bold mr-1 text-xs truncate'>{user? `@ ${user.username}`:'anonymous user'}</span>
    <span className='text-xs text-gray-500'>{moment(comment.createdAt).fromNow()}</span>
</div>
<p className='text-gray-500 pb-2'>{comment.content}</p>
        </div>
        
        
        
        </div>
    )
}

export default Comment
