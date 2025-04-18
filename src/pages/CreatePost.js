import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createPost } from "../features/posts/postsSlice";
import ReactQuill from 'react-quill';
import '../components/dashboard/quill.css';


import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";

const quillModules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    handlers: {
      image: function () {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
          const file = input.files[0];
          const formData = new FormData();
          formData.append('image', file);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await res.json();
          const quill = this.quill;
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', data.url);
        };
      }
    }
  }
};



function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    image: null,
  });

  const { title, content, category, tags } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const onChange = (e) => {
    if (e.target.name === "image") {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("category", category);
    postData.append("tags", tags);
    if (formData.image) {
      postData.append("image", formData.image);
    }

    dispatch(createPost(postData))
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "Post created successfully",
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

  return (
    <Container maxW={"7xl"} py={12}>
      <Box>
        <Heading mb={6}>Create New Post</Heading>
        <form onSubmit={onSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={title}
                onChange={onChange}
                placeholder="Enter post title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Content</FormLabel>
              <ReactQuill
                value={content}
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                style={{ minHeight: '200px', background: 'white' }}
                modules={quillModules}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Input
                name="category"
                value={category}
                onChange={onChange}
                placeholder="Enter post category"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <Input
                name="tags"
                value={tags}
                onChange={onChange}
                placeholder="Enter tags, separated by commas"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Image</FormLabel>
              <Input
                type="file"
                name="image"
                onChange={onChange}
                accept="image/*"
                p={1}
              />
            </FormControl>

            <Button mt={4} colorScheme="blue" type="submit" size="lg">
              Create Post
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
}

export default CreatePost;
