import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { workData as localWorkData } from '../assets/assets';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Work() {
    const [workData, setWorkData] = useState([]);

    // Fetch backend work experience
    useEffect(() => {
        const fetchWork = async () => {
            try {
                const res = await fetch(`${API_URL}/api/work`);
                const data = await res.json();
                if (data.success) {
                    setWorkData(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch work experience:", err);
            }
        };

        fetchWork();
    }, []);

    // Safety fallback until backend loads
    const finalWorkData = workData.length ? workData : localWorkData;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            id="experience"
            className="py-20 bg-dark-300"
        >
            <div className="container mx-auto px-6">
                <h2 className="font-bold text-3xl text-center mb-4">
                    Work <span className="text-purple">Experience</span>
                </h2>

                <p className="text-center text-gray-400 max-w-2xl mx-auto mb-16">
                    My professional journey so far
                </p>

                <div className="max-w-3xl mx-auto">
                    <div className="space-y-12">

                        {finalWorkData.map((work, index) => (
                            <div
                                key={index}
                                className="
                                    relative pl-12
                                    before:content-[''] before:absolute before:left-3 before:top-0
                                    before:w-0.5 before:h-full before:bg-purple
                                    hover:-translate-y-2 transition-all duration-300
                                "
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-purple"></div>

                                {/* Content Box */}
                                <div className="bg-dark-300 border border-purple/40 rounded-2xl p-6 shadow-md">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-semibold">
                                            {work.role}
                                        </h3>

                                        <span className="px-3 py-1 bg-purple/20 text-purple rounded-full text-xs md:text-sm">
                                            {work.duration}
                                        </span>
                                    </div>

                                    <p className="text-gray-400 mb-2">{work.company}</p>

                                    <p className="text-gray-300">{work.description}</p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Work;
