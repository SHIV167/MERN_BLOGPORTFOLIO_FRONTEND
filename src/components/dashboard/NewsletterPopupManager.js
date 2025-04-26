import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  VStack,
  HStack,
  FormLabel,
  Switch,
  Image,
  Spinner,
  useToast,
  IconButton
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

export default function NewsletterPopupManager() {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const baseUrl = process.env.REACT_APP_BACKEND_URL || 'https://mern-blogportfolio-backend-server.onrender.com';

  useEffect(() => {
    fetch(`${baseUrl}/api/newsletter/all`)
      .then(res => res.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(err => { console.error('Load error', err); setLoading(false); toast({ title: 'Error loading', status: 'error', duration: 3000 }); });
  }, [saving]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setCurrent(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${baseUrl}/api/newsletter/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      setCurrent(prev => ({ ...prev, backgroundBanner: data.url }));
    } catch (err) {
      console.error(err);
      toast({ title: 'Upload error', status: 'error', duration: 3000 });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const method = current._id ? 'PUT' : 'POST';
    const url = current._id ? `${baseUrl}/api/newsletter/${current._id}` : `${baseUrl}/api/newsletter`;
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(current)
      });
      setItems([]);
      setCurrent(null);
      toast({ title: 'Saved!', status: 'success', duration: 2000 });
    } catch (err) {
      console.error(err);
      toast({ title: 'Save error', status: 'error', duration: 3000 });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    try {
      await fetch(`${baseUrl}/api/newsletter/${id}`, { method: 'DELETE' });
      setItems(items.filter(i => i._id !== id));
      setCurrent(null);
      toast({ title: 'Deleted!', status: 'info', duration: 2000 });
    } catch (err) {
      console.error(err);
      toast({ title: 'Delete error', status: 'error', duration: 3000 });
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box p={8} maxW="3xl" mx="auto">
      <Heading mb={4}>Newsletter Popup Manager</Heading>
      <Button leftIcon={<AddIcon />} colorScheme="green" mb={4}
        onClick={() => setCurrent({ title: '', backgroundBanner: '', enabled: false })}
      >Add New Popup</Button>
      <Table variant="simple" mb={6}>
        <Thead>
          <Tr>
            <Th>Title</Th><Th>Banner</Th><Th>Enabled</Th><Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map(item => (
            <Tr key={item._id}>
              <Td>{item.title}</Td>
              <Td>
                {item.backgroundBanner && <Image src={item.backgroundBanner.startsWith('http') ? item.backgroundBanner : `${baseUrl}${item.backgroundBanner}`} maxH="50px" />}
              </Td>
              <Td>{item.enabled ? '✅' : '❌'}</Td>
              <Td>
                <IconButton icon={<EditIcon />} size="sm" onClick={() => setCurrent(item)} mr={2} />
                <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleDelete(item._id)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {current && (
        <Box bg="gray.50" p={6} borderRadius="md" boxShadow="sm">
          <VStack spacing={4} align="stretch">
            <FormLabel>Title</FormLabel>
            <Input name="title" value={current.title} onChange={handleChange} />
            <FormLabel>Background Banner</FormLabel>
            <Input type="file" accept="image/*" onChange={handleImageUpload} isDisabled={uploading} />
            {current.backgroundBanner && <Image src={current.backgroundBanner.startsWith('http') ? current.backgroundBanner : `${baseUrl}${current.backgroundBanner}`} maxH="120px" />}
            <HStack>
              <FormLabel mb="0">Enabled</FormLabel>
              <Switch name="enabled" isChecked={current.enabled} onChange={handleChange} />
            </HStack>
            <HStack spacing={4} mt={4}>
              <Button colorScheme="blue" onClick={handleSave} isLoading={saving}>Save</Button>
              <Button variant="ghost" onClick={() => setCurrent(null)}>Cancel</Button>
            </HStack>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
