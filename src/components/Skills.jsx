import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { skills as localSkills } from '../assets/assets';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Skills() {
  const [skillsData, setSkillsData] = useState([]);

  // Fetch skills from backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${API_URL}/api/skills`);
        const data = await res.json();

        if (data.success) {
          setSkillsData(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };

    fetchSkills();
  }, []);

  // Merge backend data with local icons
  const mergedSkills = skillsData.length
    ? skillsData.map((item, index) => ({
        ...item,
        tags: Array.isArray(item.tags)
          ? item.tags
          : item.tags.split(",").map((t) => t.trim()),

        icon: localSkills[index]?.icon || localSkills[0].icon, // fallback
      }))
    : localSkills; // fallback until backend loads

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}   // FIXED
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.2 }}
      id="skills"
      className="py-20 bg-dark-100"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-4 text-center">
          My <span className="text-purple">Skills</span>
        </h2>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-16">
          Technologies I work with to bring ideas to life.
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-5xl mx-auto">
        {mergedSkills.map((skill, index) => {
          const Icon = skill.icon;

          return (
            <div
              key={index}
              className="bg-dark-300 rounded-2xl p-6 hover:translate-y-2 transition duration-300 cursor-pointer"
            >
              {/* Skill Header */}
              <div className="flex items-center mb-4">
                <Icon className="w-12 h-12 text-purple mr-6" />
                <h3 className="text-xl font-semibold">{skill.title}</h3>
              </div>

              {/* Description */}
              <p className="text-gray-400 mb-4">{skill.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-dark-400 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default Skills;
