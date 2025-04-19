import axios from "axios";



// Get all videos
const getVideos = async () => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/videos`);
  return response.data;
};

// Get featured videos
const getFeaturedVideos = async () => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/videos/featured`);
  return response.data;
};

// Create new video
const createVideo = async (videoData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/videos`, videoData, config);
  return response.data;
};

// Update video
const updateVideo = async (id, videoData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/videos/${id}`, videoData, config);
  return response.data;
};

// Delete video
const deleteVideo = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/videos/${id}`, config);
  return response.data;
};

const youtubeService = {
  getVideos,
  getFeaturedVideos,
  createVideo,
  updateVideo,
  deleteVideo,
};

export default youtubeService;
