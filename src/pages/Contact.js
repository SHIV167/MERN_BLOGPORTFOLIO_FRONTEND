import React from 'react';
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Text,
  FormErrorMessage,
  useToast,
  Heading,
  HStack,
  Box,
  IconButton
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FaWhatsapp, FaLinkedinIn, FaGithub, FaTwitter, FaYoutube } from 'react-icons/fa';
import { ChevronUpIcon } from '@chakra-ui/icons';

const Contact = () => {
  const toast = useToast();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name is too long')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    subject: Yup.string()
      .min(5, 'Subject must be at least 5 characters')
      .max(100, 'Subject is too long'),
    message: Yup.string()
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message is too long')
      .required('Message is required')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      await axios.post('/api/contact', values, config);
      
      toast({
        title: 'Message sent!',
        description: 'We\'ll get back to you soon.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });

      resetForm();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Box minH="100vh" w="100%" bgGradient="linear(to-br, #4317b7 0%, #7f53ac 100%)" py={{ base: 8, md: 20 }} px={{ base: 2, md: 0 }}>
      <Container maxW="7xl">
        <Box
          display={{ base: 'block', md: 'flex' }}
          alignItems="stretch"
          gap={{ base: 10, md: 12 }}
        >
          {/* Left: Get In Touch */}
          <Box flex={1} color="white" pr={{ md: 8 }} mb={{ base: 10, md: 0 }}>
            <Heading fontSize="2xl" mb={2} fontWeight={800}>Get In Touch</Heading>
            <Text mb={8} color="whiteAlpha.900" fontSize="lg">
              Have a project in mind or just want to say hello? Feel free to reach out!
            </Text>
            <VStack align="start" spacing={6} mb={8}>
              <HStack spacing={4}>
                <Button bg="whiteAlpha.200" color="white" borderRadius="lg" p={0} minW={0} _hover={{ bg: 'whiteAlpha.300' }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="10" r="3"/><path d="M22 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/></svg>
                </Button>
                <Box>
                  <Text fontWeight={700}>Location</Text>
                  <Text fontSize="sm">123 Developer St, Tech City, IN</Text>
                </Box>
              </HStack>
              <HStack spacing={4}>
                <Button bg="whiteAlpha.200" color="white" borderRadius="lg" p={0} minW={0} _hover={{ bg: 'whiteAlpha.300' }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>
                </Button>
                <Box>
                  <Text fontWeight={700}>Email</Text>
                  <Text fontSize="sm">contact@example.com</Text>
                </Box>
              </HStack>
              <HStack spacing={4}>
                <Button bg="whiteAlpha.200" color="white" borderRadius="lg" p={0} minW={0} _hover={{ bg: 'whiteAlpha.300' }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V17a2 2 0 0 1-2 2c-9.94 0-18-8.06-18-18a2 2 0 0 1 2-2h.09"/><path d="M22 16.92l-5.06-5.06a2 2 0 0 0-2.83 0l-1.12 1.12a16 16 0 0 1-7.07-7.07l1.12-1.12a2 2 0 0 0 0-2.83L4.92 2"/></svg>
                </Button>
                <Box>
                  <Text fontWeight={700}>Phone</Text>
                  <Text fontSize="sm">+91 9876 543 210</Text>
                </Box>
              </HStack>
              <HStack spacing={4}>
                <Button bg="whiteAlpha.200" color="white" borderRadius="lg" p={0} minW={0} _hover={{ bg: 'whiteAlpha.300' }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 6v6l4 2"/></svg>
                </Button>
                <Box>
                  <Text fontWeight={700}>Website</Text>
                  <Text fontSize="sm">www.example.com</Text>
                </Box>
              </HStack>
            </VStack>
            <Text mb={2} fontWeight={600}>Follow Me:</Text>
            <HStack spacing={4}>
              <IconButton as="a" href="#" aria-label="WhatsApp" icon={<FaWhatsapp />} bg="green.400" color="white" borderRadius="full" boxSize={9} _hover={{ bg: 'green.500' }} />
              <IconButton as="a" href="#" aria-label="LinkedIn" icon={<FaLinkedinIn />} bg="blue.700" color="white" borderRadius="full" boxSize={9} _hover={{ bg: 'blue.800' }} />
              <IconButton as="a" href="#" aria-label="GitHub" icon={<FaGithub />} bg="gray.900" color="white" borderRadius="full" boxSize={9} _hover={{ bg: 'gray.700' }} />
              <IconButton as="a" href="#" aria-label="Twitter" icon={<FaTwitter />} bg="twitter.400" color="white" borderRadius="full" boxSize={9} _hover={{ bg: 'twitter.500' }} />
              <IconButton as="a" href="#" aria-label="YouTube" icon={<FaYoutube />} bg="red.500" color="white" borderRadius="full" boxSize={9} _hover={{ bg: 'red.600' }} />
            </HStack>
          </Box>

          {/* Right: Contact Form */}
          <Box flex={1} bg="white" borderRadius="xl" boxShadow="xl" p={{ base: 6, md: 10 }}>
            <Heading fontSize="xl" mb={6} color="#231942" fontWeight={800}>Send Me a Message</Heading>
            <Formik
              initialValues={{
                name: '',
                email: '',
                subject: '',
                message: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form style={{ width: '100%' }}>
                  <VStack spacing={4} align="stretch">
                    <Field name="name">
                      {({ field }) => (
                        <FormControl isInvalid={errors.name && touched.name}>
                          <FormLabel>Name</FormLabel>
                          <Input {...field} placeholder="Your name" bg="gray.50" />
                          <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="email">
                      {({ field }) => (
                        <FormControl isInvalid={errors.email && touched.email}>
                          <FormLabel>Email</FormLabel>
                          <Input {...field} type="email" placeholder="Your email" bg="gray.50" />
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="subject">
                      {({ field }) => (
                        <FormControl isInvalid={errors.subject && touched.subject}>
                          <FormLabel>Subject</FormLabel>
                          <Input {...field} placeholder="Message subject" bg="gray.50" />
                          <FormErrorMessage>{errors.subject}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="message">
                      {({ field }) => (
                        <FormControl isInvalid={errors.message && touched.message}>
                          <FormLabel>Message</FormLabel>
                          <Textarea {...field} placeholder="Your message" rows={6} bg="gray.50" />
                          <FormErrorMessage>{errors.message}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Button
                      type="submit"
                      colorScheme="purple"
                      size="lg"
                      width="100%"
                      isLoading={isSubmitting}
                      loadingText="Sending..."
                    >
                      Send Message
                    </Button>
                  </VStack>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Container>
      {/* Floating WhatsApp Button (bottom left) */}
      <IconButton
        as="a"
        href="https://wa.me/919876543210"
        target="_blank"
        aria-label="WhatsApp Chat"
        icon={<FaWhatsapp size={24} />}
        bg="green.400"
        color="white"
        borderRadius="full"
        boxSize={12}
        position="fixed"
        left={6}
        bottom={6}
        zIndex={100}
        boxShadow="lg"
        _hover={{ bg: 'green.500' }}
      />
      {/* Floating Back to Top Button (bottom right) */}
      <IconButton
        aria-label="Back to Top"
        icon={<ChevronUpIcon boxSize={7} />}
        bg="purple.500"
        color="white"
        borderRadius="full"
        boxSize={12}
        position="fixed"
        right={6}
        bottom={6}
        zIndex={100}
        boxShadow="lg"
        _hover={{ bg: 'purple.600' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </Box>
  );
};

export default Contact;
