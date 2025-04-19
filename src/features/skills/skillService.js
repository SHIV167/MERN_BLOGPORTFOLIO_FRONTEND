import axios from "axios";



// Get all skills
const getSkills = async () => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/skills`);
  return response.data;
};

// Create new skill
const createSkill = async (skillData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/skills`, skillData, config);
  return response.data;
};

// Update skill
const updateSkill = async (id, skillData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/skills/${id}`, skillData, config);
  return response.data;
};

// Delete skill
const deleteSkill = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/skills/${id}`, config);
  return response.data;
};

const skillService = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};

export default skillService;
