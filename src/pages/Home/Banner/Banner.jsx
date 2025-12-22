import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaArrowRight, FaClipboardCheck, FaUsers, FaChartLine } from 'react-icons/fa';

const Banner = () => {
    return (
        <div className="relative min-h-[600px] bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                        >
                            Report Issues,<br />
                            <span className="text-yellow-300">Build Better Cities</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl md:text-2xl mb-8 text-blue-100"
                        >
                            Your voice matters. Report public infrastructure issues and help make your city a better place to live.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link
                                to="/all-issues"
                                className="btn btn-lg bg-white text-purple-600 hover:bg-yellow-300 border-0 font-bold px-8"
                            >
                                View All Issues
                                <FaArrowRight className="ml-2" />
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-lg btn-outline text-white border-2 border-white hover:bg-white hover:text-purple-600 font-bold px-8"
                            >
                                Get Started
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {[
                            { icon: FaClipboardCheck, number: "1000+", label: "Issues Resolved", color: "bg-yellow-400" },
                            { icon: FaUsers, number: "500+", label: "Active Citizens", color: "bg-green-400" },
                            { icon: FaChartLine, number: "95%", label: "Satisfaction Rate", color: "bg-blue-400" },
                            { icon: FaClipboardCheck, number: "24/7", label: "Support Available", color: "bg-purple-400" },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                className={`${stat.color} p-6 rounded-lg shadow-xl text-white`}
                            >
                                <stat.icon className="text-3xl mb-3" />
                                <h3 className="text-3xl font-bold mb-1">{stat.number}</h3>
                                <p className="text-sm font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Wave Bottom */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                </svg>
            </div>
        </div>
    );
};

export default Banner;
