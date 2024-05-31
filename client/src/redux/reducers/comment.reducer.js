import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userSelector } from "./userReducer.js";
const initialState = {
  error: null,
  message: null,
  loading: false,
 comments:[]
};



export const createCommentThunk = createAsyncThunk(
  "comment/createComment",
  async (args, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const userState = userSelector(state);
        const { currentUser } = userState;
      const resp = await fetch("/api/comment/create-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({content:args.content,postId:args.postId,userId:currentUser._id}),
      });
      const data = await resp.json();
      console.log(data);
      if (!resp.ok) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error.message);
    }
  }
);

// export const getPostsThunk = createAsyncThunk(
//   "post/getPost",
//   async (args, thunkAPI) => {
//     try {
//       const state = thunkAPI.getState();
//       const userState = userSelector(state);
//       const { currentUser } = userState;
//       const resp = await fetch(
//         `/api/post/get-posts?userId=${currentUser._id}`,
//         {
//           method: "GET",
//         }
//       );
//       const data = await resp.json();
//       if (!resp.ok) {
//         return thunkAPI.rejectWithValue(data.message);
//       }
//       return data;
//     } catch (error) {
//       thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// export const getMorePostsThunk = createAsyncThunk(
//   "post/getMorePost",
//   async (args, thunkAPI) => {
//     try {
//       const state = thunkAPI.getState();
//       const userState = userSelector(state);
//       const { currentUser } = userState;
//       const resp = await fetch(
//         `/api/post/get-posts?userId=${currentUser._id}&startIndex=${args}`,
//         {
//           method: "GET",
//         }
//       );
//       const data = await resp.json();
//       if (!resp.ok) {
//         return thunkAPI.rejectWithValue(data.message);
//       }
//       return data;
//     } catch (error) {
//       thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// export const getAPostThunk=createAsyncThunk('post/getPostById',async (args,thunkAPI)=>{
//   try {

//       const resp=await fetch(`/api/post/get-posts?postId=${args}`,{
//           method:"GET"
//       })
//       const data=await resp.json();
//       if(!resp.ok){
//          return thunkAPI.rejectWithValue(data.message);
//       }
//       return data;
//   } catch (error) {
//       thunkAPI.rejectWithValue(error.message);

//   }
//   })


export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(createCommentThunk.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(createCommentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.comments=[...state.comments,action.payload];
        console.log(state.comments);
      })
      .addCase(createCommentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    //   .addCase(getPostsThunk.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(getPostsThunk.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.error = null;
    //     state.userPosts = action.payload.posts;
    //     state.showMore = action.payload.posts.length < 9 ? false : true;
    //   })
    //   .addCase(getPostsThunk.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })
    //   .addCase(getMorePostsThunk.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(getMorePostsThunk.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.error = null;
    //     state.userPosts = [...state.userPosts, ...action.payload.posts];
    //   })
    //   .addCase(getMorePostsThunk.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })
    
  },
});

export const commentReducer = commentSlice.reducer;
export const commentSelector = (state) => state.commentReducer;
export const commentActions = commentSlice.actions;
