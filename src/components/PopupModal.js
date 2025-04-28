import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  useDisclosure,
  Input,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
import CloudinaryImage from "../components/CloudinaryImage";
const baseUrl =
  process.env.REACT_APP_BACKEND_URL ||
  "https://mern-blogportfolio-backend-server.onrender.com";

export default function PopupModal() {
  const [popup, setPopup] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    console.log(
      "Fetching newsletter data from:",
      `${baseUrl}/api/newsletter/all`
    );
    fetch(`${baseUrl}/api/newsletter/all`)
      .then(async (res) => {
        console.log("Newsletter response status:", res.status);
        const contentType = res.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          return res.json();
        }
        console.log("Invalid content type:", contentType);
        return [];
      })
      .then((data) => {
        console.log("Newsletter data received:", data);
        const list = Array.isArray(data)
          ? data.filter((item) => item.enabled)
          : [];
        console.log("Filtered newsletter items:", list);
        if (list.length > 0) {
          console.log("Setting active popup:", list[0]);
          setPopup(list[0]);
          onOpen();
        }
      })
      .catch((error) => {
        console.error("Newsletter fetch error:", error);
        setPopup(null);
      });
    // eslint-disable-next-line
  }, []);

  if (!popup) return null;

  // Refactored to avoid nested ternary operations
  let imageUrl = null;
  console.log("Processing backgroundBanner:", popup.backgroundBanner);

  if (popup.backgroundBanner) {
    if (popup.backgroundBanner.startsWith("http")) {
      imageUrl = popup.backgroundBanner;
      console.log("Using direct URL:", imageUrl);
    } else if (popup.backgroundBanner.startsWith("/")) {
      imageUrl = `${baseUrl}${popup.backgroundBanner}`;
      console.log("Using path with baseUrl (with slash):", imageUrl);
    } else {
      imageUrl = `${baseUrl}/${popup.backgroundBanner}`;
      console.log("Using path with baseUrl (adding slash):", imageUrl);
    }
  }

  // For debugging
  console.log("Final newsletter popup image URL:", imageUrl);

  // Test image loading directly
  if (imageUrl) {
    const testImg = new Image();
    testImg.onload = () =>
      console.log("Image URL valid and loadable:", imageUrl);
    testImg.onerror = () =>
      console.error("Image URL failed to load:", imageUrl);
    testImg.src = imageUrl;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="lg"
      motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" overflow="hidden" boxShadow="2xl">
        <ModalCloseButton />
        <ModalBody p={0}>
          {imageUrl && (
            <>
              {/* Use simpler approach for Cloudinary URLs to avoid Cloudinary SDK issues */}
              {imageUrl.includes("cloudinary.com") ? (
                <img
                  src={imageUrl}
                  alt="Newsletter Popup Direct"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  onError={(e) => {
                    console.error("Direct image failed to load:", imageUrl);
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <CloudinaryImage
                  src={imageUrl}
                  alt="Newsletter Popup"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              )}
            </>
          )}
          <Box p={6} textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              {popup.title}
            </Text>
            {!subscribed ? (
              <VStack spacing={4} mt={4}>
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  colorScheme="blue"
                  onClick={async () => {
                    setSubscribing(true);
                    try {
                      const res = await fetch(
                        `${baseUrl}/api/newsletter/subscribe`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email }),
                        }
                      );
                      const data = await res.json();
                      if (res.ok) {
                        setSubscribed(true);
                        toast({
                          title: "Subscribed!",
                          status: "success",
                          duration: 3000,
                        });
                      } else {
                        toast({
                          title: data.message || "Subscription failed",
                          status: "error",
                          duration: 3000,
                        });
                      }
                    } catch (err) {
                      console.error(err);
                      toast({
                        title: "Subscription error",
                        status: "error",
                        duration: 3000,
                      });
                    } finally {
                      setSubscribing(false);
                    }
                  }}
                  isLoading={subscribing}>
                  Subscribe
                </Button>
              </VStack>
            ) : (
              <Text mt={4}>Thank you for subscribing!</Text>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
