import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateVideo } from "../features/youtube/youtubeSlice";
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  Switch,
  HStack,
  Select,
} from "@chakra-ui/react";

function EditVideo() {
  const { id } = useParams();
  const { videos } = useSelector((state) => state.youtube);
  const video = videos.find((v) => v._id === id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoId: "",
    category: "",
    featured: false,
  });

  const { title, description, videoId, category, featured } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title,
        description: video.description,
        videoId: video.videoId,
        category: video.category,
        featured: video.featured,
      });
    }
  }, [video]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(updateVideo({ id, videoData: formData }))
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "Video updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/dashboard");
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  if (!video) {
    return (
      <Container maxW={"7xl"} py={12}>
        <Heading>Video not found</Heading>
      </Container>
    );
  }

  return (
    <Container maxW={"7xl"} py={12}>
      <Box>
        <Heading mb={6}>Edit YouTube Video</Heading>
        <form onSubmit={onSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                placeholder="Enter video title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Enter video description"
                size="sm"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>YouTube Video ID</FormLabel>
              <Input
                type="text"
                name="videoId"
                value={videoId}
                onChange={onChange}
                placeholder="Enter YouTube video ID (e.g., dQw4w9WgXcQ)"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                name="category"
                value={category}
                onChange={onChange}
                placeholder="Select category">
                <option value="Tutorial">Tutorial</option>
                <option value="Vlog">Vlog</option>
                <option value="Review">Review</option>
                <option value="Programming">Programming</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>

            <FormControl>
              <HStack>
                <FormLabel mb="0">Featured Video</FormLabel>
                <Switch
                  name="featured"
                  isChecked={featured}
                  onChange={onChange}
                />
              </HStack>
            </FormControl>

            <Button type="submit" colorScheme="blue">
              Update Video
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
}

export default EditVideo;
