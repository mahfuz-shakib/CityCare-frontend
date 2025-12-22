import React from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaLock } from 'react-icons/fa';
import { Link } from 'react-router';
import Container from '../../container/Container';

const PremiumSubscriptionWarning = () => {
    return (
        <Container>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto mt-20"
            >
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-500 rounded-lg p-8 text-center">
                    <div className="relative inline-block mb-4">
                        <FaLock className="text-6xl text-yellow-600" />
                        <FaCrown className="text-3xl text-yellow-500 absolute -top-2 -right-2" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Issue Limit Reached</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        You've reached the free plan limit of 3 issues. Upgrade to Premium to report unlimited issues!
                    </p>
                    <div className="bg-white rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Premium Benefits</h3>
                        <ul className="text-left space-y-2 text-gray-600 mb-4">
                            <li className="flex items-center gap-2">
                                <FaCrown className="text-yellow-500" />
                                Unlimited issue reporting
                            </li>
                            <li className="flex items-center gap-2">
                                <FaCrown className="text-yellow-500" />
                                Priority support
                            </li>
                            <li className="flex items-center gap-2">
                                <FaCrown className="text-yellow-500" />
                                Premium badge on your profile
                            </li>
                        </ul>
                        <p className="text-2xl font-bold text-yellow-600 mb-4">Only ৳1000 one-time payment</p>
                        <Link
                            to="/dashboard/myProfile"
                            className="btn btn-warning btn-lg"
                        >
                            Upgrade to Premium Now
                        </Link>
                    </div>
                </div>
            </motion.div>
        </Container>
    );
};

export default PremiumSubscriptionWarning;
