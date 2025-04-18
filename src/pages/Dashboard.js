import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Text,
  Icon,
  Progress,
  HStack,
  SimpleGrid,
  Heading,
  Badge,
} from '@chakra-ui/react';
import { FaEnvelopeOpenText, FaYoutube, FaProjectDiagram, FaRegNewspaper } from 'react-icons/fa';
import PostsManager from '../components/dashboard/PostsManager';
import ProjectsManager from '../components/dashboard/ProjectsManager';
import SkillsManager from '../components/dashboard/SkillsManager';
import VideosManager from '../components/dashboard/VideosManager';
import MessagesManager from '../components/dashboard/MessagesManager';
import AdminDashboardLayout from '../components/dashboard/AdminDashboardLayout';
import CreateProject from './CreateProject';
import EditProject from './EditProject';
import HeaderMenuManager from '../components/dashboard/HeaderMenuManager';
import FooterManager from '../components/dashboard/FooterManager';
import FeedbackDashboard from '../components/dashboard/FeedbackDashboard';
import PopupManager from '../components/dashboard/PopupManager';

import { Link, Routes, Route } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [videos, setVideos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Replace with your auth state logic if needed
    // For now, try to fetch user from localStorage or similar
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
    } else {
      fetchAll();
    }
    // eslint-disable-next-line
  }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
      const [postsRes, projectsRes, skillsRes, videosRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/projects'),
        fetch('/api/skills'),
        fetch('/api/videos'),
      ]);
      // Fetch messages with auth header
      let messagesData = [];
      if (token) {
        const messagesRes = await fetch('/api/contact', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        messagesData = await messagesRes.json();
      }
      setPosts(await postsRes.json());
      setProjects(await projectsRes.json());
      setSkills(await skillsRes.json());
      setVideos(await videosRes.json());
      setMessages(messagesData);
      setUnreadCount(messagesData.filter(msg => msg.status === 'unread').length);
    } catch (err) {
      // Optionally handle error
    }
    setIsLoading(false);
  };

  // Get user from localStorage (or set fallback)
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Shiv Jha', email: 'jhashiv54@gmail.com' };
  

  return (
    <AdminDashboardLayout user={user}>
      <Routes>
        <Route
          path="/"
          element={
            <Box>
              <Heading mb={6}>Dashboard</Heading>
              {/* Top Summary Cards */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
                <Box bg="white" borderRadius="xl" boxShadow="sm" p={6} display="flex" flexDirection="column" alignItems="flex-start">
                  <HStack spacing={3} mb={2}>
                    <Icon as={FaProjectDiagram} boxSize={6} color="blue.500" />
                    <Text fontWeight={700} fontSize="lg">Total Projects</Text>
                  </HStack>
                  <Text fontSize="3xl" fontWeight={900} color="blue.700">{projects.length}</Text>
                </Box>
                <Box bg="white" borderRadius="xl" boxShadow="sm" p={6} display="flex" flexDirection="column" alignItems="flex-start">
                  <HStack spacing={3} mb={2}>
                    <Icon as={FaRegNewspaper} boxSize={6} color="green.500" />
                    <Text fontWeight={700} fontSize="lg">Blog Posts</Text>
                  </HStack>
                  <Text fontSize="3xl" fontWeight={900} color="green.700">{posts.length}</Text>
                </Box>
                <Box bg="white" borderRadius="xl" boxShadow="sm" p={6} display="flex" flexDirection="column" alignItems="flex-start">
                  <HStack spacing={3} mb={2}>
                    <Icon as={FaEnvelopeOpenText} boxSize={6} color="orange.400" />
                    <Text fontWeight={700} fontSize="lg">Contact Messages</Text>
                  </HStack>
                  <Text fontSize="3xl" fontWeight={900} color="orange.700">{messages.length}</Text>
                  <Text fontSize="sm" color="orange.500" mt={1}>{unreadCount} unread messages</Text>
                </Box>
                <Box bg="white" borderRadius="xl" boxShadow="sm" p={6} display="flex" flexDirection="column" alignItems="flex-start">
                  <HStack spacing={3} mb={2}>
                    <Icon as={FaYoutube} boxSize={6} color="red.500" />
                    <Text fontWeight={700} fontSize="lg">YouTube Videos</Text>
                  </HStack>
                  <Text fontSize="3xl" fontWeight={900} color="red.700">{videos.length}</Text>
                </Box>
              </SimpleGrid>
              {/* Middle Content */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {/* Content Overview */}
                <Box bg="white" borderRadius="xl" boxShadow="sm" p={6}>
                  <Heading size="md" mb={1}>Content Overview</Heading>
                  <Text color="gray.500" mb={5}>Summary of your portfolio content</Text>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Text fontWeight={600}>Projects</Text>
                      <Text color="gray.500">{projects.length} items</Text>
                    </HStack>
                    <Progress value={projects.length} max={10} colorScheme="blue" h={2} borderRadius="md" />
                    <HStack justify="space-between">
                      <Text fontWeight={600}>Blog Posts</Text>
                      <Text color="gray.500">{posts.length} items</Text>
                    </HStack>
                    <Progress value={posts.length} max={10} colorScheme="green" h={2} borderRadius="md" />
                    <HStack justify="space-between">
                      <Text fontWeight={600}>Videos</Text>
                      <Text color="gray.500">{videos.length} items</Text>
                    </HStack>
                    <Progress value={videos.length} max={10} colorScheme="red" h={2} borderRadius="md" />
                    <HStack justify="space-between">
                      <Text fontWeight={600}>Contact Messages</Text>
                      <Text color="gray.500">{messages.length} items</Text>
                    </HStack>
                    <Progress value={messages.length} max={10} colorScheme="orange" h={2} borderRadius="md" />
                  </VStack>
                </Box>
                {/* Recent Messages */}
                <Box bg="white" borderRadius="xl" boxShadow="sm" p={6}>
                  <Heading size="md" mb={1}>Recent Messages</Heading>
                  <Text color="gray.500" mb={5}>Latest contact form submissions</Text>
                  {messages.length === 0 ? (
                    <VStack align="center" justify="center" h="100%" minH="120px" color="gray.400">
                      <Icon as={FaEnvelopeOpenText} boxSize={12} />
                      <Text>No contact messages yet</Text>
                    </VStack>
                  ) : (
                    <VStack align="stretch" spacing={4}>
                      {messages.slice(0, 3).map(msg => (
                        <Box key={msg._id} bg="gray.50" p={3} borderRadius="md" boxShadow="xs">
                          <Text fontWeight={600}>{msg.name}</Text>
                          <Text fontSize="sm" color="gray.500">{msg.email}</Text>
                          <Text fontSize="sm" color="gray.700" mt={1}>{msg.message}</Text>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              </SimpleGrid>
            </Box>
          }
        />
        <Route path="projects" element={<ProjectsManager projects={projects} onChange={fetchAll} />} />
        <Route path="projects/create" element={<CreateProject onSuccess={fetchAll} />} />
        <Route path="projects/edit/:id" element={<EditProject onSuccess={fetchAll} />} />
        <Route path="header-menu" element={<HeaderMenuManager />} />
        <Route path="footer" element={<FooterManager />} />
        <Route path="posts" element={<PostsManager posts={posts} onChange={fetchAll} />} />
        <Route path="skills" element={<SkillsManager skills={skills} onChange={fetchAll} />} />
        <Route path="videos" element={<VideosManager videos={videos} onChange={fetchAll} />} />
        <Route path="messages" element={<MessagesManager messages={messages} onChange={fetchAll} />} />
        <Route path="feedback" element={<FeedbackDashboard />} />
        <Route path="popup" element={<PopupManager />} />
      </Routes>
    </AdminDashboardLayout>
  );
}

export default Dashboard;
