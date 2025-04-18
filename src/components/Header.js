import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  IconButton,
  useDisclosure,
  HStack,
  CloseButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Container,
} from "@chakra-ui/react";
import {
  MoonIcon,
  SunIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import {
  FaGithub,
  FaUser,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";

export default function Header() {
  const [menuItems, setMenuItems] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mobileBg = useColorModeValue("white", "gray.900");
  const { colorMode, toggleColorMode } = useColorMode();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/header-menu")
      .then((r) => r.json())
      .then((data) =>
        Array.isArray(data)
          ? setMenuItems(data.filter((i) => i.visible).sort((a, b) => a.order - b.order))
          : setMenuItems([])
      )
      .catch(() => setMenuItems([]));
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <>
      <Box
        bg={useColorModeValue("white", "gray.900")}
        px={4}
        position="fixed"
        w="100%"
        top={0}
        zIndex={999}
        borderBottom="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        boxShadow="sm"
      >
        <Container maxW="6xl">
          <Flex h={16} align="center" justify="space-between">
            <HStack spacing={8} align="center">
              <RouterLink to="/">
                <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r,purple.500,purple.300)" bgClip="text">
                  SHIV JHA
                </Text>
              </RouterLink>
              <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
                {menuItems.length
                  ? menuItems.map((item) => (
                      <RouterLink key={item._id} to={item.url}>
                        <Button variant="ghost">{item.label}</Button>
                      </RouterLink>
                    ))
                  : ["Home", "Blog", "Contact"].map((label) => (
                      <RouterLink key={label} to={label === "Home" ? "/" : `/${label.toLowerCase()}`}>
                        <Button variant="ghost">{label}</Button>
                      </RouterLink>
                    ))}
              </HStack>
            </HStack>

            <HStack spacing={3} align="center">
              <IconButton as="a" href="https://github.com/yourusername" aria-label="GitHub" icon={<FaGithub />} display={{ base: 'none', md: 'flex' }} />
              <IconButton as="a" href="https://linkedin.com/in/yourusername" aria-label="LinkedIn" icon={<FaLinkedinIn />} display={{ base: 'none', md: 'flex' }} />
              <IconButton as="a" href="https://youtube.com/@yourchannel" aria-label="YouTube" icon={<FaYoutube />} display={{ base: 'none', md: 'flex' }} />
              <Button onClick={toggleColorMode} aria-label="Toggle color mode">
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              {user ? (
                <Menu>
                  <MenuButton as={Button}>{`Hi, ${user.name}`}</MenuButton>
                  <MenuList>
                    {user.isAdmin && (<MenuItem onClick={() => navigate("/dashboard")}>Dashboard</MenuItem>)}
                    <MenuItem onClick={onLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <IconButton as={RouterLink} to="/login" aria-label="Login" icon={<FaUser />} />
              )}
              <IconButton icon={<HamburgerIcon />} display={{ base: "flex", md: "none" }} onClick={onOpen} aria-label="Open Menu" />
            </HStack>
          </Flex>
        </Container>
      </Box>

      {isOpen && (
        <Box pos="fixed" top={0} left={0} w="100%" h="100vh" bg="rgba(0,0,0,0.4)" zIndex="overlay" onClick={onClose}>
          <Box bg={mobileBg} w={{ base: "80%", sm: "60%", md: "400px" }} h="100vh" p={4} onClick={(e) => e.stopPropagation()} sx={{ animation: 'slideInLeft 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards' }} zIndex="modal">
            <Flex mb={4} justify="space-between">
              <Text fontSize="xl" fontWeight="bold">Menu</Text>
              <CloseButton onClick={onClose} />
            </Flex>
            <Stack spacing={4}>
              {["Home", "Blog", "Contact"].map((label) => (
                <RouterLink key={label} to={label === "Home" ? "/" : `/${label.toLowerCase()}`} onClick={onClose}>
                  <Button w="full" variant="ghost">{label}</Button>
                </RouterLink>
              ))}
            </Stack>
            <HStack spacing={3} justify="center" mt={4}>
              <IconButton as="a" href="https://github.com/yourusername" aria-label="GitHub" icon={<FaGithub />} />
              <IconButton as="a" href="https://linkedin.com/in/yourusername" aria-label="LinkedIn" icon={<FaLinkedinIn />} />
              <IconButton as="a" href="https://youtube.com/@yourchannel" aria-label="YouTube" icon={<FaYoutube />} />
            </HStack>
          </Box>
        </Box>
      )}

      <Box h="64px" />
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
