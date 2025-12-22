import React from 'react';
import { motion } from 'framer-motion';
import { FaClipboardList, FaUserCheck, FaChartLine, FaShieldAlt, FaMobileAlt, FaBell } from 'react-icons/fa';
import Container from '../../../container/Container';

const Features = () => {
    const features = [
        {
            icon: FaClipboardList,
            title: 'Easy Issue Reporting',
            description: 'Report infrastructure issues quickly with photos and location details. Simple form, powerful impact.',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            icon: FaUserCheck,
            title: 'Real-time Tracking',
            description: 'Track your reported issues from submission to resolution. Get updates at every stage.',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            icon: FaChartLine,
            title: 'Transparency & Analytics',
            description: 'View statistics and analytics on city infrastructure. See what\'s being fixed and when.',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            icon: FaShieldAlt,
            title: 'Priority Support',
            description: 'Premium users get priority handling. Boost your issue for faster resolution.',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
        {
            icon: FaMobileAlt,
            title: 'Mobile Friendly',
            description: 'Report issues on the go. Our responsive design works perfectly on all devices.',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100',
        },
        {
            icon: FaBell,
            title: 'Instant Notifications',
            description: 'Get notified when your issue status changes. Stay informed every step of the way.',
            color: 'text-red-600',
            bgColor: 'bg-red-100',
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose CityCare?</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        We make it easy for citizens to report issues and for authorities to resolve them efficiently.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className={`${feature.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                                <feature.icon className={`${feature.color} text-2xl`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Features;








