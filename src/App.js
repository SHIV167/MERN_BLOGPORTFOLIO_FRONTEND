import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import GlobalFloatButtons from "./components/GlobalFloatButtons";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BlogPost from "./pages/BlogPost";
import EditPost from "./pages/EditPost";
import CreatePost from "./pages/CreatePost";
import CreateSkill from "./pages/CreateSkill";
import EditSkill from "./pages/EditSkill";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import CreateVideo from "./pages/CreateVideo";
import EditVideo from "./pages/EditVideo";
import Contact from "./pages/Contact";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";
import React from 'react';
import PopupModal from './components/PopupModal';

function App() {
  // PopupModal is rendered globally
  return (
    <ChakraProvider>
      <PopupModal />
      <GlobalFloatButtons />
      <Router>
        <Box minH="100vh" display="flex" flexDirection="column">
          <Routes>
            {/* Admin routes - NO Header/Footer */}
            <Route path="/dashboard/*" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/posts/create" element={<AdminRoute><CreatePost /></AdminRoute>} />
            <Route path="/posts/edit/:id" element={<AdminRoute><EditPost /></AdminRoute>} />
            {/* Optional: Delete post route (if you want a dedicated page) */}
            {/* <Route path="/posts/delete/:id" element={<AdminRoute><DeletePost /></AdminRoute>} /> */}

            <Route path="/skills/create" element={<AdminRoute><CreateSkill /></AdminRoute>} />
            <Route path="/skills/edit/:id" element={<AdminRoute><EditSkill /></AdminRoute>} />
            {/* <Route path="/skills/delete/:id" element={<AdminRoute><DeleteSkill /></AdminRoute>} /> */}

            <Route path="/projects/create" element={<AdminRoute><CreateProject /></AdminRoute>} />
            <Route path="/projects/edit/:id" element={<AdminRoute><EditProject /></AdminRoute>} />
            {/* <Route path="/projects/delete/:id" element={<AdminRoute><DeleteProject /></AdminRoute>} */}

            <Route path="/videos/create" element={<AdminRoute><CreateVideo /></AdminRoute>} />
            <Route path="/videos/edit/:id" element={<AdminRoute><EditVideo /></AdminRoute>} />
            {/* <Route path="/videos/delete/:id" element={<AdminRoute><DeleteVideo /></AdminRoute>} */}

            {/* To enable delete pages, uncomment the above and create the components if not present. */}

            {/* Public/user routes - WITH Header/Footer */}
            <Route path="/" element={<><Header /><Box flex="1"><Home /></Box><Footer /></>} />
            <Route path="/blog" element={<><Header /><Box flex="1"><Blog /></Box><Footer /></>} />
            <Route path="/blog/:slug" element={<><Header /><Box flex="1"><BlogPost /></Box><Footer /></>} />
            <Route path="/login" element={<><Header /><Box flex="1"><Login /></Box><Footer /></>} />
            <Route path="/register" element={<><Header /><Box flex="1"><Register /></Box><Footer /></>} />
            <Route path="/contact" element={<><Header /><Box flex="1"><Contact /></Box><Footer /></>} />
            <Route path="*" element={<><Header /><Box flex="1"><NotFound /></Box><Footer /></>} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
