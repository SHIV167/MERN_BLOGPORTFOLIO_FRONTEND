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
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Move hooks to top
  const bgGradient = useColorModeValue(
    "linear(to-r, purple.100, blue.100)",
    "linear(to-r, purple.900, blue.900)"
  );
  const borderTopColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    fetch('/api/footer')
      .then(res => res.json())
      .then(data => { setFooter(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
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
        {/* Dynamic Footer Content */}
        {footer && footer.links && footer.links.length > 0 ? (
          <Stack direction={{ base: "column", md: "row" }} spacing={{ base: 8, md: 16 }}>
            <Stack flex={1} spacing={4}>
              <Text fontSize="lg" fontWeight="bold">Links</Text>
              <Stack>
                {footer.links.map((link, idx) => (
                  <Link key={idx} href={link.url} isExternal={/^https?:/.test(link.url)}>
                    {link.label || link.url}
                  </Link>
                ))}
              </Stack>
            </Stack>
            <Stack flex={1} spacing={4}>
              <Text fontSize="lg" fontWeight="bold">Social</Text>
              <HStack>
                {footer.social && footer.social.map((soc, idx) => (
                  <Link key={idx} href={soc.url} isExternal>
                    {renderIcon(soc.icon)}
                  </Link>
                ))}
              </HStack>
            </Stack>
            <Stack flex={2} spacing={4} justify="center">
              <Text>{footer.text}</Text>
            </Stack>
          </Stack>
        ) : (
          // fallback static content
          <Text color="gray.500">No footer content found.</Text>
        )}

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
