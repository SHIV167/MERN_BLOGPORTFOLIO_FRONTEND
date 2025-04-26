import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPost } from "../features/posts/postsSlice";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Tag,
  useColorModeValue,
} from "@chakra-ui/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";

const cld = new Cloudinary({ cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME } });

function PostDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { post, isLoading } = useSelector((state) => state.posts);
  const headingColor = useColorModeValue("gray.700", "white");
  const textColor = useColorModeValue("gray.700", "gray.200");

  useEffect(() => {
    dispatch(getPost(slug));
  }, [dispatch, slug]);

  if (isLoading || !post) {
    return (
      <Container maxW={"7xl"} py={12}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  const imgSrc = post.image.startsWith('http') ? post.image : `${process.env.REACT_APP_BACKEND_URL}${post.image}`;
  // derive public ID with folder for Cloudinary
  const filename = imgSrc.split('/').pop().split('.')[0];
  const publicId = `mern_blog_uploads/${filename}`;
  const cldImg = cld.image(publicId).format('avif');

  return (
    <Container maxW={"7xl"} py={12}>
      <Box>
        {post.image && (
          <Box
            h={"400px"}
            w={"100%"}
            mb={6}
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
          >
            <AdvancedImage
              cldImg={cldImg}
              alt={post.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        )}
        <Stack spacing={4}>
          <Text
            color={"green.500"}
            textTransform={"uppercase"}
            fontWeight={800}
            fontSize={"sm"}
            letterSpacing={1.1}>
            {post.category}
          </Text>
          <Heading color={headingColor} fontSize={"4xl"} fontFamily={"body"}>
            {post.title}
          </Heading>
          <Stack direction={"row"} spacing={2}>
            {post.tags.map((tag) => (
              <Tag key={tag} colorScheme="blue">
                {tag}
              </Tag>
            ))}
          </Stack>
          <Text
            color={textColor}
            fontSize={"lg"}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <Stack
            direction={"row"}
            spacing={4}
            align={"center"}
            opacity={0.7}
            fontSize={"sm"}>
            <Text fontWeight={600}>{post.author.name}</Text>
            <Text color={"gray.500"}>
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}

export default PostDetail;
