import React, { useEffect, useRef, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {setImageFileUrl, setImageUploadProgress, uploadImageThunk, userSelector} from '../redux/reducers/userReducer'
import { Alert, Button, TextInput } from 'flowbite-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function DashProfile() {
    const {currentUser,error,imageFileUploadProgress,imageFileUrl}=useSelector(userSelector);
    const [imageFile,setImageFile]=useState(null);
    const [prevFile,setPrevFile]=useState(null);
const [prevImageFileUrl,setPrevImageFileUrl]=useState(null)
const filePickerRef=useRef();
const dispatch=useDispatch();

useEffect(()=>{
    if(imageFile){
        uploadImage();
    }
},[imageFile])

const uploadImage=async ()=>{
    
const resultAction=await dispatch(uploadImageThunk({imageFile}))
if(uploadImageThunk.rejected.match(resultAction)){
    setTimeout(()=>{
        dispatch(setImageUploadProgress(null));
        setImageFile(prevFile);
        dispatch(setImageFileUrl(prevImageFileUrl))
    },5000)
   
}
if(uploadImageThunk.fulfilled.match(resultAction)){
    setPrevFile(imageFile);
    setPrevImageFileUrl(resultAction.payload);
}
}

const handleImgChange=(e)=>{
    const file=e.target.files[0];
    if(file){
    setImageFile(file);
    dispatch(setImageFileUrl(URL.createObjectURL(file)))
}
}


    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
<form className='flex flex-col gap-4'>
    <input type="file" accept='image/*' onChange={handleImgChange} ref={filePickerRef} hidden/>
    <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative' onClick={()=>filePickerRef.current.click()}>
        {!error &&  imageFileUploadProgress && (
            <CircularProgressbar value={imageFileUploadProgress||0} text={`${imageFileUploadProgress}%`} strokeWidth={5} styles={{
                root:{
                    width:"100%",
                    height:"100%",
                    position:"absolute",
                    top:0,
                    left:0
                },
                path:{
                    stroke:`rgba(62,152,199,${imageFileUploadProgress/100})`
                }
            }}/>
        )}
    <img src={imageFileUrl||currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${ imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-60'}`}/>
    </div>
    <TextInput type='text' id='username'placeholder='Username' defaultValue={currentUser.username}/>
    
    <TextInput type='email' id='email'placeholder='Email' defaultValue={currentUser.email}/>
    
    <TextInput type='password' id='password'placeholder='password'/>
    <Button type='submit' gradientDuoTone={'purpleToBlue'} outline>Update</Button>
</form>
<div className='text-red-500 flex justify-between mt-5'>
<span className='cursor-pointer'>Delete Account</span>
<span className='cursor-pointer'>Sign Out</span>
</div>
{error && 
<Alert color='failure'>{error}</Alert>
}
</div>
    )
}

export default DashProfile
