import React, { useState } from 'react';
import { motion } from 'framer-motion';

function Contact() {
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");

        // Basic validation
        if (!form.name || !form.email || !form.message) {
            setErrorMsg("Please fill all fields.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (data.success) {
                setSuccessMsg("Message sent successfully! 🎉");
                setForm({ name: "", email: "",subject: "", message: "" });
            } else {
                setErrorMsg(data.message || "Something went wrong.");
            }
        } catch (err) {
            setErrorMsg("Server error. Try again later.");
        }

        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            id="contact"
            className="py-20 bg-dark-200"
        >
            <div className="container mx-auto px-6">

                {/* Heading */}
                <h2 className="text-3xl font-bold text-center mb-4">
                    Get In <span className="text-purple">Touch</span>
                </h2>
                <p className="text-gray-300 text-center max-w-2xl mx-auto mb-16">
                    Have a project in mind or want to collaborate? Let's talk!
                </p>

                {/* Centered Form Wrapper */}
                <div className="flex justify-center">
                    <div className="max-w-xl w-full">

                        {/* SUCCESS MESSAGE */}
                        {successMsg && (
                            <p className="text-green-400 mb-4 text-center">{successMsg}</p>
                        )}

                        {/* ERROR MESSAGE */}
                        {errorMsg && (
                            <p className="text-red-400 mb-4 text-center">{errorMsg}</p>
                        )}

                        {/* Contact Form */}
                        <form className="space-y-6" onSubmit={handleSubmit}>

                            <div>
                                <label className="block text-gray-300 mb-2 px-1">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 px-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg outline-none"
                                />
                            </div>
                            
                                 <div>
                                <label className="block text-gray-300 mb-2 px-1">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 px-1">Message</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    className="w-full h-40 px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg outline-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 font-medium bg-purple rounded-lg hover:bg-purple-700 transition duration-300 disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Send"}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Contact;
