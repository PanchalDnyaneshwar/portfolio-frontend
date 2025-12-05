import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import AdminLogin from "./pages/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminProjects from "./pages/admin/AdminProjects.jsx";
import AdminSkills from "./pages/admin/AdminSkills.jsx";
import AdminAbout from "./pages/admin/AdminAbout.jsx";
import AdminWork from "./pages/admin/AdminWork.jsx";
import AdminContacts from "./pages/admin/AdminContacts.jsx";

function App() {
  const location = useLocation();

  // HIDE Navbar & Footer for all /admin routes
  const hideNavbarFooter = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ADMIN ROUTES WITHOUT NAVBAR/FOOTER */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<div />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="work" element={<AdminWork />} />
          <Route path="contacts" element={<AdminContacts />} />
        </Route>
      </Routes>

      {!hideNavbarFooter && <Footer />}
    </>
  );
}

export default App;
