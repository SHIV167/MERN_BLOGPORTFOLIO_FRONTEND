import React, { useEffect, useState } from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Text } from "@chakra-ui/react";

const emojiMap = {
  like: "😊",
  love: "❤️",
  wow: "😮",
};

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function FeedbackDashboard() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/api/feedback`)
      .then(res => res.json())
      .then(data => { setFeedback(data); setLoading(false); })
      .catch(err => { console.error('Feedback load error', err); setLoading(false); });
  }, []);

  // Group feedback by postId
  const grouped = Array.isArray(feedback) ? feedback.reduce((acc, fb) => {
    if (!acc[fb.postId]) acc[fb.postId] = { like: 0, love: 0, wow: 0 };
    acc[fb.postId][fb.emoji] = fb.count;
    return acc;
  }, {}) : {};

  return (
    <Box p={8}>
      <Heading mb={6}>Post Emoji Feedback</Heading>
      {loading ? <Spinner /> : (
        Object.keys(grouped).length === 0 ? <Text>No feedback yet.</Text> : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Post ID</Th>
                <Th>😊 Like</Th>
                <Th>❤️ Love</Th>
                <Th>😮 Wow</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(grouped).map(([postId, counts]) => (
                <Tr key={postId}>
                  <Td>{postId}</Td>
                  <Td>{counts.like || 0}</Td>
                  <Td>{counts.love || 0}</Td>
                  <Td>{counts.wow || 0}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )
      )}
    </Box>
  );
}
