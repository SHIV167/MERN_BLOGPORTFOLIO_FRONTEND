import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Text,
  Heading,
  VStack,
  HStack,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { FaEllipsisV, FaEnvelope, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { format } from 'date-fns';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const rowBgHover = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const fetchMessages = useCallback(async () => {
    try {
      // Get user data from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
      if (!token) throw new Error('No auth token found');
      
      const res = await axios.get('/api/contact', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessages(res.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch messages',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusChange = async (id, status) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      await axios.put(`/api/contact/${id}/status`, { status }, {
        headers: {
          'x-auth-token': token
        }
      });
      fetchMessages();
      toast({
        title: 'Success',
        description: 'Message status updated',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      await axios.delete(`/api/contact/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      fetchMessages();
      toast({
        title: 'Success',
        description: 'Message deleted successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread':
        return 'red';
      case 'read':
        return 'yellow';
      case 'replied':
        return 'green';
      default:
        return 'gray';
    }
  };

  const viewMessage = (message) => {
    setSelectedMessage(message);
    onOpen();
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>Contact Messages</Heading>
      
      <Box overflowX="auto" borderWidth={1} borderRadius="lg" borderColor={borderColor}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Subject</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {messages.map((message) => (
              <Tr key={message._id} 
                  cursor="pointer" 
                  _hover={{ bg: rowBgHover }}
                  onClick={() => viewMessage(message)}>
                <Td>{format(new Date(message.createdAt), 'MMM d, yyyy')}</Td>
                <Td>{message.name}</Td>
                <Td>{message.email}</Td>
                <Td>{message.subject || 'No Subject'}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(message.status)}>
                    {message.status}
                  </Badge>
                </Td>
                <Td onClick={(e) => e.stopPropagation()}>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FaEllipsisV />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem onClick={() => handleStatusChange(message._id, 'read')}>
                        Mark as Read
                      </MenuItem>
                      <MenuItem onClick={() => handleStatusChange(message._id, 'replied')}>
                        Mark as Replied
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(message._id)} color="red.500">
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Message Details</DrawerHeader>
          <DrawerBody>
            {selectedMessage && (
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold">From</Text>
                  <Text>{selectedMessage.name} ({selectedMessage.email})</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold">Subject</Text>
                  <Text>{selectedMessage.subject || 'No Subject'}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Message</Text>
                  <Text whiteSpace="pre-wrap">{selectedMessage.message}</Text>
                </Box>

                <HStack spacing={4} opacity={0.7} fontSize="sm">
                  <HStack>
                    <FaClock />
                    <Text>
                      {format(new Date(selectedMessage.createdAt), 'MMM d, yyyy h:mm a')}
                    </Text>
                  </HStack>
                  <HStack>
                    <FaEnvelope />
                    <Badge colorScheme={getStatusColor(selectedMessage.status)}>
                      {selectedMessage.status}
                    </Badge>
                  </HStack>
                </HStack>
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default MessagesManager;
