import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Input, Button, VStack, HStack, Textarea, IconButton, Divider, Text, FormLabel
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaSave, FaLink, FaRegSmile } from 'react-icons/fa';

const FooterManager = () => {
  const [footer, setFooter] = useState({ text: '', links: [], social: [] });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/footer')
      .then(res => res.json())
      .then(data => {
        setFooter(data);
        setLoading(false);
      });
  }, []);

  const updateField = (field, value) => {
    setFooter(prev => ({ ...prev, [field]: value }));
  };

  const updateLink = (idx, key, value) => {
    const newLinks = [...footer.links];
    newLinks[idx][key] = value;
    setFooter(prev => ({ ...prev, links: newLinks }));
  };

  const addLink = () => {
    setFooter(prev => ({ ...prev, links: [...prev.links, { label: '', url: '' }] }));
  };

  const removeLink = (idx) => {
    setFooter(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }));
  };

  const updateSocial = (idx, key, value) => {
    const newSocial = [...footer.social];
    newSocial[idx][key] = value;
    setFooter(prev => ({ ...prev, social: newSocial }));
  };

  const addSocial = () => {
    setFooter(prev => ({ ...prev, social: [...prev.social, { icon: '', url: '' }] }));
  };

  const removeSocial = (idx) => {
    setFooter(prev => ({ ...prev, social: prev.social.filter((_, i) => i !== idx) }));
  };

  const saveFooter = async () => {
    setSaving(true);
    await fetch('/api/footer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(footer)
    });
    setSaving(false);
  };

  return (
    <Box maxW="2xl" mx="auto" mt={8} p={6} bg="white" borderRadius="md" boxShadow="md">
      <Heading size="md" mb={4}>Footer Manager</Heading>
      <FormLabel>Footer Text</FormLabel>
      <Textarea
        value={footer.text}
        onChange={e => updateField('text', e.target.value)}
        mb={4}
        placeholder="Enter footer text (e.g. copyright, tagline)"
      />
      <Divider my={4} />
      <Heading size="sm" mb={2}>Links</Heading>
      <VStack align="stretch" spacing={2}>
        {footer.links.map((link, idx) => (
          <HStack key={idx}>
            <Input
              value={link.label}
              onChange={e => updateLink(idx, 'label', e.target.value)}
              placeholder="Label"
              size="sm"
            />
            <Input
              value={link.url}
              onChange={e => updateLink(idx, 'url', e.target.value)}
              placeholder="URL"
              size="sm"
            />
            <IconButton icon={<FaTrash />} colorScheme="red" size="sm" onClick={() => removeLink(idx)} />
          </HStack>
        ))}
        <Button leftIcon={<FaPlus />} size="sm" onClick={addLink}>Add Link</Button>
      </VStack>
      <Divider my={4} />
      <Heading size="sm" mb={2}>Social Icons</Heading>
      <VStack align="stretch" spacing={2}>
        {footer.social.map((soc, idx) => (
          <HStack key={idx}>
            <Input
              value={soc.icon}
              onChange={e => updateSocial(idx, 'icon', e.target.value)}
              placeholder="Icon (e.g. FaTwitter)"
              size="sm"
            />
            <Input
              value={soc.url}
              onChange={e => updateSocial(idx, 'url', e.target.value)}
              placeholder="URL"
              size="sm"
            />
            <IconButton icon={<FaTrash />} colorScheme="red" size="sm" onClick={() => removeSocial(idx)} />
          </HStack>
        ))}
        <Button leftIcon={<FaPlus />} size="sm" onClick={addSocial}>Add Social Icon</Button>
      </VStack>
      <Button leftIcon={<FaSave />} colorScheme="blue" mt={6} isLoading={saving} onClick={saveFooter}>Save Footer</Button>
      {loading && <Text mt={2}>Loading...</Text>}
    </Box>
  );
};

export default FooterManager;
