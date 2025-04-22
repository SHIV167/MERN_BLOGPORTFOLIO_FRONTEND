import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Heading,
  useToast,
  Avatar,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [formData, setFormData] = useState({ name: '', email: '', profileImage: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/profile`,
          config
        );
        setFormData({
          name: data.name,
          email: data.email,
          profileImage: data.profileImage || '',
        });
      } catch (error) {
        toast({
          title: 'Error fetching profile',
          description: error.response?.data?.message || error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [toast]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('image', file);
    try {
      setUploading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
        form
      );
      setFormData(prev => ({ ...prev, profileImage: data.url }));
      toast({ title: 'Image uploaded', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/profile`,
        formData,
        config
      );
      toast({ title: 'Profile updated', status: 'success', duration: 3000, isClosable: true });
      setFormData(prev => ({
        ...prev,
        name: data.name,
        email: data.email,
      }));
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" py={8} px={4}>
      <Heading mb={6}>Your Profile</Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Avatar size="xl" src={formData.profileImage} />
          <Input type="file" accept="image/*" onChange={handleFile} />
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" isLoading={loading}>
            Update Profile
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default Profile;
