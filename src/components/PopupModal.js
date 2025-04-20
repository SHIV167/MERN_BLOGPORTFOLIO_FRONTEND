import React, { useEffect, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Image, Box, Text, useDisclosure } from "@chakra-ui/react";
const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function PopupModal() {
  const [popup, setPopup] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch(`${baseUrl}/api/popup`)
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        }
        return [];
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPopup(data[0]);
          onOpen();
        }
      })
      .catch(() => setPopup(null));
    // eslint-disable-next-line
  }, []);

  if (!popup) return null;

  const imageUrl = window.innerWidth > 600
    ? (popup.imageDesktop
        ? popup.imageDesktop.startsWith('http')
          ? popup.imageDesktop
          : `${baseUrl}${popup.imageDesktop}`
        : null)
    : (popup.imageMobile
        ? popup.imageMobile.startsWith('http')
          ? popup.imageMobile
          : `${baseUrl}${popup.imageMobile}`
        : null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" overflow="hidden" boxShadow="2xl">
        <ModalCloseButton />
        <ModalBody p={0}>
          {imageUrl && <Image src={imageUrl} w="100%" h="auto" objectFit="cover" alt="Popup" />}
          <Box p={6} textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" mb={2}>{popup.title}</Text>
            <Text fontSize="md" color="gray.600">{popup.content}</Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
