import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import youtubeService from "./youtubeService";

const initialState = {
  videos: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get all videos
export const getVideos = createAsyncThunk(
  "youtube/getAll",
  async (_, thunkAPI) => {
    try {
      return await youtubeService.getVideos();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get featured videos
export const getFeaturedVideos = createAsyncThunk(
  "youtube/getFeatured",
  async (_, thunkAPI) => {
    try {
      return await youtubeService.getFeaturedVideos();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new video
export const createVideo = createAsyncThunk(
  "youtube/create",
  async (videoData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await youtubeService.createVideo(videoData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update video
export const updateVideo = createAsyncThunk(
  "youtube/update",
  async ({ id, videoData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await youtubeService.updateVideo(id, videoData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete video
export const deleteVideo = createAsyncThunk(
  "youtube/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await youtubeService.deleteVideo(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const youtubeSlice = createSlice({
  name: "youtube",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.videos = action.payload;
      })
      .addCase(getVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getFeaturedVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeaturedVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.videos = action.payload;
      })
      .addCase(getFeaturedVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.videos.push(action.payload);
      })
      .addCase(createVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.videos = state.videos.map((video) =>
          video._id === action.payload._id ? action.payload : video
        );
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.videos = state.videos.filter(
          (video) => video._id !== action.payload.id
        );
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = youtubeSlice.actions;
export default youtubeSlice.reducer;
