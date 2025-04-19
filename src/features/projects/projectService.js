import axios from "axios";



// Get all projects
const getProjects = async () => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projects`);
  return response.data;
};

// Get featured projects
const getFeaturedProjects = async () => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projects/featured`);
  return response.data;
};

// Create new project
const createProject = async (projectData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/projects`, projectData, config);
  return response.data;
};

// Update project
const updateProject = async (id, projectData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/projects/${id}`, projectData, config);
  return response.data;
};

// Delete project
const deleteProject = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/projects/${id}`, config);
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
