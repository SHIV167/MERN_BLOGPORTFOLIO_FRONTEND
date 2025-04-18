import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateSkill } from "../features/skills/skillsSlice";
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";

function EditSkill() {
  const { id } = useParams();
  const { skills } = useSelector((state) => state.skills);
  const skill = skills.find((s) => s._id === id);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    proficiency: 50,
    icon: "",
    description: "",
  });

  const { name, category, proficiency, icon, description } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        icon: skill.icon,
        description: skill.description,
      });
    }
  }, [skill]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(updateSkill({ id, skillData: formData }))
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "Skill updated successfully",
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

  if (!skill) {
    return (
      <Container maxW={"7xl"} py={12}>
        <Heading>Skill not found</Heading>
      </Container>
    );
  }

  return (
    <Container maxW={"7xl"} py={12}>
      <Box>
        <Heading mb={6}>Edit Skill</Heading>
        <form onSubmit={onSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter skill name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                name="category"
                value={category}
                onChange={onChange}
                placeholder="Select category">
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Proficiency ({proficiency}%)</FormLabel>
              <Slider
                name="proficiency"
                value={proficiency}
                onChange={(value) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    proficiency: value,
                  }))
                }
                min={1}
                max={100}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>

            <FormControl>
              <FormLabel>Icon URL</FormLabel>
              <Input
                type="text"
                name="icon"
                value={icon}
                onChange={onChange}
                placeholder="Enter icon URL"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Enter description"
              />
            </FormControl>

            <Button type="submit" colorScheme="blue">
              Update Skill
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
}

export default EditSkill;
