import axios from 'axios';

const API_URL = '/api/';

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

  // Add similar methods for skills and videos
};

export default dashboardService;