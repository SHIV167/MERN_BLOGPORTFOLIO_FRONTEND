import axios from "axios";

const API_URL = "/api/projects/";

// Get all projects
const getProjects = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get featured projects
const getFeaturedProjects = async () => {
  const response = await axios.get(API_URL + "featured");
  return response.data;
};

// Create new project
const createProject = async (projectData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, projectData, config);
  return response.data;
};

// Update project
const updateProject = async (id, projectData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + id, projectData, config);
  return response.data;
};

// Delete project
const deleteProject = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

const projectService = {
  getProjects,
  getFeaturedProjects,
  createProject,
  updateProject,
  deleteProject,
};

export default projectService;
