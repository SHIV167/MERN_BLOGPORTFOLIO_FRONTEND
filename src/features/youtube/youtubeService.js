import axios from "axios";

const API_URL = "/api/videos/";

// Get all videos
const getVideos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get featured videos
const getFeaturedVideos = async () => {
  const response = await axios.get(API_URL + "featured");
  return response.data;
};

// Create new video
const createVideo = async (videoData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, videoData, config);
  return response.data;
};

// Update video
const updateVideo = async (id, videoData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + id, videoData, config);
  return response.data;
};

// Delete video
const deleteVideo = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + id, config);
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
