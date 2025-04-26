import React, { useEffect, useState } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react';

export default function NewsletterSubscribersManager() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_BACKEND_URL || 'https://mern-blogportfolio-backend-server.onrender.com';

  useEffect(() => {
    fetch(`${baseUrl}/api/newsletter/subscribers`)
      .then(res => res.json())
      .then(data => setSubs(data))
      .catch(err => console.error('Subscribers load error', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <Box p={8} maxW="3xl" mx="auto">
      <Heading mb={4}>Newsletter Subscribers</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>Subscribed At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {subs.map(sub => (
            <Tr key={sub._id}>
              <Td>{sub.email}</Td>
              <Td>{new Date(sub.subscribedAt).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

