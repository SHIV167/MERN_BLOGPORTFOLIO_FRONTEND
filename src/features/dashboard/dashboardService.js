import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api/';
const dashboardService = {
  // Posts
  createPost: async (postData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await axios.post(API_URL + 'posts', postData, config);
    return response.data;
  },

  getPosts: async () => {
    const response = await axios.get(API_URL + 'posts');
    return response.data;
  },

  // Projects
  getProjects: async () => {
    const response = await axios.get(API_URL + 'projects');
    return response.data;
  },

  // Skills
  getSkills: async () => {
    const response = await axios.get(API_URL + 'skills');
    return response.data;
  },

  // Videos
  getVideos: async () => {
    const response = await axios.get(API_URL + 'videos');
    return response.data;
  },
};

export default dashboardService;
