import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Select,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const SkillsManager = ({ skills, onChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    proficiency: '',
    category: '',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);

  const toast = useToast();
  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.category) {
      setError('Name and category are required.');
      return;
    }

    // Client-side validation
    const proficiencyNum = Number(formData.proficiency);
    if (!proficiencyNum || isNaN(proficiencyNum) || proficiencyNum < 1 || proficiencyNum > 100) {
      setError('Proficiency must be a number between 1 and 100.');
      return;
    }

    setLoading(true);
    try {
      const formattedData = {
        name: formData.name.trim(),
        proficiency: proficiencyNum,
        category: formData.category,
        description: formData.description?.trim() || ''
      };
      const token = localStorage.getItem('token');
      const url = editingId ? `/api/skills/${editingId}` : '/api/skills';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formattedData),
        credentials: 'include',
      });
      if (!res.ok) throw new Error((await res.json()).message || `Failed to ${editingId ? 'update' : 'add'} skill`);
      setFormData({ name: '', level: '', category: '' });
      setEditingId(null);
      showToast(
        'Success',
        `Skill ${editingId ? 'updated' : 'added'} successfully`,
        'success'
      );
      if (typeof onChange === 'function') onChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Box p={4} borderWidth="1px" borderRadius="lg">
          {error && <Box color="red.500">{error}</Box>}
          {loading && <Box color="gray.500">Processing...</Box>}
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Skill Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Proficiency (1-100)</FormLabel>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  placeholder="Select category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the skill"
                />
              </FormControl>

              <Button type="submit" colorScheme="purple">
                {editingId ? 'Update Skill' : 'Add Skill'}
              </Button>
              {editingId && (
                <Button
                  onClick={() => {
                    setFormData({ name: '', proficiency: '', category: '', description: '' });
                    setEditingId(null);
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </VStack>
          </form>
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Level</Th>
              <Th>Category</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {skills?.map((skill) => (
              <Tr key={skill._id}>
                <Td>{skill.name}</Td>
                <Td>{skill.proficiency}%</Td>
                <Td>{skill.category}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<EditIcon />}
                      aria-label="Edit skill"
                      size="sm"
                      onClick={() => {
                        setFormData({
                          name: skill.name,
                          proficiency: skill.proficiency,
                          category: skill.category,
                        });
                        setEditingId(skill._id);
                        window.scrollTo(0, 0);
                      }}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Delete skill"
                      size="sm"
                      colorScheme="red"
                      onClick={async () => {
                        if (window.confirm('Delete this skill?')) {
                          setLoading(true);
                          setError(null);
                          try {
                            const token = localStorage.getItem('token');
                            const res = await fetch(`/api/skills/${skill._id}`, { method: 'DELETE', credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : undefined });
                            if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete skill');
                            if (typeof onChange === 'function') onChange();
                          } catch (err) {
                            setError(err.message);
                          } finally {
                            setLoading(false);
                          }
                        }
                      }}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
};

export default SkillsManager;