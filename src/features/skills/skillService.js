import axios from "axios";

const API_URL = "/api/skills/";

// Get all skills
const getSkills = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create new skill
const createSkill = async (skillData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, skillData, config);
  return response.data;
};

// Update skill
const updateSkill = async (id, skillData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + id, skillData, config);
  return response.data;
};

// Delete skill
const deleteSkill = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

const skillService = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};

export default skillService;
