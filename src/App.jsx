import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChakraProvider,
  Box,
  Input,
  Button,
  Heading,
  Text,
  List,
  ListItem,
  IconButton,
  Flex,
  Stack,
  useToast,
  extendTheme,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion"; // Import motion

// Custom theme definition
const theme = extendTheme({
  colors: {
    brand: {
      50: "#e9f5f5",
      100: "#c1e4e4",
      200: "#99d4d4",
      300: "#71c4c4",
      400: "#49b3b3",
      500: "#21a2a2", // Primary color
      600: "#1b8282",
      700: "#156161",
      800: "#0f4040",
      900: "#082020",
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "md",
      },
      sizes: {
        lg: {
          h: "50px",
          fontSize: "lg",
          px: "32px",
        },
      },
      variants: {
        solid: {
          bg: "brand.500",
          _hover: {
            bg: "brand.600",
          },
          _active: {
            bg: "brand.700",
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderColor: "gray.300",
          _hover: {
            borderColor: "brand.500",
          },
          _focus: {
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px #21a2a2",
          },
        },
      },
    },
  },
});

const App = () => {
  const API_URL = "https://mongo-db-lac-eight.vercel.app/api/posts";
  const toast = useToast();

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editPostId, setEditPostId] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
      console.log(response);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  const createPost = async () => {
    try {
      const response = await axios.post(API_URL, {
        course: newPost,
        description: newDescription,
      });
      setPosts([...posts, response.data]);
      setNewPost("");
      setNewDescription("");

      // Show success toast
      toast({
        title: "Post Created.",
        description: "Your new post has been added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log("Error creating post", error);
    }
  };

  const updatePost = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        course: newPost,
        description: newDescription,
      });
      setPosts(posts.map((post) => (post._id === id ? response.data : post)));
      setNewPost("");
      setNewDescription("");
      setEditPostId(null);

      // Show success toast
      toast({
        title: "Post Updated.",
        description: "Your post has been successfully updated.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error editing post", error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter((post) => post._id !== id));

      // Show success toast
      toast({
        title: "Post Deleted.",
        description: "The post has been removed.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box maxW="500px" mx="auto" mt={10} p={5} shadow="md" borderWidth="1px">
        <Heading mb={4} textAlign="center" color="brand.500">
          Posts
        </Heading>
        <Stack spacing={3}>
          <Input
            placeholder="Enter course"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            mb={2}
            _hover={{ borderColor: "brand.500" }}
            transition="all 0.3s"
          />
          <Input
            placeholder="Enter description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            mb={4}
            _hover={{ borderColor: "brand.500" }}
            transition="all 0.3s"
          />
          <Button
            colorScheme="brand"
            onClick={editPostId ? () => updatePost(editPostId) : createPost}
            _hover={{ transform: "scale(1.05)" }}
            transition="transform 0.2s"
          >
            {editPostId ? "Edit Post" : "Create Post"}
          </Button>
        </Stack>

        <motion.div
          style={{ overflowY: "auto", maxHeight: "400px" }} // Scrollable container
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <List spacing={3} mt={6}>
            {posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5 },
                }}
                viewport={{ once: false }}
                transition={{ duration: 0.3 }}
              >
                <ListItem
                  p={3}
                  shadow="sm"
                  borderWidth="1px"
                  borderRadius="md"
                  mb={2}
                  transition="background-color 0.3s, transform 0.2s"
                  _hover={{
                    backgroundColor: "gray.100",
                    transform: "scale(1.02)",
                  }}
                >
                  <Flex align="center" justify="space-between">
                    <Box>
                      <Text fontWeight="bold" color="brand.500">
                        {post.course}
                      </Text>
                      <Text>{post.description}</Text>
                    </Box>
                    <Box>
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="yellow"
                        mr={2}
                        onClick={() => {
                          setEditPostId(post._id);
                          setNewPost(post.course);
                          setNewDescription(post.description);
                        }}
                        aria-label="Edit post"
                        _hover={{
                          backgroundColor: "yellow.200",
                          transform: "scale(1.1)",
                        }}
                        transition="all 0.2s"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => deletePost(post._id)}
                        aria-label="Delete post"
                        _hover={{
                          backgroundColor: "red.300",
                          transform: "scale(1.1)",
                        }}
                        transition="all 0.2s"
                      />
                    </Box>
                  </Flex>
                </ListItem>
              </motion.div>
            ))}
          </List>
        </motion.div>
      </Box>
    </ChakraProvider>
  );
};

export default App;
