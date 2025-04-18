import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import skillService from "./skillService";

const initialState = {
  skills: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get all skills
export const getSkills = createAsyncThunk(
  "skills/getAll",
  async (_, thunkAPI) => {
    try {
      return await skillService.getSkills();
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

// Create new skill
export const createSkill = createAsyncThunk(
  "skills/create",
  async (skillData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await skillService.createSkill(skillData, token);
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

// Update skill
export const updateSkill = createAsyncThunk(
  "skills/update",
  async ({ id, skillData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await skillService.updateSkill(id, skillData, token);
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

// Delete skill
export const deleteSkill = createAsyncThunk(
  "skills/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await skillService.deleteSkill(id, token);
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

export const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSkills.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.skills = action.payload;
      })
      .addCase(getSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createSkill.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.skills.push(action.payload);
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateSkill.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.skills = state.skills.map((skill) =>
          skill._id === action.payload._id ? action.payload : skill
        );
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteSkill.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.skills = state.skills.filter(
          (skill) => skill._id !== action.payload.id
        );
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = skillsSlice.actions;
export default skillsSlice.reducer;
