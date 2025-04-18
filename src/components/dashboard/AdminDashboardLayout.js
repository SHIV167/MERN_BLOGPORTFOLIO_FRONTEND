import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  VStack,
  HStack,
  IconButton,
  Divider,
  Button,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { FaProjectDiagram, FaRegNewspaper, FaUserCog, FaEnvelopeOpenText, FaYoutube, FaSignOutAlt, FaThLarge, FaBars, FaRegSmile, FaRegWindowRestore } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'Dashboard', icon: FaThLarge, to: '/dashboard' },
  { name: 'Menu Manager', icon: FaBars, to: '/dashboard/header-menu' },
  { name: 'Footer Manager', icon: FaRegSmile, to: '/dashboard/footer' },
  { name: 'Popup Manager', icon: FaRegWindowRestore, to: '/dashboard/popup' },
  { name: 'Feedback', icon: FaRegSmile, to: '/dashboard/feedback' },
  { name: 'Projects', icon: FaProjectDiagram, to: '/dashboard/projects' },
  { name: 'Blog Posts', icon: FaRegNewspaper, to: '/dashboard/posts' },
  { name: 'Skills', icon: FaUserCog, to: '/dashboard/skills' },
  { name: 'Contact Messages', icon: FaEnvelopeOpenText, to: '/dashboard/messages' },
  { name: 'YouTube Videos', icon: FaYoutube, to: '/dashboard/videos' },
];

const AdminDashboardLayout = ({ children, user }) => {
  const location = useLocation();
  const sidebarBg = useColorModeValue('#151D2A', '#151D2A');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Flex minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Sidebar */}
      <Box w={collapsed ? 20 : { base: 'full', md: 64 }} bg={sidebarBg} color="white" p={6} display="flex" flexDirection="column" justifyContent="space-between" transition="width 0.2s">
        <Box>
          <HStack justifyContent={collapsed ? 'center' : 'space-between'} alignItems="center" mb={8}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              {!collapsed && (
                <Text fontWeight="bold" fontSize="2xl" letterSpacing={1} _hover={{ color: 'blue.300', cursor: 'pointer' }}>
                  SHIV JHA
                </Text>
              )}
            </Link>
            <IconButton
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              icon={collapsed ? <ArrowRightIcon /> : <ArrowLeftIcon />}
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              onClick={() => setCollapsed((prev) => !prev)}
            />
          </HStack>
          <VStack align="stretch" spacing={1}>
            {navLinks.map(link => (
              <Button
                as={Link}
                to={link.to}
                key={link.name}
                leftIcon={<link.icon size={18} />}
                justifyContent={collapsed ? 'center' : 'flex-start'}
                variant={location.pathname === link.to ? 'solid' : 'ghost'}
                colorScheme={location.pathname === link.to ? 'blue' : 'whiteAlpha'}
                size="lg"
                fontWeight={location.pathname === link.to ? 700 : 500}
                bg={location.pathname === link.to ? 'whiteAlpha.200' : 'none'}
                _hover={{ bg: 'whiteAlpha.300' }}
                borderRadius="md"
                px={collapsed ? 2 : 4}
              >
                {!collapsed && link.name}
              </Button>
            ))}
          </VStack>
        </Box>
        <Box mt={8}>
          <Divider borderColor="whiteAlpha.300" mb={4} />
          <HStack spacing={3} alignItems="center" justifyContent={collapsed ? 'center' : 'flex-start'}>
            <Avatar size="sm" name={user?.name || 'Shiv Jha'} src={user?.avatar} />
            {!collapsed && (
              <Box>
                <Text fontWeight={600}>{user?.name || 'Shiv Jha'}</Text>
                <Text fontSize="sm" color="whiteAlpha.700">{user?.email || 'jhashiv54@gmail.com'}</Text>
              </Box>
            )}
          </HStack>
          <HStack mt={4} w={collapsed ? 10 : 'full'} justifyContent={collapsed ? 'center' : 'flex-start'}>
            <Menu>
              <MenuButton as={Button} leftIcon={<Avatar size="sm" name={user?.name} />} colorScheme="whiteAlpha" variant="outline" size="sm" borderRadius="md">
                {!collapsed && user?.name}
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FaThLarge />} onClick={() => window.location.href = '/dashboard'}>Dashboard</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          <Button leftIcon={<FaSignOutAlt />} mt={2} w={collapsed ? 10 : 'full'} colorScheme="red" variant="solid" size="sm" borderRadius="md" onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}>
            {!collapsed && 'Logout'}
          </Button>
        </Box>
      </Box>
      {/* Main Content */}
      <Box flex={1} p={{ base: 3, md: 8 }}>
        {children}
      </Box>
    </Flex>
  );
};

export default AdminDashboardLayout;
