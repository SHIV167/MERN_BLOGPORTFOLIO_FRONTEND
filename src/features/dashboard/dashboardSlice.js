import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



// Async thunks
export const getPosts = createAsyncThunk('dashboard/getPosts', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/posts`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getSkills = createAsyncThunk('dashboard/getSkills', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/skills`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getVideos = createAsyncThunk('dashboard/getVideos', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/videos`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = {
  posts: [],
  skills: [],
  videos: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      // Posts
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Skills
      .addCase(getSkills.fulfilled, (state, action) => {
        state.skills = action.payload;
      })
      // Videos
      .addCase(getVideos.fulfilled, (state, action) => {
        state.videos = action.payload;
      });
  }
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;
