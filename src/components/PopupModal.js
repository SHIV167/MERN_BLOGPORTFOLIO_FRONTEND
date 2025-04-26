import React, { useEffect, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Image, Box, Text, useDisclosure } from "@chakra-ui/react";
const baseUrl = process.env.REACT_APP_BACKEND_URL || 'https://mern-blogportfolio-backend-server.onrender.com';

export default function PopupModal() {
  const [popup, setPopup] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch(`${baseUrl}/api/newsletter/all`)
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        }
        return [];
      })
      .then(data => {
        const list = Array.isArray(data) ? data.filter(item => item.enabled) : [];
        if (list.length > 0) {
          setPopup(list[0]);
          onOpen();
        }
      })
      .catch(() => setPopup(null));
    // eslint-disable-next-line
  }, []);

  if (!popup) return null;

  const imageUrl = popup.backgroundBanner
    ? (popup.backgroundBanner.startsWith('http')
        ? popup.backgroundBanner
        : `${baseUrl}${popup.backgroundBanner}`)
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" overflow="hidden" boxShadow="2xl">
        <ModalCloseButton />
        <ModalBody p={0}>
          {imageUrl && <Image src={imageUrl} w="100%" h="auto" objectFit="cover" alt="Newsletter Popup" />}
          <Box p={6} textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" mb={2}>{popup.title}</Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
