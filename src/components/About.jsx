import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { aboutInfo as localAboutInfo, assets } from '../assets/assets';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function About() {
    const [aboutData, setAboutData] = useState([]);

    // Fetch backend data
    useEffect(() => {
        const fetchAbout = async () => {
            if (!API_URL) {
                console.warn("VITE_BACKEND_URL is not set. Using local data.");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/api/about`);
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                if (data.success) {
                    setAboutData(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch about info:", err);
            }
        };

        fetchAbout();
    }, []);

    // If backend not loaded yet → fallback to local data
    const mergedAboutInfo = aboutData.length > 0
        ? aboutData.map((item, index) => ({
            ...item,
            icon: localAboutInfo[index]?.icon || localAboutInfo[0].icon // fallback icon safe
        }))
        : localAboutInfo;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            id='about'
            className='py-20 bg-dark-300'
        >
            <div className='container mx-0 px-6'>

                {/* Heading */}
                <h2 className='text-3xl font-bold text-center mb-2'>
                    About <span className='text-purple'> Me</span>
                </h2>
                <p className='font-semibold text-center text-gray-400 mb-16 max-w-2xl mx-auto'>
                    Get to know more about my background and passion
                </p>

                {/* Image + My Journey */}
                <div className='flex flex-col md:flex-row items-center gap-12'>

                    {/* image */}
                    <div className='md:w-1/2 rounded-3xl overflow-hidden'>
                        <motion.img
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                            viewport={{ once: false, amount: 0.2 }}
                            className='w-full h-full object-cover'
                            src={assets.profileImg}
                            alt="about-image"
                        />
                    </div>

                    {/* text */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        viewport={{ once: false, amount: 0.2 }}
                        className='md:w-1/2'
                    >
                        <div className='rounded-2xl p-8 '>
                            <h3 className='text-3xl font-semibold  text-center mb-6'>My Journey</h3>

                            <p className='text-gray-300 mb-6'>
                                I began my career as a Web Developer Intern at Jijai Technologies, where I built
                                responsive interfaces and supported backend integrations. This experience strengthened
                                my foundation in modern web development and best practices.
                            </p>

                            <p className='text-gray-300 mb-12'>
                                I currently work as a Software Developer at Infoprosys Technologies Pvt. Ltd.,
                                contributing to scalable full-stack solutions using React, Node.js, Nest.js, and MySQL.
                                I focus on writing clean, efficient code and delivering reliable features for
                                production-ready applications..
                            </p>


                            {/* Cards */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {mergedAboutInfo.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={index}
                                            className='bg-dark-400 rounded-2xl p-6 transition-transform 
                                            duration-300 hover:translate-y-2 cursor-pointer'
                                        >
                                            <div className='text-purple text-4xl mb-4'>
                                                <Icon />
                                            </div>

                                            <h3 className='text-semibold mb-3 text-lg'>
                                                {item.title}
                                            </h3>

                                            <p className='text-gray-400'>
                                                {item.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default About;
