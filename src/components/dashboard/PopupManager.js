import React, { useEffect, useState } from "react";
import { Box, Heading, Input, Textarea, Switch, Button, Image, VStack, HStack, FormLabel, Spinner, useToast, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

export default function PopupManager() {
  const [popups, setPopups] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetch('/api/popup/all')
      .then(res => res.json())
      .then(data => { setPopups(data); setLoading(false); });
  }, [saving]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setCurrent(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    setCurrent(prev => ({ ...prev, [field]: data.url }));
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const method = current._id ? 'PUT' : 'POST';
    const url = current._id ? `/api/popup/${current._id}` : '/api/popup';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(current)
    });
    setSaving(false);
    setCurrent(null);
    toast({ title: 'Popup saved!', status: 'success', duration: 2000 });
  };

  const handleDelete = async (id) => {
    await fetch(`/api/popup/${id}`, { method: 'DELETE' });
    setPopups(popups.filter(p => p._id !== id));
    setCurrent(null);
    toast({ title: 'Popup deleted!', status: 'info', duration: 2000 });
  };

  if (loading) return <Spinner />;

  return (
    <Box p={8} maxW="3xl" mx="auto">
      <Heading mb={6}>Popup Manager</Heading>
      <Button leftIcon={<AddIcon />} colorScheme="green" mb={4} onClick={() => setCurrent({ title: '', content: '', imageDesktop: '', imageMobile: '', enabledDesktop: false, enabledMobile: false, startDate: '', endDate: '' })}>Add New Popup</Button>
      <Table variant="simple" mb={8}>
        <Thead><Tr><Th>Title</Th><Th>Desktop</Th><Th>Mobile</Th><Th>Enabled</Th><Th>Schedule</Th><Th>Actions</Th></Tr></Thead>
        <Tbody>
          {popups.map(popup => (
            <Tr key={popup._id}>
              <Td>{popup.title}</Td>
              <Td>{popup.imageDesktop && <Image src={popup.imageDesktop} maxH="40px" />}</Td>
              <Td>{popup.imageMobile && <Image src={popup.imageMobile} maxH="40px" />}</Td>
              <Td>
                D: {popup.enabledDesktop ? '✅' : '❌'}<br />M: {popup.enabledMobile ? '✅' : '❌'}
              </Td>
              <Td>
                {popup.startDate ? new Date(popup.startDate).toLocaleDateString() : '-'}<br/>
                {popup.endDate ? new Date(popup.endDate).toLocaleDateString() : '-'}
              </Td>
              <Td>
                <IconButton icon={<EditIcon />} size="sm" onClick={() => setCurrent(popup)} mr={2} />
                <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleDelete(popup._id)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {current && (
        <Box bg="gray.50" borderRadius="md" p={6} mb={6} boxShadow="md">
          <VStack spacing={5} align="stretch">
            <FormLabel>Title</FormLabel>
            <Input name="title" value={current?.title || ''} onChange={handleChange} />
            <FormLabel>Content</FormLabel>
            <Textarea name="content" value={current?.content || ''} onChange={handleChange} />
            <FormLabel>Desktop Image</FormLabel>
            <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'imageDesktop')} isDisabled={uploading} />
            {current?.imageDesktop && <Image src={current.imageDesktop} maxH="120px" borderRadius="md" />}
            <HStack>
              <FormLabel htmlFor="enabledDesktop" mb="0">Enable on Desktop</FormLabel>
              <Switch id="enabledDesktop" name="enabledDesktop" isChecked={current?.enabledDesktop || false} onChange={handleChange} />
            </HStack>
            <FormLabel>Mobile Image</FormLabel>
            <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'imageMobile')} isDisabled={uploading} />
            {current?.imageMobile && <Image src={current.imageMobile} maxH="120px" borderRadius="md" />}
            <HStack>
              <FormLabel htmlFor="enabledMobile" mb="0">Enable on Mobile</FormLabel>
              <Switch id="enabledMobile" name="enabledMobile" isChecked={current?.enabledMobile || false} onChange={handleChange} />
            </HStack>
            <FormLabel>Start Date</FormLabel>
            <Input type="date" name="startDate" value={current?.startDate ? current.startDate.substring(0,10) : ''} onChange={handleChange} />
            <FormLabel>End Date</FormLabel>
            <Input type="date" name="endDate" value={current?.endDate ? current.endDate.substring(0,10) : ''} onChange={handleChange} />
            <HStack spacing={4} mt={4}>
              <Button colorScheme="blue" onClick={handleSave} isLoading={saving}>Save</Button>
              {current?._id && <Button colorScheme="red" variant="outline" onClick={() => handleDelete(current._id)}>Delete</Button>}
              <Button variant="ghost" onClick={() => setCurrent(null)}>Cancel</Button>
            </HStack>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
