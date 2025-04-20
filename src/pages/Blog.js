import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPosts } from "../features/posts/postsSlice";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  HStack,
  Button,
} from "@chakra-ui/react";

function stripHtml(html) {
  if (!html) return '';
  // Remove all HTML tags
  let text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  // Decode HTML entities
  const tmp = document.createElement('DIV');
  tmp.innerHTML = text;
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

function Blog() {
  const dispatch = useDispatch();
  const { posts = [], isLoading, isError, message } = useSelector((state) => state.posts || { posts: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Container maxW={"7xl"} py={12}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW={"7xl"} py={12}>
        <Text color="red.500">{message}</Text>
      </Container>
    );
  }

  const gradients = [
    'linear(to-br, #a18cd1 0%, #fbc2eb 100%)', // purple-pink
    'linear(to-br, #f7971e 0%, #ffd200 100%)', // orange-yellow
    'linear(to-br, #43cea2 0%, #185a9d 100%)', // teal-blue
  ];

  return (
    <Box minH="100vh" bg="#cbb3f7" py={0}>
      {/* Header Banner */}
      <Box
        w="100%"
        minH="350px"
        bgImage="url('/blog-banner.jpg')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        py={{ base: 10, md: 16 }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxW="7xl" px={{ base: 2, md: 8 }}>
          <Heading
            as="h1"
            fontSize={{ base: "2xl", md: "2.8rem" }}
            color="white"
            fontWeight={900}
            letterSpacing={-1}
            textAlign="center"
            mb={8}
          >
            All Blog Posts
          </Heading>
        </Container>
      </Box>
      {/* Posts Grid */}
      <Container maxW="7xl" px={{ base: 2, md: 8 }} py={{ base: 6, md: 10 }}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {Array.isArray(posts) && posts.length > 0 ? currentPosts.map((post, idx) => (
            <Box
              key={post._id}
              bgGradient={gradients[idx % gradients.length]}
              rounded="2xl"
              boxShadow="xl"
              overflow="hidden"
              display="flex"
              flexDirection="column"
              minH="420px"
              transition="transform 0.18s, box-shadow 0.18s"
              _hover={{
                transform: 'translateY(-6px) scale(1.025)',
                boxShadow: '2xl',
              }}
            >
              <Box className="image-container">
                <Image
                  src={post.image
                    ? post.image.startsWith('http')
                      ? post.image
                      : `${process.env.REACT_APP_BACKEND_URL}${post.image}`
                    : "/post-placeholder.jpg"}
                  alt={post.title}
                  objectFit="cover"
                  w="100%"
                  h="220px"
                  borderRadius="lg"
                />
              </Box>
              <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between" p={6} pt={4}>
                <Box>
                  <Heading fontSize="xl" color="white" fontWeight={700} mb={2}>
                    {post.title}
                  </Heading>
                  <Text color="whiteAlpha.900" mb={4} fontSize="md" noOfLines={2}>
                    {post.excerpt ? stripHtml(post.excerpt).substring(0, 90) : (post.content ? stripHtml(post.content).substring(0, 90) + '...' : '')}
                  </Text>
                </Box>
                <Box mt={2}>
                  <HStack spacing={6} color="whiteAlpha.800" fontSize="sm" mb={3}>
                    <HStack spacing={2}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-2-2"/></svg>
                      <Text>{new Date(post.createdAt).toLocaleDateString()}</Text>
                    </HStack>
                    <HStack spacing={2}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                      <Text>5 min read</Text>
                    </HStack>
                  </HStack>
                  <Button
                    as={RouterLink}
                    to={`/blog/${post.slug}`}
                    colorScheme="whiteAlpha"
                    variant="outline"
                    borderRadius="md"
                    fontWeight={700}
                    px={6}
                    py={2}
                    _hover={{ bg: 'whiteAlpha.200', borderColor: 'whiteAlpha.800' }}
                  >
                    Read More
                  </Button>
                </Box>
              </Box>
            </Box>
          )) : (
          <Box py={10} textAlign="center">
            <Text color="whiteAlpha.900">No blog posts found.</Text>
          </Box>
         )}
       </SimpleGrid>
       {/* Pagination controls */}
       <Box mt={8} display="flex" justifyContent="center">
         <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} mr={2}>Prev</Button>
         {Array.from({ length: totalPages }, (_, i) => (
           <Button key={i+1} onClick={() => setCurrentPage(i+1)} variant={currentPage === i+1 ? 'solid' : 'outline'} mx={1}>
             {i+1}
           </Button>
         ))}
         <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} ml={2}>Next</Button>
       </Box>
      </Container>
    </Box>
  );
}

export default Blog;
