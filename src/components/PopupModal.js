import React, { useEffect, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Image, Box, Text, useDisclosure } from "@chakra-ui/react";

export default function PopupModal() {
  const [popup, setPopup] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch('/api/popup')
      .then(res => res.json())
      .then(data => {
        // data is now an array of eligible popups
        if (Array.isArray(data) && data.length > 0) {
          setPopup(data[0]);
          onOpen();
        }
      });
    // eslint-disable-next-line
  }, []);

  if (!popup) return null;

  const imageUrl = window.innerWidth > 600 ? popup.imageDesktop : popup.imageMobile;

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
