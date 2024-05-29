import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useDispatch, useSelector} from 'react-redux'
import { postSelector, setImageUploadProgress, uploadPostImageThunk } from '../redux/reducers/postReducer';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function CreatePost() {
    const {imageFileUploadProgress,error}=useSelector(postSelector)
const [file,setFile]=useState(null);
const [formData,setFormData]=useState({});
const [imageFileUploading,setImageFileUploading]=useState(false);
const [uploadError,setUploadError]=useState(null);
const dispatch=useDispatch();
useEffect(()=>{
    setTimeout(()=>{setUploadError(null)},4000);

},[uploadError])
const handleUploadImage=async ()=>{
    if(!file){
         setUploadError("Please provide an image! ")
         return;
    }
    setImageFileUploading(true);
const resultAction=await dispatch(uploadPostImageThunk({imageFile:file}))
if (uploadPostImageThunk.rejected.match(resultAction)) {
    setTimeout(() => {
        dispatch(setImageUploadProgress(null));
        setFile(null);
        // dispatch(setImageFileUrl(prevImageFileUrl));
    }, 5000);
}
if (uploadPostImageThunk.fulfilled.match(resultAction)) {
console.log(resultAction);
    setFormData({ ...formData, image: resultAction.payload });
    setTimeout(() => { dispatch(setImageUploadProgress(null));

     }, 5000);
}
setImageFileUploading(false)
}



    return (
       <>
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
           
          />
          <Select>
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nodejs'>Node.js</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
             onChange={(e)=>setFile(e.target.files[0])}/>
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUploadImage}
            disabled={imageFileUploading}
                >
{imageFileUploadProgress?
<div className='w-16 h-16'>
    <CircularProgressbar value={imageFileUploadProgress} text={`${imageFileUploadProgress} %`}/>
</div>:"Upload Image"}
         </Button>
        </div>
        {error||uploadError &&
         <Alert color='failure'>{error||uploadError}</Alert>
         }
        {formData.image && ( 
           <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          /> 
         )}
        <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' required/>
      
       
       
        <Button type='submit' gradientDuoTone='purpleToPink' disabled={imageFileUploading}>
          Publish
        </Button>
        {/* {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )} */}
      </form>
    </div>
        </>
    )
}

export default CreatePost
