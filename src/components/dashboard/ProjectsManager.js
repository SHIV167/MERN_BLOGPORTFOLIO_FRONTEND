import React from 'react';
import { Box, Heading, Text, VStack, SimpleGrid, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ProjectsManager = ({ projects = [], onChange }) => {
  return (
    <Box>
      <Heading size="lg" mb={4}>Projects Manager</Heading>
      <Button colorScheme="blue" as={Link} to="/dashboard/projects/create" mb={6}>Add New Project</Button>
      {projects.length === 0 ? (
        <VStack spacing={6} align="center" justify="center" minH="180px">
          <Text color="gray.500">No projects found.</Text>
        </VStack>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {projects.map(project => (
            <Box key={project._id} p={5} borderWidth={1} borderRadius="lg" boxShadow="sm" bg="white">
              {project.image && (
                <img src={project.image} alt={project.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
              )}
              <Heading size="md" mb={2}>{project.title}</Heading>
              <Text mb={2}>{project.description}</Text>
              <Text color="gray.600" fontSize="sm">{project.category}</Text>
              <VStack align="start" mt={3} spacing={2}>
                <Button as={Link} to={`/dashboard/projects/edit/${project._id}`} colorScheme="blue" size="sm">Edit</Button>
                <Button colorScheme="red" size="sm" onClick={async () => {
                  if(window.confirm('Are you sure you want to delete this project?')) {
                    await fetch(`/api/projects/${project._id}`, { method: 'DELETE', credentials: 'include' });
                    if(typeof onChange === 'function') onChange();
                  }
                }}>Delete</Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ProjectsManager;
