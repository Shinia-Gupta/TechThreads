import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSelector} from "../redux/reducers/userReducer";
import { commentSelector,getAllCommentsThunk,getMoreCommentsThunk, deleteCommentThunk } from "../redux/reducers/commentReducer";

import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
// import { dashuserSelector, } from "../redux/reducers/dashUserReducer";
function DashComments() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(userSelector);
  const { comments } = useSelector(commentSelector);
  const [showMore,setShowMore]=useState(true);
  const [showDeleteModal,setShowDeleteModal]=useState(false);
  const [commentToDelete,setCommentToDelete]=useState(null);


  async function fetchComments() {

   const resultAction= await dispatch(getAllCommentsThunk());
  }

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);


  const handleShowMore=async ()=>{
    const startIndex=allComments.length;
    const resultAction=await dispatch(getMoreCommentsThunk(startIndex))
    if(getMoreCommentsThunk.fulfilled.match(resultAction)){
      if(resultAction.payload.comments.length<9){
        setShowMore(false)
      }
    }
  }

const handleDeleteCommentByAdmin=async()=>{
  const resultAction=await dispatch(deleteCommentThunk(commentToDelete));
  if(deleteCommentThunk.fulfilled.match(resultAction)){
setShowDeleteModal(false);
  }
}

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && comments?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>Post Id</Table.HeadCell>
              <Table.HeadCell>User Id</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body key={comment._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  
                  
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>

                  <Table.Cell>
                    <span onClick={()=>{setShowDeleteModal(true);setCommentToDelete(comment._id)}} className="text-red-500 font-medium hover:underline cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>
                 
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p>
      )}
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
              <Button color='failure' onClick={handleDeleteCommentByAdmin}>
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
  );
}

export default DashComments;

