import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import Container from '../../container/Container';

const NotFound = () => {
    return (
        <Container>
            <div className="min-h-screen flex items-center justify-center py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8"
                    >
                        <FaExclamationTriangle className="text-9xl text-yellow-500 mx-auto" />
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-9xl font-bold text-gray-800 mb-4"
                    >
                        404
                    </motion.h1>
                    
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-3xl font-bold text-gray-700 mb-4"
                    >
                        Page Not Found
                    </motion.h2>
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="text-gray-600 text-lg mb-8 max-w-md mx-auto"
                    >
                        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        <Link
                            to="/"
                            className="btn btn-primary btn-lg inline-flex items-center gap-2"
                        >
                            <FaHome />
                            Back to Home
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </Container>
    );
};

export default NotFound;






