import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  HStack, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  IconButton, 
  Switch, 
  Textarea 
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const VideosManager = ({ videos, onChange }) => {
  const [formData, setFormData] = useState({
    title: '',
    videoId: '',
    description: '',
    featured: false,
    category: 'Other',
  });
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // Client-side validation
    if (!formData.title || !formData.videoId || !formData.title.trim() || !formData.videoId.trim()) {
      setError('Both Title and YouTube Video ID are required.');
      return;
    }
    setLoading(true);
    try {
      // Clean up data
      const cleanedData = {
        title: formData.title.trim(),
        videoId: formData.videoId.trim(),
        description: (formData.description || '').trim(),
        category: formData.category || 'Other',
        featured: !!formData.featured
      };
      const token = localStorage.getItem('token');
      const url = editingId ? `/api/videos/${editingId}` : '/api/videos';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(cleanedData),
        credentials: 'include',
      });
      if (!res.ok) throw new Error((await res.json()).message || `Failed to ${editingId ? 'update' : 'add'} video`);
      setFormData({ title: '', videoId: '', description: '', featured: false, category: 'Other' });
      setEditingId(null);
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
                <FormLabel>Video Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>YouTube Video ID</FormLabel>
                <Input
                  value={formData.videoId}
                  onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                  placeholder="e.g., dQw4w9WgXcQ"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Featured Video?</FormLabel>
                <Switch
                  isChecked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
              </FormControl>
              <Button type="submit" colorScheme="purple">
                {editingId ? 'Update Video' : 'Add Video'}
              </Button>
              {editingId && (
                <Button
                  onClick={() => {
                    setFormData({ title: '', videoId: '', description: '', featured: false, category: 'Other' });
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
              <Th>Title</Th>
              <Th>YouTube ID</Th>
              <Th>Featured</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {videos?.map((video) => (
              <Tr key={video._id}>
                <Td>{video.title}</Td>
                <Td>{video.videoId}</Td>
                <Td>
                  <Switch isChecked={video.featured} isReadOnly />
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<EditIcon />}
                      aria-label="Edit video"
                      size="sm"
                      onClick={() => {
                        setFormData({
                          title: video.title,
                          videoId: video.videoId,
                          description: video.description || '',
                          featured: video.featured,
                          category: video.category || 'Other',
                        });
                        setEditingId(video._id);
                        window.scrollTo(0, 0);
                      }}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Delete video"
                      size="sm"
                      colorScheme="red"
                      onClick={async () => {
                        if (window.confirm('Delete this video?')) {
                          setLoading(true);
                          setError(null);
                          try {
                            const token = localStorage.getItem('token');
                            const res = await fetch(`/api/videos/${video._id}`, { method: 'DELETE', credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : undefined });
                            if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete video');
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

export default VideosManager;