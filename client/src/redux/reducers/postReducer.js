import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { app } from '../../config/firebaseInit.js';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';

const initialState = {
  error: null,
  message:null,
  loading: false,
  imageFileUploadProgress:null,
  imageFileUrl:null,
};


export const uploadPostImageThunk = createAsyncThunk('post/uploadPostImage', async (args, thunkAPI) => {
  const storage = getStorage(app);
  const fileName = new Date().getTime() + args.imageFile.name;
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef, args.imageFile);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        thunkAPI.dispatch(setImageUploadProgress(progress.toFixed(0)));
      },
      (error) => {
       return reject(thunkAPI.rejectWithValue(error.message));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          thunkAPI.dispatch(setImageFileUrl(downloadUrl));
          resolve(downloadUrl);
        }).catch((error) => {
        return reject(thunkAPI.rejectWithValue(error.message));
        });
      }
    );
  });
});


// export const updateUserThunk=createAsyncThunk('user/updateUserProfile',async(args,thunkAPI)=>{
//   const state = thunkAPI.getState();
//   const { currentUser } = state.postReducer;
//   // console.log(currentUser,args.formData);
//   try{
// const resp=await fetch(`/api/user/update/${currentUser._id}`,{
//   method:'PUT',
//   headers:{'Content-Type':'application/json'},
//   body:JSON.stringify(args.formData)
// })
// const data=await resp.json();

// if(!resp.ok){
// thunkAPI.rejectWithValue(data.message);
// }
// return data;
//   }catch(error){
//     thunkAPI.rejectWithValue(error.message);
//   }
// })

// export const deleteUserThunk=createAsyncThunk('user/deleteUser',async(args,thunkAPI)=>{
//   const state = thunkAPI.getState();
//   const { currentUser } = state.userReducer;
//   console.log(currentUser);
//   try{
// const resp=await fetch(`/api/user/delete/${currentUser._id}`,{
//   method:'DELETE',
//   headers:{'Content-Type':'application/json'}
// })
// const data=await resp.json();

// if(!resp.ok){
// thunkAPI.rejectWithValue(data.message);
// }
// return data;
//   }catch(error){
//     thunkAPI.rejectWithValue(error.message);
//   }
// })


export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setImageUploadProgress:(state,action)=>{
      state.imageFileUploadProgress=action.payload;
    },
    setImageFileUrl:(state,action)=>{
      state.imageFileUrl=action.payload;
    },
    setFormData:(state,action)=>{
      state.formData=action.payload;
    }
  },
  extraReducers: (builder) => {
    builder  
    .addCase(uploadPostImageThunk.pending, (state) => {
        // state.loading = true;
        state.error = null;  // Clear previous errors
      })
      .addCase(uploadPostImageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(uploadPostImageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = "Could not upload image(File must be less than 2MB)";
        // state.error=action.payload
       })
    //.addCase(updateUserThunk.pending, (state) => {
    //     state.loading = true;
    //             state.error = null;  // Clear previous errors
    //   })
    //   .addCase(updateUserThunk.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.error = null;
    //     state.currentUser =action.payload;
    //     state.message="User's Profile updated successfully! "
    //   })
    //   .addCase(updateUserThunk.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })
    //   .addCase(deleteUserThunk.pending, (state) => {
    //     state.loading = true;
    //             state.error = null;  
    //   })
    //   .addCase(deleteUserThunk.fulfilled, (state, action) => {
    //     console.log(action.payload);
    //     state.loading = false;
    //     state.error = null;
    //     state.currentUser =null;
      
    //   })
    //   .addCase(deleteUserThunk.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })   .addCase(signoutUserThunk.pending, (state) => {
    //     state.loading = true;
    //             state.error = null;  
    //   })
   
  },
});

export const postReducer = postSlice.reducer;
export const postSelector = (state) => state.postReducer;
export const { setFormData,setImageUploadProgress, setImageFileUrl } = postSlice.actions;
