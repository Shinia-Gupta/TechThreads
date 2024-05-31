import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../config/firebaseInit.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const initialState = {
  currentUser: null,
  error: null,
  message: null,
  loading: false,
  imageFileUploadProgress: null,
  imageFileUrl: null,
  allUsers: [],
};

export const signupThunk = createAsyncThunk(
  "user/signup",
  async (args, thunkAPI) => {
    try {
      const resp = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      const data = await resp.json();
      if (!resp.ok) {
        return thunkAPI.rejectWithValue(data.message || "Signin failed");
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const signinThunk = createAsyncThunk(
  "user/signin",
  async (args, thunkAPI) => {
    try {
      const resp = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      const data = await resp.json();
      if (!resp.ok) {
        return thunkAPI.rejectWithValue(data.message || "Signin failed");
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const signinWithGoogleThunk = createAsyncThunk(
  "user/googleOAuth",
  async (args, thunkAPI) => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const resp = await fetch("api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        return thunkAPI.rejectWithValue(data.message || "Signin failed");
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(data.message || "Signin failed");
    }
  }
);

export const uploadImageThunk = createAsyncThunk(
  "user/updateProfileImage",
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

export const updateUserThunk = createAsyncThunk(
  "user/updateUserProfile",
  async (args, thunkAPI) => {
    const state = thunkAPI.getState();
    const { currentUser } = state.userReducer;
    // console.log(currentUser,args.formData);
    try {
      const resp = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args.formData),
      });
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

export const deleteUserThunk = createAsyncThunk(
  "user/deleteUser",
  async (args, thunkAPI) => {
    // const state = thunkAPI.getState();
    // const { currentUser } = state.userReducer;
    // console.log(currentUser);
    try {
      const resp = await fetch(`/api/user/delete/${args}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
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

export const deleteUserByAdminThunk = createAsyncThunk(
  "user/deleteUserByAdmin",
  async (args, thunkAPI) => {
    try {
      const resp = await fetch(`/api/user/delete/${args}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
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

export const signoutUserThunk = createAsyncThunk("user/signout", async () => {
  try {
    const resp = await fetch("/api/user/signout", {
      method: "POST",
    });
    const data = await resp.json();
    if (!resp.ok) {
      thunkAPI.rejectWithValue(data.message);
    }
    return data;
  } catch (error) {
    thunkAPI.rejectWithValue(error.message);
  }
});

export const getUsersThunk = createAsyncThunk(
  "user/getUsers",
  async (args, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const userState = userSelector(state);
      const { currentUser } = userState;
      const resp = await fetch(`/api/user/getusers`, {
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

export const getMoreUsersThunk = createAsyncThunk(
  "user/getMoreUsers",
  async (args, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const userState = userSelector(state);
      const { currentUser } = userState;
      const resp = await fetch(
        `/api/user/getusers?userId=${currentUser._id}&startIndex=${args}`,
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

export const userSlice = createSlice({
  name: "user",
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
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
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
        state.error = null; // Clear previous errors
      })
      .addCase(signinThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(signinThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signinWithGoogleThunk.pending, (state) => {
        // state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(signinWithGoogleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(signinWithGoogleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadImageThunk.pending, (state) => {
        // state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(uploadImageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(uploadImageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = "Could not upload image(File must be less than 2MB)";
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentUser = action.payload;
        state.message = "User's Profile updated successfully! ";
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentUser = null;
        state.allUsers = state.allUsers.filter(
          (user) => user._id !== action.payload
        );
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signoutUserThunk.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.loading = false;
        state.error = null;
        state.currentUser = null;
        (state.imageFileUrl = null),
          (state.imageFileUploadProgress = null),
          (state.message = null);
      })
      .addCase(signoutUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allUsers = action.payload.users;
      })
      .addCase(getUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMoreUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMoreUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allUsers = [...state.allUsers, ...action.payload.users];
      })
      .addCase(getMoreUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUserByAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserByAdminThunk.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.loading = false;
        state.error = null;
        state.allUsers = state.allUsers.filter(
          (user) => user._id !== action.payload
        );
      })
      .addCase(deleteUserByAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const userReducer = userSlice.reducer;
export const userSelector = (state) => state.userReducer;
export const { setImageUploadProgress, setImageFileUrl } = userSlice.actions;
