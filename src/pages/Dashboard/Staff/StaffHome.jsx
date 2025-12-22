import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaClipboardList, FaCheckCircle, FaClock, FaTasks } from 'react-icons/fa';
import { Link } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Container from '../../../container/Container';
import Loader from '../../../components/Loader';

const StaffHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: issuesResponse, isLoading: issuesLoading } = useQuery({
        queryKey: ['issues', 'staff', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/issues/?staffEmail=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });
    const issues = issuesResponse?.data || [];

    if (issuesLoading) {
        return <Loader />;
    }

    const stats = {
        assignedIssues: issues.length,
        pending: issues.filter(i => i.status === 'pending').length,
        inProgress: issues.filter(i => i.status === 'in-progress').length,
        working: issues.filter(i => i.status === 'working').length,
        resolved: issues.filter(i => i.status === 'resolved' || i.status === 'closed').length,
    };

    const today = new Date().toDateString();
    const todayTasks = issues.filter(issue => {
        const issueDate = new Date(issue.createdAt || issue.updatedAt).toDateString();
        return issueDate === today;
    });

    const latestIssues = issues.sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt)).slice(0, 5);

    const statCards = [
        {
            title: 'Assigned Issues',
            value: stats.assignedIssues,
            icon: FaClipboardList,
            color: 'bg-blue-500',
            link: '/dashboard/assigned-issues',
        },
        {
            title: 'Pending',
            value: stats.pending,
            icon: FaClock,
            color: 'bg-yellow-500',
            link: '/dashboard/assigned-issues?status=pending',
        },
        {
            title: 'In Progress',
            value: stats.inProgress,
            icon: FaTasks,
            color: 'bg-purple-500',
            link: '/dashboard/assigned-issues?status=in-progress',
        },
        {
            title: 'Resolved',
            value: stats.resolved,
            icon: FaCheckCircle,
            color: 'bg-green-500',
            link: '/dashboard/assigned-issues?status=resolved',
        },
        {
            title: "Today's Tasks",
            value: todayTasks.length,
            icon: FaTasks,
            color: 'bg-indigo-500',
            link: '/dashboard/assigned-issues',
        },
    ];

    return (
        <Container>
            <div className="space-y-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Staff Dashboard</h1>
                    <p className="text-gray-600">Manage your assigned issues</p>
                </motion.div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link to={stat.link}>
                                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                                            <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                                        </div>
                                        <div className={`${stat.color} p-4 rounded-full text-white`}>
                                            <stat.icon className="text-2xl" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Status Distribution Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Issue Status Distribution</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Pending', value: stats.pending, color: 'bg-yellow-500', total: stats.assignedIssues },
                                { label: 'In Progress', value: stats.inProgress, color: 'bg-purple-500', total: stats.assignedIssues },
                                { label: 'Working', value: stats.working, color: 'bg-blue-500', total: stats.assignedIssues },
                                { label: 'Resolved', value: stats.resolved, color: 'bg-green-500', total: stats.assignedIssues },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                        <span className="text-sm text-gray-600">{item.value}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                            style={{ width: `${stats.assignedIssues > 0 ? (item.value / stats.assignedIssues) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Today's Tasks */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Tasks</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                                <span className="font-medium text-gray-700">Tasks Assigned Today</span>
                                <span className="text-2xl font-bold text-blue-600">{todayTasks.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                <span className="font-medium text-gray-700">Total Assigned</span>
                                <span className="text-xl font-bold text-green-600">{stats.assignedIssues}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                                <span className="font-medium text-gray-700">Resolved</span>
                                <span className="text-xl font-bold text-purple-600">{stats.resolved}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                                <span className="font-medium text-gray-700">Pending</span>
                                <span className="text-xl font-bold text-yellow-600">{stats.pending}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Latest Assigned Issues */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white rounded-lg shadow-md p-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Latest Assigned Issues</h3>
                        <Link to="/dashboard/assigned-issues" className="text-blue-600 hover:underline text-sm font-medium">
                            View All →
                        </Link>
                    </div>
                    {latestIssues.length > 0 ? (
                        <div className="space-y-3">
                            {latestIssues.map((issue) => (
                                <div key={issue._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{issue.title}</p>
                                        <p className="text-sm text-gray-600">{issue.location} • {issue.category}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`badge ${
                                            issue.priority === 'high' ? 'badge-error' : 'badge-outline'
                                        }`}>
                                            {issue.priority}
                                        </span>
                                        <span className={`badge ${
                                            issue.status === 'pending' ? 'badge-warning' :
                                            issue.status === 'resolved' || issue.status === 'closed' ? 'badge-success' :
                                            'badge-info'
                                        }`}>
                                            {issue.status}
                                        </span>
                                        <Link to={`/all-issues/${issue._id}`} className="text-blue-600 hover:underline text-sm">
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No assigned issues yet</p>
                    )}
                </motion.div>
            </div>
        </Container>
    );
};

export default StaffHome;
