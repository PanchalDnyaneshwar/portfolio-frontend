import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from "react-icons/fa";
import { assets } from "../assets/assets";
import Resume from "../assets/resume.pdf";

// Typewriter roles
const roles = ["Full Stack Developer", "MERN Stack Developer"];

export default function Hero() {
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Cursor follow glow
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  // Typewriter Effect
  useEffect(() => {
    const currentRole = roles[roleIndex];

    if (charIndex < currentRole.length) {
      const t = setTimeout(() => {
        setText((prev) => prev + currentRole[charIndex]);
        setCharIndex((i) => i + 1);
      }, 70);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setText("");
        setCharIndex(0);
        setRoleIndex((i) => (i + 1) % roles.length);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [charIndex, roleIndex]);

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center bg-dark-500 pt-28 pb-16 px-6 md:px-14 overflow-hidden"
    >
      {/* ================= CURSOR GLOW FOLLOW ================= */}
        <motion.div
        animate={{ x: cursorPos.x - 80, y: cursorPos.y - 80 }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
        className="pointer-events-none hidden md:block fixed w-40 h-40 rounded-full 
                  bg-purple/10 blur-2xl opacity-40"
        style={{ zIndex: 1 }}
      />

      {/* Background Soft Shapes */}
      <div className="absolute top-24 left-10 w-40 h-40 bg-purple/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-pink/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-20">
        
        {/* ================= LEFT SECTION ================= */}
        <div className="space-y-6 text-center md:text-left">

          {/* Greeting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-purple font-semibold tracking-widest text-sm uppercase"
          >
            Hey, I'm <span className="text-white">Dnyaneshwar Panchal </span>
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight text-white"
          >
            Building <span className="text-purple">Modern Web</span> Experiences
          </motion.h1>

          {/* Typewriter Role */}
          <h2 className="text-lg md:text-xl font-medium text-gray-300 h-8">
            {text}
            <span className="text-purple font-bold">|</span>
          </h2>

          {/* Description */}
          <p className="text-gray-400 max-w-md mx-auto md:mx-0 leading-relaxed">
            I craft modern, scalable web applications with clean architecture,
            strong backend engineering, and elegant UI/UX experiences.
          </p>

          {/* Social Icons */}
          <div className="flex gap-6 justify-center md:justify-start pt-2">
            <a
              href="https://github.com/PanchalDnyaneshwar"
              target="_blank"
              className="text-gray-300 hover:text-purple text-2xl transition hover:scale-110"
            >
              <FaGithub />
            </a>

            <a
              href="https://www.linkedin.com/in/dnyanupanchal77"
              target="_blank"
              className="text-gray-300 hover:text-purple text-2xl transition hover:scale-110"
            >
              <FaLinkedin />
            </a>

            <a
              href="mailto:panchaldnyaneshwar.m@gmail.com"
              className="text-gray-300 hover:text-purple text-2xl transition hover:scale-110"
            >
              <FaEnvelope />
            </a>
          </div>

          {/* Buttons */}
          <div className="flex gap-6 justify-center md:justify-start pt-4">

            {/* Resume Button */}
            <button
              onClick={() => window.open(Resume, "_blank")}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-purple text-white font-medium 
                        shadow-md shadow-purple/40 hover:bg-purple-600 transition"
            >
              <FaFileAlt className="text-lg" />
              Resume
            </button>

            {/* Contact Button */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#contact"
              className="px-7 py-3 rounded-xl border border-purple text-purple font-medium 
                        hover:bg-purple/10 transition"
            >
              Contact Me
            </motion.a>
          </div>

        </div>

        {/* ================= RIGHT SECTION (PROFILE IMAGE) ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >
          {/* Glow Behind Image */}
          <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-purple/20 blur-3xl rounded-full"></div>

          {/* Image Wrapper */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden 
                          border border-purple/30 shadow-xl shadow-purple/20 backdrop-blur-xl">
            <motion.img
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              src={assets.profileImg}
              alt="Profile"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
