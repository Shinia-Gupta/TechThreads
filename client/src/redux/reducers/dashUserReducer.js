import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userSelector } from './userReducer';


const initialState = {
  allUsers:[]
};




export const getUsersThunk=createAsyncThunk('dashuser/getUsers',async (args,thunkAPI)=>{
  try {
    const state = thunkAPI.getState();
    const userState =userSelector(state);
    const {currentUser}=userState;
      const resp=await fetch(`/api/user/getusers`,{
          method:"GET"
      })
      const data=await resp.json();
      if(!resp.ok){
         return thunkAPI.rejectWithValue(data.message);
      }
      console.log('hello',resp,data);
      return data;
  } catch (error) {
      thunkAPI.rejectWithValue(error.message);
  
  }
  })


  export const getMoreUsersThunk=createAsyncThunk('dashuser/getMoreUsers',async (args,thunkAPI)=>{
    try {
      const state = thunkAPI.getState();
      const userState =userSelector(state);
      const {currentUser}=userState;
        const resp=await fetch(`/api/user/getusers?userId=${currentUser._id}&startIndex=${args}`,{
            method:"GET"
        })
        const data=await resp.json();
        if(!resp.ok){
           return thunkAPI.rejectWithValue(data.message);
        }
        return data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.message);
    
    }
    })

export const dashuserSlice = createSlice({
  name: 'dashuser',
  initialState,
  reducers: {
    // setImageUploadProgress:(state,action)=>{
    //   state.imageFileUploadProgress=action.payload;
    // },
    // setImageFileUrl:(state,action)=>{
    //   state.imageFileUrl=action.payload;
    // },

  },
  extraReducers: (builder) => {
    builder  
    
      .addCase(getUsersThunk.pending, (state) => {
        state.loading = true;
                state.error = null;  
      })
      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
state.allUsers=action.payload.users;
      })
      .addCase(getUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

      }) .addCase(getMoreUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(getMoreUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allUsers=[...state.allUsers,...action.payload.users];
        })
      .addCase(getMoreUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

       })
      
  },
});

export const dashuserReducer = dashuserSlice.reducer;
export const dashuserSelector = (state) => state.dashuserReducer;
export const dashUserActions = dashuserSlice.actions;
