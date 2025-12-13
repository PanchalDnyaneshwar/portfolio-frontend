import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projects as localProjects } from '../assets/assets';
import ProjectCard from './ProjectCard';
import { FaArrowRight } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Projects() {
  const [projects, setProjects] = useState([]);

  // Fetch backend data
  useEffect(() => {
    const fetchProjects = async () => {
      if (!API_URL) {
        console.warn("VITE_BACKEND_URL is not set. Using local data.");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/projects`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          // Convert backend CSV tech → array
          const formatted = data.data.map((p) => ({
            ...p,
            tech: Array.isArray(p.tech)
              ? p.tech
              : p.tech?.split(",").map((t) => t.trim()) || [],
          }));

          setProjects(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };

    fetchProjects();
  }, []);

  // If backend still loading → use local temporary data
  const finalProjects = projects.length ? projects : localProjects;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}   // FIXED
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.2 }}
      id="projects"
      className="py-20 bg-dark-400"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4">
          My <span className="text-purple">Projects</span>
        </h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
          A section of my recent work
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {finalProjects.map((project, index) => (
            <ProjectCard 
              key={project.id || index} 
              title={project.title}
              description={project.description}
              image={project.image}
              tech={project.tech}
              demo={project.demo}
              code={project.code}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 border border-purple rounded-lg
                       font-medium hover:bg-purple/20 transition duration-300"
          >
            <span>View more projects</span>
            <FaArrowRight className="ml-2" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default Projects;
