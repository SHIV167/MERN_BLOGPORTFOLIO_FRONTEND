import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postsReducer from "../features/posts/postsSlice";
import skillsReducer from "../features/skills/skillsSlice";
import projectsReducer from "../features/projects/projectsSlice";
import youtubeReducer from "../features/youtube/youtubeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    skills: skillsReducer,
    projects: projectsReducer,
    youtube: youtubeReducer,
  },
});
