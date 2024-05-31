import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { app } from "../../config/firebaseInit.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { userSelector } from "./userReducer.js";
const initialState = {
  error: null,
  message: null,
  loading: false,
  imageFileUploadProgress: null,
  imageFileUrl: null,
  userPosts: [],
  currentPostDetail:{}
};

export const uploadPostImageThunk = createAsyncThunk(
  "post/uploadPostImage",
  async (args, thunkAPI) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + args.imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, args.imageFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          thunkAPI.dispatch(setImageUploadProgress(progress.toFixed(0)));
        },
        (error) => {
          return reject(thunkAPI.rejectWithValue(error.message));
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadUrl) => {
              thunkAPI.dispatch(setImageFileUrl(downloadUrl));
              resolve(downloadUrl);
            })
            .catch((error) => {
              return reject(thunkAPI.rejectWithValue(error.message));
            });
        }
      );
    });
  }
);

export const createPostThunk = createAsyncThunk(
  "post/createpost",
  async (args, thunkAPI) => {
    try {
      const resp = await fetch("/api/post/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args.formData),
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

export const getPostsThunk = createAsyncThunk(
  "post/getPost",
  async (args, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const userState = userSelector(state);
      const { currentUser } = userState;
      const resp = await fetch(
        `/api/post/get-posts?userId=${currentUser._id}`,
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

export const getMorePostsThunk = createAsyncThunk(
  "post/getMorePost",
  async (args, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const userState = userSelector(state);
      const { currentUser } = userState;
      const resp = await fetch(
        `/api/post/get-posts?userId=${currentUser._id}&startIndex=${args}`,
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

export const getAPostThunk=createAsyncThunk('post/getPostById',async (args,thunkAPI)=>{
  try {

      const resp=await fetch(`/api/post/get-posts?postId=${args}`,{
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

export const getAPostBySlugThunk = createAsyncThunk(
  "post/getPostBySlug",
  async (args, thunkAPI) => {
    try {
      const resp = await fetch(`/api/post/get-posts?slug=${args}`, {
        method: "GET",
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

export const updatePostThunk = createAsyncThunk(
  "post/updatePost",
  async (args, thunkAPI) => {
    const state = thunkAPI.getState();
    const userState = userSelector(state);
    const { currentUser } = userState;
    try {
      const resp = await fetch(
        `/api/post/update-post/${args.formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args.formData),
        }
      );
      const data = await resp.json();

      if (!resp.ok) {
        thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deletePostThunk = createAsyncThunk(
  "post/deletePost",
  async (args, thunkAPI) => {
    const state = thunkAPI.getState();
    const { currentUser } = state.userReducer;
    console.log(currentUser._id, args);
    try {
      const resp = await fetch(
        `/api/post/delete-post/${args}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await resp.json();

      if (!resp.ok) {
        thunkAPI.rejectWithValue(data.message);
      }
      return args;
    } catch (error) {
      thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setImageUploadProgress: (state, action) => {
      state.imageFileUploadProgress = action.payload;
    },
    setImageFileUrl: (state, action) => {
      state.imageFileUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPostImageThunk.pending, (state) => {
        // state.loading = true;
        state.error = null; // Clear previous errors
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
      .addCase(createPostThunk.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(createPostThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createPostThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPostsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userPosts = action.payload.posts;
        state.showMore = action.payload.posts.length < 9 ? false : true;
      })
      .addCase(getPostsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMorePostsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMorePostsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userPosts = [...state.userPosts, ...action.payload.posts];
      })
      .addCase(getMorePostsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePostThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePostThunk.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.error = null;
        state.userPosts = state.userPosts.filter(
          (post) => post._id != action.payload
        );
      })
      .addCase(deletePostThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePostThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePostThunk.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.error = null;
        state.userPosts = state.userPosts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      })
      .addCase(updatePostThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAPostBySlugThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAPostBySlugThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentPostDetail=action.payload.posts[0];
      })
      .addCase(getAPostBySlugThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const postReducer = postSlice.reducer;
export const postSelector = (state) => state.postReducer;
export const { setImageUploadProgress, setImageFileUrl } = postSlice.actions;
