import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserForCommentThunk, userSelector } from '../redux/reducers/userReducer';
import {deleteCommentThunk, updateCommentThunk} from '../redux/reducers/commentReducer'
import moment from 'moment';
import {FaThumbsUp} from 'react-icons/fa';
import { Button, Modal, Textarea } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function Comment({comment,handleLike}) {
const dispatch=useDispatch();
const navigate=useNavigate();
const {currentUser}=useSelector(userSelector);
const [user,setUser]=useState([]);
const [editing,setEditing]=useState(false);
const [editedContent,setEditedContent]=useState(comment.content);
const [showDeleteModal,setShowDeleteModal]=useState(false);

const getUserForComment=async ()=>{
    const resultAction=await dispatch(getUserForCommentThunk(comment.userId))
    if(getUserForCommentThunk.fulfilled.match(resultAction)){
        setUser(resultAction.payload)
    }
}

useEffect(()=>{
    getUserForComment();
},[comment])

const handleEdit=()=>{
    setEditedContent(comment.content)
    setEditing(true);
    console.log(editedContent);
}
const handleSubmission=async ()=>{
const resultAction=await dispatch(updateCommentThunk({comment,editedContent}));
if(updateCommentThunk.fulfilled.match(resultAction)){
    setEditing(false);
    setEditedContent(null);
}
}
const handleDeleteComment=async()=>{
  if(!currentUser){
    navigate('/signin')
    return;
  }
    const resultAction=await dispatch(deleteCommentThunk(comment._id));
    setShowDeleteModal(false)
  }
    return (
        <div  className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className="flex-shrink-0 mr-3">
            <img src={user.profilePicture} className='w-10 h-10 rounded-full bg-gray-200'  alt={user.username} />
        </div>
        <div className="flex-1">
<div className="flex items-center mb-1">
    <span className='font-bold mr-1 text-xs truncate'>{user? `@ ${user.username}`:'anonymous user'}</span>
    <span className='text-xs text-gray-500'>{moment(comment.createdAt).fromNow()}</span>
</div>
{editing?(
<>
<Textarea className='w-full p-2 text-gray-700 bg-gray-200 rounded-md resize-none focus:outline-none' rows={3} value={editedContent} onChange={(e)=>setEditedContent(e.target.value)}/>
<div className="flex justify-end gap-2 mt-5 ">
    <Button type="button" onClick={handleSubmission}  gradientDuoTone={'purpleToBlue'}>Save</Button>
    <Button type="button" gradientDuoTone={'purpleToBlue'} onClick={()=>setEditing(false)} outline>Cancel</Button>
    </div>
    </>
):
(<><p className='text-gray-500 pb-2'>{comment.content}</p>
<div className="flex gap-2 items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit ">
    <button type='button' onClick={()=>handleLike(comment._id)} className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'} `}><FaThumbsUp className='text-sm '/></button>
    <p>{comment.numberOfLikes>0 && comment.numberOfLikes+" "+(comment.numberOfLikes===1?"like":"likes")}</p>
    {currentUser && (currentUser._id===comment.userId||currentUser.isAdmin) && (
<>
<button type='button' className='hover:text-blue-500 hover:underline' onClick={handleEdit}>Edit</button> 
        <button type='button' className='hover:text-red-500
        hover:underline' onClick={()=>setShowDeleteModal(true)}>Delete</button>
</> 
    )}
</div></>
)
}

        </div>
        
        <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
        
        </div>
    )
}

export default Comment
