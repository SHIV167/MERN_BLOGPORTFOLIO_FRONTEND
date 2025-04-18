import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateProject } from "../features/projects/projectsSlice";
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
  Tag,
  TagLabel,
  TagCloseButton,
  Spinner,
} from "@chakra-ui/react";

function EditProject() {
  const { id } = useParams();
  const { projects } = useSelector((state) => state.projects);
  const projectFromRedux = projects.find((p) => p._id === id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    tags: [],
    demoLink: "",
    githubLink: "",
    featured: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(projectFromRedux || null);

  const { title, description, image, tags, demoLink, githubLink, featured } =
    formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!projectFromRedux && id) {
      setLoading(true);
      fetch(`/api/projects/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((data) => {
          setProject(data);
          setFormData({
            title: data.title || "",
            description: data.description || "",
            image: data.image || "",
            tags: data.tags || [],
            demoLink: data.demoLink || "",
            githubLink: data.githubLink || "",
            featured: data.featured || false,
          });
        })
        .catch(() => setProject(null))
        .finally(() => setLoading(false));
    } else if (projectFromRedux) {
      setProject(projectFromRedux);
      setFormData({
        title: projectFromRedux.title,
        description: projectFromRedux.description,
        image: projectFromRedux.image,
        tags: projectFromRedux.tags,
        demoLink: projectFromRedux.demoLink,
        githubLink: projectFromRedux.githubLink,
        featured: projectFromRedux.featured,
      });
    }
  }, [projectFromRedux, id]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setFormData((prevState) => ({
          ...prevState,
          tags: [...prevState.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(updateProject({ id, projectData: formData }))
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "Project updated successfully",
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

  if (loading) {
    return (
      <Container maxW={"7xl"} py={12}>
        <Heading>Loading...</Heading>
        <Spinner />
      </Container>
    );
  }
  if (!project) {
    return (
      <Container maxW={"7xl"} py={12}>
        <Heading>Project not found</Heading>
      </Container>
    );
  }

  return (
    <Container maxW={"7xl"} py={12}>
      <Box>
        <Heading mb={6}>Edit Project</Heading>
        <form onSubmit={onSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                placeholder="Enter project title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Enter project description"
                size="sm"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Image URL</FormLabel>
              <Input
                type="text"
                name="image"
                value={image}
                onChange={onChange}
                placeholder="Enter image URL"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Tags</FormLabel>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Type a tag and press Enter"
              />
              <Box mt={2}>
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    size="md"
                    borderRadius="full"
                    variant="solid"
                    colorScheme="blue"
                    m={1}>
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => removeTag(tag)} />
                  </Tag>
                ))}
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel>Demo Link</FormLabel>
              <Input
                type="text"
                name="demoLink"
                value={demoLink}
                onChange={onChange}
                placeholder="Enter demo URL"
              />
            </FormControl>

            <FormControl>
              <FormLabel>GitHub Link</FormLabel>
              <Input
                type="text"
                name="githubLink"
                value={githubLink}
                onChange={onChange}
                placeholder="Enter GitHub repository URL"
              />
            </FormControl>

            <FormControl>
              <HStack>
                <FormLabel mb="0">Featured Project</FormLabel>
                <Switch
                  name="featured"
                  isChecked={featured}
                  onChange={onChange}
                />
              </HStack>
            </FormControl>

            <Button type="submit" colorScheme="blue">
              Update Project
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
}

export default EditProject;
