import React, { useEffect, useState } from "react";
import { Box, HStack, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { FaRegSmile, FaRegHeart, FaRegSurprise } from "react-icons/fa";

const emojiList = [
  { type: "like", icon: FaRegSmile, label: "Like" },
  { type: "love", icon: FaRegHeart, label: "Love" },
  { type: "wow", icon: FaRegSurprise, label: "Wow" },
];

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function EmojiFeedback({ postId }) {
  const [counts, setCounts] = useState({ like: 0, love: 0, wow: 0 });
  const [clicked, setClicked] = useState(null);

  useEffect(() => {
    fetch(`${baseUrl}/api/feedback/${postId}`)
      .then(res => res.json())
      .then(data => {
        const newCounts = { like: 0, love: 0, wow: 0 };
        data.forEach(fb => { newCounts[fb.emoji] = fb.count; });
        setCounts(newCounts);
      })
      .catch(err => console.error('EmojiFeedback load error', err));
  }, [postId]);

  const handleClick = (type) => {
    if (clicked) return; // Prevent multiple votes per session
    setClicked(type);
    fetch(`${baseUrl}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, emoji: type })
    })
      .then(res => res.json())
      .then(fb => {
        setCounts(c => ({ ...c, [type]: fb.count }));
      })
      .catch(err => console.error('EmojiFeedback save error', err));
  };

  return (
    <Box mt={8} textAlign="center">
      <Text fontSize="lg" fontWeight="bold" mb={4}>Share Feedback</Text>
      <HStack spacing={6} justify="center">
        {emojiList.map(({ type, icon: Icon, label }) => (
          <Tooltip label={label} key={type} hasArrow>
            <IconButton
              aria-label={label}
              icon={<Icon size={26} />}
              variant={clicked === type ? "solid" : "outline"}
              colorScheme={clicked === type ? "purple" : "gray"}
              onClick={() => handleClick(type)}
              isDisabled={!!clicked}
            />
          </Tooltip>
        ))}
        <HStack spacing={2} ml={4}>
          <Text fontSize="md">{counts.like} 😊</Text>
          <Text fontSize="md">{counts.love} ❤️</Text>
          <Text fontSize="md">{counts.wow} 😮</Text>
        </HStack>
      </HStack>
    </Box>
  );
}
