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
      if (!resp.ok) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCommentsThunk = createAsyncThunk(
  "comment/getComments",
  async (args, thunkAPI) => {
    try {

      const resp = await fetch(
        `/api/comment/get-comments/${args}`,
        {
          method: "GET",
        }
      );
      const data = await resp.json();
      if (!resp.ok) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const toggleLikeThunk=createAsyncThunk('comment/likeComment',async(args,thunkAPI)=>{
  try {
const state=thunkAPI.getState();
const userState=userSelector(state);
const {currentUser}=userState;
// if(!currentUser){
//   thunkAPI.rejectWithValue('You are not authorized ')
// }
    const resp = await fetch(
      `/api/comment/likeComment/${args}`,
      {
        method: "PUT",
      }
    );
    const data = await resp.json();
    if (!resp.ok) {
      return thunkAPI.rejectWithValue(data.message);
    }
    return data;
  } catch (error) {
    thunkAPI.rejectWithValue(error.message);
  }
})

export const updateCommentThunk=createAsyncThunk('comment/updateComment',async(args,thunkAPI)=>{

try{
    const resp = await fetch(
      `/api/comment/editComment/${args.comment._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({content:args.editedContent}),
   
      }
    );
    const data = await resp.json();
    if (!resp.ok) {
      return thunkAPI.rejectWithValue(data.message);
    }
    return data;
  } catch (error) {
    thunkAPI.rejectWithValue(error.message);
  }
})

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
      })
      .addCase(createCommentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCommentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.comments =[... action.payload];
        // state.showMore = action.payload.posts.length < 9 ? false : true;
      })
      .addCase(getCommentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleLikeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLikeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.comments =state.comments.map((comment)=>{
          if(comment._id===action.payload._id){
            return action.payload
          }
          return comment;
        });
      })
      .addCase(toggleLikeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCommentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCommentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.comments =state.comments.map((comment)=>{
          if(comment._id===action.payload._id){
            return action.payload
          }
          return comment;
        });
      })
      .addCase(updateCommentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
