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
  Select,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import './quill.css';

const quillModules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    handlers: {
      image: function () {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
          const file = input.files[0];
          const formData = new FormData();
          formData.append('image', file);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await res.json();
          const quill = this.quill;
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', data.url);
        };
      }
    }
  }
};
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const PostsManager = ({ posts, onChange }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    category: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      if (formData.image) data.append('image', formData.image);

      const token = localStorage.getItem('token');
      const url = editingId ? `/api/posts/${editingId}` : '/api/posts';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: data,
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error((await res.json()).message || `Failed to ${editingId ? 'update' : 'add'} post`);
      setFormData({ title: '', content: '', image: null, category: '' });
      setEditingId(null);
      if (typeof onChange === 'function') onChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Box p={4} borderWidth="1px" borderRadius="lg">
          {error && <Box color="red.500">{error}</Box>}
          {loading && <Box color="gray.500">Submitting...</Box>}
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Post Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Content</FormLabel>
                <ReactQuill
                  value={formData.content}
                  onChange={value => setFormData({ ...formData, content: value })}
                  style={{ minHeight: '200px', background: 'white' }}
                  modules={quillModules}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  placeholder="Select category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="technology">Technology</option>
                  <option value="programming">Programming</option>
                  <option value="design">Design</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>

              <Button type="submit" colorScheme="purple">
                {editingId ? 'Update Post' : 'Add Post'}
              </Button>
              {editingId && (
                <Button
                  onClick={() => {
                    setFormData({ title: '', content: '', image: null, category: '' });
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
              <Th>Category</Th>
              <Th>Created At</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {posts?.map((post) => (
              <Tr key={post._id}>
                <Td>{post.title}</Td>
                <Td>{post.category}</Td>
                <Td>{new Date(post.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<EditIcon />}
                      aria-label="Edit post"
                      size="sm"
                      onClick={() => {
                        setFormData({
                          title: post.title,
                          content: post.content,
                          category: post.category,
                          image: null,
                        });
                        setEditingId(post._id);
                        window.scrollTo(0, 0);
                      }}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Delete post"
                      size="sm"
                      colorScheme="red"
                      onClick={async () => {
                        if (window.confirm('Delete this post?')) {
                          setLoading(true);
                          setError(null);
                          try {
                            const token = localStorage.getItem('token');
                            const res = await fetch(`/api/posts/${post._id}`, { method: 'DELETE', credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : undefined });
                            if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete post');
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

export default PostsManager;