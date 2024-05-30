import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getUsersThunk } from "../redux/reducers/userReducer";
import { userSelector } from "../redux/reducers/userReducer";

import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {FaCheck,FaTimes} from 'react-icons/fa'
import { dashuserSelector,getUsersThunk,getMoreUsersThunk } from "../redux/reducers/dashUserReducer";
function DashUsers() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(userSelector);
  const {allUsers}=useSelector(dashuserSelector)
  const [showMore,setShowMore]=useState(true);
  const [showDeleteModal,setShowDeleteModal]=useState(false);
  const [currentUserToDelete,setCurrentUserToDelete]=useState(null);


  async function fetchUsers() {
    const startIndex=allUsers.length;

    const resultAction=await dispatch(getUsersThunk(startIndex));
  }

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);


  const handleShowMore=async ()=>{
    const startIndex=allUsers.length;
    const resultAction=await dispatch(getMoreUsersThunk(startIndex))
    if(getMoreUsersThunk.fulfilled.match(resultAction)){
      if(resultAction.payload.users.length<9){
        setShowMore(false)
      }
    }
  }

const handleDeletePost=async()=>{
//   const resultAction=await dispatch(deletePostThunk(currentUserToDelete));
//   console.log(resultAction);
//   setShowDeleteModal(false)
}

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && allUsers?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {allUsers.map((user) => (
              <Table.Body key={user._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {/* <Link to={`/user/${user.slug}`}> */}
                      {
                        <img
                          src={user.profilePicture}
                          alt={user.title}
                          className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                        />
                      }
                    {/* </Link> */}
                  </Table.Cell>
                  <Table.Cell>
                    {/* <Link
                      to={`/user/${user.slug}`}
                      className="font-medium text-gray-900 dark:text-white"
                    > */}
                      {user.username}
                    {/* </Link> */}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isAdmin?<FaCheck className='text-green-500'/>:<FaTimes className='text-red-500'/>}</Table.Cell>

                  <Table.Cell>
                    <span onClick={()=>{setShowDeleteModal(true);setCurrentUserToDelete(user._id)}} className="text-red-500 font-medium hover:underline cursor-pointer">
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
        <p>You have no users yet!</p>
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
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>
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

export default DashUsers;
