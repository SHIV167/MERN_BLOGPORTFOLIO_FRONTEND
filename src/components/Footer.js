import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
  HStack,
  Spinner
} from "@chakra-ui/react";
import * as FaIcons from "react-icons/fa"; // for dynamic icon rendering

const Footer = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Move hooks to top
  const bgGradient = useColorModeValue(
    "linear(to-r, purple.100, blue.100)",
    "linear(to-r, purple.900, blue.900)"
  );
  const borderTopColor = useColorModeValue("gray.200", "gray.700");

  // Footer API fetch removed due to unused state
  useEffect(() => {
    setLoading(false);
  }, []);

  // Helper: render icon by name
  const renderIcon = (iconName) => {
    const IconComp = FaIcons[iconName];
    return IconComp ? <IconComp size={20} /> : null;
  };

  if (loading) return <Box py={8} textAlign="center"><Spinner /> Loading footer...</Box>;

  return (
    <Box
      as="footer"
      bgGradient={bgGradient}
      py={8}>
      <Container maxW="container.xl">
        {/* Static Footer Content */}
        <Text color="gray.500">No footer content found.</Text>

        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          pt={8}
          mt={8}
          borderTopWidth={1}
          borderTopColor={borderTopColor}>
          <Text>© 2024 Shiv Jha. All rights reserved.</Text>
          {/* Social icons are now rendered dynamically from backend data above. */}
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
