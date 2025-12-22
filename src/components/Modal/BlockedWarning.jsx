import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaPhone } from 'react-icons/fa';
import Container from '../../container/Container';

const BlockedWarning = () => {
    return (
        <Container>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto mt-20"
            >
                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-8 text-center">
                    <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-red-800 mb-4">Account Restricted</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Your account has been temporarily restricted. You cannot submit, edit, upvote, or boost issues at this time.
                    </p>
                    <div className="bg-white rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">What to do next?</h3>
                        <p className="text-gray-600 mb-4">
                            Please contact the authorities to resolve this issue. You can still log in to view your account status.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-gray-700">
                            <FaPhone />
                            <span>Contact Support: support@citycare.com</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Container>
    );
};

export default BlockedWarning;
