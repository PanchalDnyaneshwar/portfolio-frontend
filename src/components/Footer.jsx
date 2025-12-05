import React from 'react'
import { FaEnvelope, FaGithub, FaLinkedin, FaMapMarkedAlt, FaPhone } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-dark-300 py-8">
      <div className="container mx-auto px-6">

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 max-w-6xl mx-auto">

          {/* Contact Section */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-white">Contact</h3>

            {/* Location */}
            <div className="flex items-start space-x-3">
              <span className="text-purple text-2xl"><FaMapMarkedAlt /></span>
              <div>
                <p className="text-gray-300 font-semibold">Location</p>
                <p className="text-gray-400 text-sm">Pune, Karve Nagar</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-3">
              <span className="text-purple text-2xl"><FaEnvelope /></span>
              <div>
                <p className="text-gray-300 font-semibold">Email</p>
                <p className="text-gray-400 text-sm">panchaldnyaneshwar.m@gmail.com</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-3">
              <span className="text-purple text-2xl"><FaPhone /></span>
              <div>
                <p className="text-gray-300 font-semibold">Phone</p>
                <p className="text-gray-400 text-sm">+91 7743918312</p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-white">About Me</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Full Stack Developer crafting clean UI/UX, scalable backend systems,
              and modern digital experiences using JavaScript, React, Node.js, and Express.
            </p>
            <p className="text-gray-400 italic text-sm">
              “Turning ideas into beautiful code.”
            </p>
          </div>

          {/* Social Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Follow Me</h3>

            <div className="flex space-x-4">

              {/* GitHub */}
              <a
                href="https://github.com/PanchalDnyaneshwar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-dark-200 flex items-center justify-center 
                           text-purple hover:bg-purple hover:text-white transition-all duration-300 
                           hover:scale-110"
              >
                <FaGithub size={22} />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/dnyanupanchal77/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-dark-200 flex items-center justify-center 
                           text-purple hover:bg-purple hover:text-white transition-all duration-300
                           hover:scale-110"
              >
                <FaLinkedin size={22} />
              </a>
            </div>
                <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Dnyaneshwar Panchal — All Rights Reserved.
              </p>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
