import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../../config/firebaseInit.js';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};


export const signupThunk = createAsyncThunk(
  'user/signup',
  async (args, thunkAPI) => {
    try {
      const resp = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
      const data = await resp.json();
      if (!resp.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Signin failed');
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const signinThunk = createAsyncThunk(
  'user/signin',
  async (args, thunkAPI) => {
    try {
      const resp = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
      const data = await resp.json();
      if (!resp.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Signin failed');
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const signinWithGoogleThunk=createAsyncThunk('user/googleOAuth',async(args,thunkAPI)=>{
  const provider=new GoogleAuthProvider();
  const auth=getAuth(app);
  provider.setCustomParameters({prompt:"select_account"})
  try {
    const resultsFromGoogle=await signInWithPopup(auth,provider);

const resp=await fetch('api/auth/google',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({name:resultsFromGoogle.user.displayName, email:resultsFromGoogle.user.email,googlePhotoUrl:resultsFromGoogle.user.photoURL})
}) 
const data=await resp.json();
if (!resp.ok) {
  return thunkAPI.rejectWithValue(data.message || 'Signin failed');
}
return data;
} catch (error) {
  
    return thunkAPI.rejectWithValue(data.message || 'Signin failed');
   }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder  
    .addCase(signupThunk.pending, (state) => {
      state.loading = true;
      state.error = null;  // Clear previous errors
    })
    .addCase(signupThunk.fulfilled, (state, action) => {
      state.loading = false;
      // state.currentUser = action.payload;
    })
    .addCase(signupThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
      .addCase(signinThunk.pending, (state) => {
        state.loading = true;
        state.error = null;  // Clear previous errors
      })
      .addCase(signinThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(signinThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(signinWithGoogleThunk.pending, (state) => {
        // state.loading = true;
        state.error = null;  // Clear previous errors
      })
      .addCase(signinWithGoogleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(signinWithGoogleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const userReducer = userSlice.reducer;
export const userSelector = (state) => state.userReducer;
