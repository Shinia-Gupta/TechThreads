import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home";
import About from "./pages/AboutPage";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import Footer from "./components/FooterComp";
import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./pages/CreatePost";
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route element={<PrivateRoute isAdmin={false}/>}>
            <Route path="/dashboard" element={<Dashboard isAdmin={false} />} />
          </Route>
          <Route element={<PrivateRoute isAdmin={true}/>}>
            <Route path="/create-post" element={<CreatePost />} />
          </Route>


          <Route path="/projects" element={<Projects />} />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="dark"
          transition={Slide}
          />   
        <Footer />
      </BrowserRouter>
    
    </>
  );
}

export default App;
