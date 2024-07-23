// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import AboutPage from "./pages/AboutPage";
// import Signup from "./pages/Signup";
// import Signin from "./pages/Signin";
// import Dashboard from "./pages/Dashboard";
// import Projects from "./pages/Projects";
// import Header from "./components/Header";
// import Footer from "./components/FooterComp";
// import PrivateRoute from "./components/PrivateRoute";
// import CreatePost from "./pages/CreatePost";
// import UpdatePost from "./pages/UpdatePost";
// import PostDetailPage from "./pages/PostDetailPage";
// import ScrollToTop from "./components/ScrollToTop";
// import SearchResults from "./pages/SearchResults";
// function App() {
//   return (
//     <>
//       <BrowserRouter>
//       <ScrollToTop/>
//         <Header />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/signin" element={<Signin />} />
//           <Route path="/search" element={<SearchResults />} />
//           <Route element={<PrivateRoute isAdmin={true}/>}>
//             <Route path="/dashboard" element={<Dashboard isAdmin={true} />} />
//           </Route>
//           <Route element={<PrivateRoute isAdmin={true}/>}>
//             <Route path="/create-post" element={<CreatePost />} />
//             <Route path="/update-post/:postId" element={<UpdatePost />} />
//           </Route>


//           <Route path="/projects" element={<Projects />} />
//           <Route path="/post/:slug" element={<PostDetailPage/>} />
//         </Routes>
     
//         <Footer />
//       </BrowserRouter>
    
//     </>
//   );
// }

export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import Footer from "./components/FooterComp";
import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostDetailPage from "./pages/PostDetailPage";
import ScrollToTop from "./components/ScrollToTop";
import SearchResults from "./pages/SearchResults";
function App() {
  return (
    <>
      <BrowserRouter>
      <ScrollToTop/>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/search" element={<SearchResults />} />
          <Route element={<PrivateRoute isAdmin={false}/>}>
            <Route path="/dashboard" element={<Dashboard isAdmin={false} />} />
          </Route>
          <Route element={<PrivateRoute isAdmin={true}/>}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>


          <Route path="/projects" element={<Projects />} />
          <Route path="/post/:slug" element={<PostDetailPage/>} />
        </Routes>
     
        <Footer />
      </BrowserRouter>
    
    </>
  );
}

export default App;
