import React, { useEffect, useState } from 'react';
import { Box, Heading, Button, SimpleGrid, VStack, Input, Switch, HStack, Text, IconButton } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';

const defaultForm = { label: '', url: '', order: 0, visible: true, config: '' };

export default function HeaderMenuManager() {
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchMenus = async () => {
    const res = await fetch('/api/header-menu');
    setMenus(await res.json());
  };

  useEffect(() => { fetchMenus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, config: form.config ? JSON.parse(form.config) : {} };
    if (editingId) {
      await fetch(`/api/header-menu/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } else {
      await fetch('/api/header-menu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }
    setForm(defaultForm); setEditingId(null); setShowForm(false); fetchMenus();
  };

  const handleEdit = (menu) => {
    setForm({ ...menu, config: menu.config ? JSON.stringify(menu.config, null, 2) : '' });
    setEditingId(menu._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this menu item?')) {
      await fetch(`/api/header-menu/${id}`, { method: 'DELETE' });
      fetchMenus();
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={4}>Header Menu Manager</Heading>
      <Button leftIcon={<AddIcon />} colorScheme="blue" mb={4} onClick={() => { setForm(defaultForm); setEditingId(null); setShowForm(true); }}>Add Menu Item</Button>
      {showForm && (
        <Box as="form" onSubmit={handleSubmit} mb={6} p={4} borderWidth={1} borderRadius="lg" bg="gray.50">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={2}>
            <Input placeholder="Label" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required />
            <Input placeholder="URL" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} required />
            <Input type="number" placeholder="Order" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
            <HStack><Text>Visible</Text><Switch isChecked={form.visible} onChange={e => setForm(f => ({ ...f, visible: e.target.checked }))} /></HStack>
            <Input placeholder="Config (JSON)" value={form.config} onChange={e => setForm(f => ({ ...f, config: e.target.value }))} />
          </SimpleGrid>
          <Button type="submit" colorScheme="green" mr={2}>{editingId ? 'Update' : 'Add'}</Button>
          <Button onClick={() => { setShowForm(false); setEditingId(null); setForm(defaultForm); }}>Cancel</Button>
        </Box>
      )}
      <VStack align="stretch" spacing={3}>
        {menus.map(menu => (
          <HStack key={menu._id} p={3} borderWidth={1} borderRadius="md" bg="white" justify="space-between">
            <Text fontWeight={600}>{menu.label}</Text>
            <Text color="gray.500">{menu.url}</Text>
            <Text>Order: {menu.order}</Text>
            <Text>{menu.visible ? 'Visible' : 'Hidden'}</Text>
            <IconButton icon={<EditIcon />} aria-label="Edit" onClick={() => handleEdit(menu)} />
            <IconButton icon={<DeleteIcon />} aria-label="Delete" colorScheme="red" onClick={() => handleDelete(menu._id)} />
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
