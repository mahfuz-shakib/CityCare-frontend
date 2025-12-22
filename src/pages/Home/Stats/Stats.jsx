import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FaClipboardList, FaUsers, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Container from '../../../container/Container';

const Stats = () => {
    const axiosSecure = useAxiosSecure();

    const { data: issuesResponse} = useQuery({
        queryKey: ['allIssues'],
        queryFn: async () => {
            const res = await axiosSecure.get('/issues');
            return res.data?.data || res.data || [];
        },
    });
    const issues = issuesResponse?.data || [];

    const { data: users = [] } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users/?role=citizen');
            return res.data || [];
        },
    });

    const stats = [
        {
            icon: FaClipboardList,
            number: issues.length || '1000+',
            label: 'Total Issues Reported',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: FaCheckCircle,
            number: issues.filter(i => i.status === 'resolved' || i.status === 'closed').length || '500+',
            label: 'Issues Resolved',
            color: 'from-green-500 to-green-600',
        },
        {
            icon: FaUsers,
            number: users.length || '200+',
            label: 'Active Citizens',
            color: 'from-purple-500 to-purple-600',
        },
        {
            icon: FaChartLine,
            number: `${issues.length > 0 ? Math.round((issues.filter(i => i.status === 'resolved' || i.status === 'closed').length / issues.length) * 100) : 95}%`,
            label: 'Resolution Rate',
            color: 'from-yellow-500 to-yellow-600',
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
                    <p className="text-blue-100 text-lg">Numbers that speak for themselves</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`bg-gradient-to-br ${stat.color} p-8 rounded-lg shadow-xl text-center`}
                        >
                            <stat.icon className="text-4xl mb-4 mx-auto" />
                            <h3 className="text-4xl font-bold mb-2">{stat.number}</h3>
                            <p className="text-blue-100 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Stats;






