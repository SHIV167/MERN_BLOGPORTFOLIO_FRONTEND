import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPost } from "../features/posts/postsSlice";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  SimpleGrid,
  HStack,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { FaArrowLeft, FaCalendarAlt, FaClock, FaFacebook, FaTwitter, FaLinkedin, FaLink } from "react-icons/fa";
import EmojiFeedback from "../components/EmojiFeedback";

function stripHtml(html) {
  if (!html) return '';
  let text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const tmp = document.createElement('DIV');
  tmp.innerHTML = text;
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

function BlogPost() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { post, isLoading, posts } = useSelector((state) => state.posts);
  const bgColor = "white";
  const headingColor = "#231942";
  const purpleBg = "#cbb3f7";
  const cardShadow = "0 4px 24px rgba(44, 40, 81, 0.11)";

  useEffect(() => {
    if (slug) {
      dispatch(getPost(slug));
    }
  }, [dispatch, slug]);

  // Placeholder for related/more articles
  const moreArticles = (posts || [])
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  if (isLoading || !post) {
    return (
      <Container maxW={"7xl"} py={12}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Box minH="100vh" bg={purpleBg}
      pb={{ base: 8, md: 16 }}
      position="relative"
    >
      {/* Header Banner */}
      <Box
        w="100%"
        h={{ base: "220px", md: "300px" }}
        position="relative"
        overflow="hidden"
        borderBottomRadius={{ base: "2xl", md: "3xl" }}
        mb={{ base: 0, md: 0 }}
        zIndex={1}
      >
        <Image
          src={post.image ? `${process.env.REACT_APP_BACKEND_URL}${post.image}` : "/post-placeholder.jpg"}
          alt="Banner"
          w="100%"
          h="100%"
          objectFit="cover"
          position="absolute"
          top={0}
          left={0}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bgGradient="linear(to-b, rgba(30,25,60,0.7), rgba(30,25,60,0.3))"
        />
        {/* Back to Blog Button on Banner */}
        <Button
          leftIcon={<FaArrowLeft />} 
          variant="ghost"
          pos="absolute"
          top={{ base: 3, md: 6 }}
          left={{ base: 3, md: 8 }}
          as={ChakraLink} href="/blog"
          fontWeight="bold"
          color="gray.100"
          bg="rgba(44,40,81,0.5)"
          _hover={{ bg: 'rgba(44,40,81,0.8)' }}
          zIndex={3}
        >
          Back to Blog
        </Button>
      </Box>

      <Container maxW="4xl" centerContent position="relative" zIndex={2}>
        <Box
          w="100%"
          bg={bgColor}
          boxShadow={cardShadow}
          rounded="xl"
          p={{ base: 6, md: 10 }}
          mb={12}
          pos="relative"
          mt={{ base: -20, md: -32 }}
        >
          {post.image && (
            <Box className="image-container" mb={6}>
              <Image
                src={`${process.env.REACT_APP_BACKEND_URL}${post.image}`}
                alt={post.title}
              />
            </Box>
          )}

          <Heading color={headingColor} fontSize={{ base: "2xl", md: "2.2rem" }} mb={3}>
            {post.title}
          </Heading>

          <HStack spacing={6} color="gray.500" fontSize="md" mb={2}>
            <HStack spacing={2}>
              <FaCalendarAlt />
              <Text>{new Date(post.createdAt).toLocaleDateString()}</Text>
            </HStack>
            <HStack spacing={2}>
              <FaClock />
              <Text>6 min read</Text>
            </HStack>
          </HStack>

          {post.excerpt && (
            <Text color="gray.600" fontSize="lg" mb={4}>
              {post.excerpt}
            </Text>
          )}

          <HStack spacing={3} mb={6}>
            <Text color="gray.500" fontWeight="bold">Share:</Text>
            <ChakraLink href="#" isExternal><FaFacebook /></ChakraLink>
            <ChakraLink href="#" isExternal><FaTwitter /></ChakraLink>
            <ChakraLink href="#" isExternal><FaLinkedin /></ChakraLink>
            <ChakraLink href="#" isExternal><FaLink /></ChakraLink>
          </HStack>

          <Box color="gray.700" fontSize="md" mb={0}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {/* Emoji Feedback Section */}
          <EmojiFeedback postId={post._id} />
        </Box>

        {/* More Articles Section */}
        <Box w="100%" mt={6}>
          <Heading as="h3" size="lg" mb={6} color={headingColor}>
            More Articles
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {(moreArticles.length ? moreArticles : [post, post]).map((article, idx) => (
              <Box
                key={idx}
                bg={bgColor}
                boxShadow={cardShadow}
                rounded="xl"
                p={5}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <Box className="image-container" mb={3}>
                  <Image
                    src={article.image ? `${process.env.REACT_APP_BACKEND_URL}${article.image}` : "/post-placeholder.jpg"}
                    alt={article.title}
                  />
                  <Heading size="md" mb={2} color={headingColor}>
                    {article.title}
                  </Heading>
                  <Text color="gray.600" mb={2}>
                    {article.excerpt ? stripHtml(article.excerpt).substring(0, 80) : (article.content ? stripHtml(article.content).substring(0, 80) + '...' : '')}
                  </Text>
                </Box>
                <HStack color="gray.500" fontSize="sm">
                  <FaCalendarAlt />
                  <Text>{new Date(article.createdAt).toLocaleDateString()}</Text>
                  <FaClock />
                  <Text>5 min read</Text>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}

export default BlogPost;
