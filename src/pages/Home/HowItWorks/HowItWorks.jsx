import React from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaClipboardCheck, FaUserTie, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import Container from '../../../container/Container';

const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            icon: FaUserPlus,
            title: 'Sign Up',
            description: 'Create your account in seconds. Free users can report up to 3 issues, or upgrade to premium for unlimited reporting.',
            color: 'bg-blue-500',
        },
        {
            number: '02',
            icon: FaClipboardCheck,
            title: 'Report Issue',
            description: 'Fill out a simple form with issue details, upload photos, and specify the location. Your report is instantly submitted.',
            color: 'bg-green-500',
        },
        {
            number: '03',
            icon: FaUserTie,
            title: 'Admin Assigns Staff',
            description: 'Administrators review your report and assign it to the appropriate staff member for verification and resolution.',
            color: 'bg-purple-500',
        },
        {
            number: '04',
            icon: FaCheckCircle,
            title: 'Issue Resolved',
            description: 'Track progress in real-time. Once resolved, you\'ll be notified and can verify the fix.',
            color: 'bg-yellow-500',
        },
    ];

    return (
        <section className="py-20 bg-white">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Simple steps to make your city better. From reporting to resolution, we've got you covered.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-green-500 via-purple-500 to-yellow-500"></div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="relative"
                            >
                                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-t-4 border-gray-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                                            {step.number}
                                        </div>
                                        <step.icon className={`${step.color.replace('bg-', 'text-')} text-3xl`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                                
                                {/* Arrow (Desktop) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-24 -right-4 z-10">
                                        <FaArrowRight className="text-gray-400 text-xl" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default HowItWorks;








