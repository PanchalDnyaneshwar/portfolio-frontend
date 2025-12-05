import React from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import About from "../components/About"
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Work from '../components/Work'
import Contact from '../components/Contact'
function Home() {
  return (
    <motion.div>
      <Hero />
      <About/>
      <Skills/>
      <Projects/>
      <Work/>
      <Contact/>
    </motion.div>
  )
}

export default Home