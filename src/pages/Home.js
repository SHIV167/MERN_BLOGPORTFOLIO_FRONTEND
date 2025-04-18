import React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  useColorModeValue,
  Image,
  SimpleGrid,
  VStack,
  HStack,
  Tag,
  Progress,
  Link as ChakraLink,
  AspectRatio,
} from "@chakra-ui/react";
// useEffect and useState are imported below in a single line; remove this duplicate import.
import { useDispatch, useSelector } from "react-redux";
import {
  FaExternalLinkAlt,
  FaCode,
  FaLaptopCode,
  FaYoutube,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaPhp,
  FaNodeJs,
} from "react-icons/fa";
import { SiRedux, SiMongodb } from "react-icons/si";
import { getSkills } from "../features/skills/skillsSlice";
import { getFeaturedProjects } from "../features/projects/projectsSlice";
import { getFeaturedVideos } from "../features/youtube/youtubeSlice";
import { getPosts } from "../features/posts/postsSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import SliderSection from '../components/SliderSection';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const MotionBox = motion(Box);
const MotionSvg = motion.svg;

function stripHtml(html) {
  if (!html) return '';
  let text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const tmp = document.createElement('DIV');
  tmp.innerHTML = text;
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

// Circular animated tech icons for hero banner
const techIcons = [
  { icon: FaHtml5, color: '#E44D26', label: 'HTML5' },
  { icon: FaCss3Alt, color: '#1572B6', label: 'CSS3' },
  { icon: FaJs, color: '#F7DF1E', label: 'JavaScript' },
  { icon: FaReact, color: '#61DAFB', label: 'React' },
  { icon: SiRedux, color: '#764ABC', label: 'Redux' },
  { icon: FaPhp, color: '#777BB4', label: 'PHP' },
  { icon: FaNodeJs, color: '#339933', label: 'Node.js' },
  { icon: SiMongodb, color: '#47A248', label: 'MongoDB' },
];



const CircleTechIcons = () => {
  const radius = 170; // px
  const iconSize = 54; // px
  const center = radius + iconSize / 2;
  const [pos, setPos] = useState({ x: 50, y: 50 });

  // Move to a new random position every 5 seconds
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPos({
        x: 10 + Math.random() * 80, // percent (10% to 90%)
        y: 10 + Math.random() * 80, // percent (10% to 90%)
      });
    }, 5000);
    return () => clearInterval(moveInterval);
  }, []);

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: `${2 * (radius + iconSize)}px`,
        height: `${2 * (radius + iconSize)}px`,
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        pointerEvents: 'none',
      }}
      animate={{ rotate: 360, left: `${pos.x}%`, top: `${pos.y}%` }}
      transition={{ repeat: Infinity, duration: 36, ease: 'linear', left: { duration: 2 }, top: { duration: 2 } }}
    >
      {techIcons.map((tech, i) => {
        const angle = (2 * Math.PI * i) / techIcons.length;
        const x = center + radius * Math.cos(angle) - iconSize / 2;
        const y = center + radius * Math.sin(angle) - iconSize / 2;
        const Icon = tech.icon;
        return (
          <span
            key={tech.label}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              color: tech.color,
              fontSize: `${iconSize}px`,
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              padding: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${tech.color}`,
              transition: 'transform 0.2s',
            }}
            aria-label={tech.label}
          >
            <Icon />
          </span>
        );
      })}
    </motion.div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const { skills } = useSelector((state) => state.skills || { skills: [] });
  const { projects } = useSelector((state) => state.projects || { projects: [] });
  const { videos } = useSelector((state) => state.youtube || { videos: [] });
  const { posts = [] } = useSelector((state) => state.posts || { posts: [] });

  const bgGradient = useColorModeValue(
    "linear(to-r, blue.100, purple.100)",
    "linear(to-r, blue.900, purple.900)"
  );
  const textColor = useColorModeValue("gray.800", "white");
  const buttonColorScheme = useColorModeValue("purple", "blue");

  useEffect(() => {
    dispatch(getSkills());
    dispatch(getFeaturedProjects());
    dispatch(getFeaturedVideos());
    dispatch(getPosts());
  }, [dispatch]);

  // Group skills by category
  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {}) || {};

  const backgroundVariants = {
    animate: {
      background: [
        "radial-gradient(circle at 0% 0%, rgba(0,0,255,0.1) 0%, transparent 50%)",
        "radial-gradient(circle at 100% 100%, rgba(128,0,128,0.1) 0%, transparent 50%)",
        "radial-gradient(circle at 50% 50%, rgba(75,0,130,0.1) 0%, transparent 50%)",
      ],
      transition: {
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const codeAnimation = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0, 1, 1, 0],
      scale: [0.8, 1, 1, 0.8],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  // --- Animated SVG Shapes ---
  const animatedShapes = [
    {
      type: 'triangle',
      initial: { x: -60, y: 30, rotate: 0, scale: 1 },
      animate: { x: [0, 60, -30, 0], y: [0, -40, 60, 0], rotate: [0, 120, 240, 360], scale: [1, 1.2, 0.8, 1] },
      style: { position: 'absolute', top: '10%', left: '5%', zIndex: 1 },
      color: '#B794F4',
      size: 48,
      duration: 18,
      delay: 0
    },
    {
      type: 'square',
      initial: { x: 0, y: 0, rotate: 0, scale: 1 },
      animate: { x: [0, -80, 40, 0], y: [0, 60, -50, 0], rotate: [0, 90, 180, 360], scale: [1, 1.15, 0.85, 1] },
      style: { position: 'absolute', top: '45%', left: '80%', zIndex: 1 },
      color: '#63B3ED',
      size: 38,
      duration: 16,
      delay: 1
    },
    {
      type: 'star',
      initial: { x: 0, y: 0, rotate: 0, scale: 1 },
      animate: { x: [0, 70, -60, 0], y: [0, -30, 50, 0], rotate: [0, 180, 360, 0], scale: [1, 1.25, 0.9, 1] },
      style: { position: 'absolute', top: '75%', left: '12%', zIndex: 1 },
      color: '#F6E05E',
      size: 42,
      duration: 20,
      delay: 0.5
    },
    {
      type: 'bubble',
      initial: { x: 0, y: 0, scale: 1 },
      animate: { x: [0, 40, -30, 0], y: [0, -60, 40, 0], scale: [1, 1.3, 0.7, 1] },
      style: { position: 'absolute', top: '60%', left: '60%', zIndex: 1 },
      color: '#68D391',
      size: 60,
      duration: 22,
      delay: 0.8
    },
    {
      type: 'bubble',
      initial: { x: 0, y: 0, scale: 1 },
      animate: { x: [0, -30, 20, 0], y: [0, 40, -50, 0], scale: [1, 1.2, 0.8, 1] },
      style: { position: 'absolute', top: '20%', left: '60%', zIndex: 1 },
      color: '#F687B3',
      size: 32,
      duration: 14,
      delay: 1.2
    },
  ];

  // Helper to render SVG shapes
  const renderShape = ({ type, color, size }) => {
    switch (type) {
      case 'triangle':
        return (
          <polygon points={`${size / 2},0 0,${size} ${size},${size}`} fill={color} />
        );
      case 'square':
        return <rect width={size} height={size} fill={color} rx={size * 0.2} />;
      case 'star':
        return (
          <polygon
            points={
              `${size / 2},0 ${size * 0.6},${size * 0.38} ${size},${size * 0.38} ${size * 0.68},${size * 0.62} ${size * 0.8},${size} ${size / 2},${size * 0.78} ${size * 0.2},${size} ${size * 0.32},${size * 0.62} 0,${size * 0.38} ${size * 0.4},${size * 0.38}`
            }
            fill={color}
          />
        );
      case 'bubble':
      default:
        return <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} fillOpacity={0.23} />;
    }
  };

  // --- END Animated SVG Shapes ---

  return (
    <Box>
      {/* Hero Section */}
      <MotionBox
        minH="calc(100vh - 64px)"
        bgGradient={bgGradient}
        position="relative"
        overflow="hidden"
      >
        <CircleTechIcons />
        <MotionBox
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          variants={backgroundVariants}
          animate="animate"
        />
        {/* Lottie Animations (Modern) */}



        {/* Floating Code Symbols */}
        <MotionBox
          position="absolute"
          variants={codeAnimation}
          initial="initial"
          animate="animate"
          fontSize="6xl"
          color="whiteAlpha.300"
          top="20%"
          left="10%"
        >
          <FaCode />
        </MotionBox>
        <MotionBox
          position="absolute"
          variants={codeAnimation}
          initial="initial"
          animate="animate"
          fontSize="8xl"
          color="whiteAlpha.200"
          bottom="30%"
          right="15%"
        >
          <FaLaptopCode />
        </MotionBox>
        <MotionBox
          position="absolute"
          variants={codeAnimation}
          initial="initial"
          animate="animate"
          fontSize="20rem"
          color="whiteAlpha.100"
          top="60%"
          left="20%"
        >
          <FaLaptopCode />
        </MotionBox>
        <MotionBox
          position="absolute"
          variants={codeAnimation}
          initial="initial"
          animate="animate"
          fontSize="10rem"
          color="whiteAlpha.100"
          bottom="20%"
          right="40%"
        >
          <FaCode />
        </MotionBox>

        {/* --- Animated SVG Shapes --- */}
        {animatedShapes.map((shape, idx) => (
          <MotionSvg
            key={idx}
            width={shape.size}
            height={shape.size}
            style={shape.style}
            initial={shape.initial}
            animate={shape.animate}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              repeatType: "loop",
              delay: shape.delay,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.3, rotate: 25 }}
            whileTap={{ scale: 0.9, rotate: -20 }}
          >
            {renderShape(shape)}
            {/* Optional: add filter for glow/blur */}
            {shape.type === 'bubble' && (
              <filter id={`blur${idx}`}>
                <feGaussianBlur stdDeviation="4" />
              </filter>
            )}
          </MotionSvg>
        ))}
        {/* --- END Animated SVG Shapes --- */}

        <Container maxW="container.xl" position="relative">
          <Stack
            spacing={8}
            alignItems="center"
            textAlign="center"
            py={{ base: 20, md: 36 }}
          >
            <MotionBox
            >
              <Text fontSize="xl" color={textColor} mb={8}>
                I'm a Full Stack Developer specializing in
                <Box as="span" color="blue.500" ml={2}>
                  <Typewriter
                    options={{
                      strings: [
                        "React",
                        "Node.js",
                        "MongoDB",
                        "Express",
                        "TypeScript",
                      ],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                </Box>
              </Text>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                <Button
                  as={Link}
                  to="/projects"
                  size="lg"
                  colorScheme={buttonColorScheme}
                >
                  View Projects
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  size="lg"
                  variant="outline"
                  colorScheme={buttonColorScheme}
                >
                  Contact Me
                </Button>
              </Stack>
            </MotionBox>
          </Stack>
        </Container>
      </MotionBox>

      {/* Skills Section */}
      <Box bg="white" py={16}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={2} textAlign="center" color="#231942" fontWeight={900} letterSpacing={-1}>
            SKILLS
          </Heading>
          <Text color="gray.500" mb={10} textAlign="center" fontSize="lg">
            My technical expertise and proficiency
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <Box
                key={category}
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                borderWidth="1px"
                borderColor="gray.200"
                overflow="hidden"
                p={6}
                minH="220px"
              >
                <Heading fontSize="lg" color="#231942" fontWeight={700} mb={3}>
                  {category}
                </Heading>
                <VStack align="start" spacing={4} width="100%">
                  {skills.map((skill) => (
                    <Box key={skill._id} width="100%">
                      <HStack justify="space-between" mb={1}>
                        <Text fontWeight={600} color="#231942">{skill.name}</Text>
                        <Text fontWeight={600} color="purple.500">{skill.proficiency}%</Text>
                      </HStack>
                      <Progress
                        value={skill.proficiency}
                        colorScheme="purple"
                        size="sm"
                        rounded="full"
                        bg="purple.50"
                      />
                    </Box>
                  ))}
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Projects (Brands) Section */}
      <Box bg="white" py={16}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={2} textAlign="center" color="#231942" fontWeight={900} letterSpacing={-1}>
            PROJECTS (BRANDS)
          </Heading>
          <Text color="gray.500" mb={10} textAlign="center" fontSize="lg">
            A selection of my recent work and professional collaborations
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {projects?.slice(0, 3).map((project) => (
              <Box
                key={project._id}
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                borderWidth="1px"
                borderColor="gray.200"
                overflow="hidden"
                display="flex"
                flexDirection="column"
                minH="360px"
              >
                <Image
                  src={project.image || "/project-placeholder.jpg"}
                  alt={project.title}
                  h={"180px"}
                  w="100%"
                  objectFit="cover"
                />
                <Box p={6} flex={1} display="flex" flexDirection="column" justifyContent="space-between">
                  <Box>
                    <Heading fontSize="lg" color="#231942" fontWeight={700} mb={1}>
                      {project.title}
                    </Heading>
                    <Text color="gray.600" fontSize="md" mb={3}>{project.description}</Text>
                    <Stack direction="row" spacing={2} mb={3}>
                      {(project.tags || []).map((tag) => (
                        <Tag key={tag} colorScheme="gray" fontWeight="bold">{tag}</Tag>
                      ))}
                    </Stack>
                  </Box>
                  <Button
                    as={Link}
                    to={project.demoLink || "#"}
                    colorScheme="gray"
                    variant="outline"
                    leftIcon={<FaExternalLinkAlt />}
                    fontWeight={700}
                    size="sm"
                    mt={2}
                    alignSelf="flex-start"
                  >
                    View Project
                  </Button>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* My YouTube Videos Section */}
      <Box bgGradient="linear(to-br, #4317b7 0%, #7f53ac 100%)" py={16}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={2} textAlign="center" color="white" fontWeight={900} letterSpacing={-1}>
            MY YOUTUBE VIDEOS
          </Heading>
          <Text color="whiteAlpha.800" mb={10} textAlign="center" fontSize="lg">
            Check out my latest tutorials and tech discussions
          </Text>
          <Box px={{ base: 0, md: 10 }}>
  <SliderSection
    items={videos || []}
    slidesToShow={3}
    renderItem={(video) => (
      <VideoCard
        key={video._id}
        title={video.title}
        description={video.description}
        videoId={video.videoId}
        category={video.category}
      />
    )}
  />
</Box>
          <Box textAlign="center" mt={2}>
            <Button
              as={ChakraLink}
              href="https://youtube.com"
              isExternal
              size="lg"
              colorScheme="whiteAlpha"
              variant="outline"
              fontWeight={700}
              px={8}
              rightIcon={<FaYoutube />}
              _hover={{ bg: 'whiteAlpha.300' }}
            >
              Visit My Channel
            </Button>
          </Box>
        </Container>
      </Box>

      {/* BLOGS Section */}
      <Box bg="white" py={16}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={10} textAlign="center" color="#231942" fontWeight={900} letterSpacing={-1}>
            BLOGS
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {(posts || []).slice(0, 3).map((post, idx) => {
              const gradients = [
                'linear(to-br, #a18cd1 0%, #fbc2eb 100%)', // purple-pink
                'linear(to-br, #f7971e 0%, #ffd200 100%)', // orange-yellow
                'linear(to-br, #43cea2 0%, #185a9d 100%)', // teal-blue
              ];
              return (
                <Box
                  key={post._id}
                  bgGradient={gradients[idx % gradients.length]}
                  borderRadius="xl"
                  boxShadow="xl"
                  overflow="hidden"
                  display="flex"
                  flexDirection="column"
                  minH="320px"
                  transition="transform 0.18s, box-shadow 0.18s"
                  _hover={{
                    transform: 'translateY(-6px) scale(1.025)',
                    boxShadow: '2xl',
                  }}
                >
                  <Box className="image-container">
                    <Image
                      src={post.image ? `${process.env.REACT_APP_BACKEND_URL}${post.image}` : "/post-placeholder.jpg"}
                      alt={post.title}
                    />
                  </Box>
                  <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between" p={6} pt={4}>
                    <Box>
                      <Heading fontSize="lg" color="white" fontWeight={700} mb={2}>
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
                        as={Link}
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
              );
            })}
          </SimpleGrid>
        </Container>
      </Box>


    </Box>
  );
};

const VideoCard = ({ title, description, videoId, category }) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      rounded="2xl"
      boxShadow="lg"
      borderWidth="1.5px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        boxShadow: '2xl',
        transform: 'translateY(-8px)',
        borderColor: useColorModeValue('blue.400', 'blue.300'),
      }}
      mb={6}
    >
      <AspectRatio ratio={16 / 9}>
        <iframe
          title={title}
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
        />
      </AspectRatio>
      <Box p={6} pt={4}>
        <VStack align="start" spacing={3}>
          <Heading size="md">{title}</Heading>
          <Text color={useColorModeValue("gray.600", "gray.400")}>
            {description}
          </Text>
          <Tag colorScheme="blue">{category}</Tag>
        </VStack>
      </Box>
    </Box>
  );
};

export default Home;
