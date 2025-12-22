import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaClipboardCheck, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import Container from '../../container/Container';

const About = () => {
    const features = [
        {
            icon: FaUsers,
            title: 'Community Driven',
            description: 'Built by citizens, for citizens. Your voice matters in shaping our city.',
        },
        {
            icon: FaClipboardCheck,
            title: 'Transparent Process',
            description: 'Track every issue from submission to resolution with complete transparency.',
        },
        {
            icon: FaChartLine,
            title: 'Data-Driven Solutions',
            description: 'Analytics and insights help authorities make informed decisions.',
        },
        {
            icon: FaShieldAlt,
            title: 'Secure & Reliable',
            description: 'Your data is protected with industry-standard security measures.',
        },
    ];

    return (
        <Container>
            <div className="min-h-screen py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl font-bold text-gray-800 mb-6 text-center">About CityCare</h1>
                    <p className="text-xl text-gray-600 mb-12 text-center">
                        Empowering citizens to make their cities better, one issue at a time.
                    </p>

                    <div className="space-y-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white p-8 rounded-lg shadow-md"
                        >
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                            <p className="text-gray-700 leading-relaxed">
                                CityCare is a digital platform designed to bridge the gap between citizens and local government. 
                                We believe that every citizen should have a voice in improving their community's infrastructure. 
                                Our mission is to make reporting public issues simple, transparent, and effective.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white p-8 rounded-lg shadow-md"
                        >
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">What We Do</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                CityCare enables citizens to report infrastructure issues such as:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Broken streetlights and traffic signals</li>
                                <li>Potholes and road damage</li>
                                <li>Water leakage and drainage problems</li>
                                <li>Garbage overflow and waste management issues</li>
                                <li>Damaged footpaths and sidewalks</li>
                                <li>And many more public infrastructure concerns</li>
                            </ul>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {features.map((feature, index) => (
                            <div key={feature.title} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
                                <feature.icon className="text-4xl text-blue-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </Container>
    );
};

export default About;




