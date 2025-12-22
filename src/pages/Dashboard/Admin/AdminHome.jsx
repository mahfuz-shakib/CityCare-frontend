import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaClipboardList, FaClock, FaCheckCircle, FaTimesCircle, FaCreditCard, FaUsers, FaUserTie } from 'react-icons/fa';
import { Link } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Container from '../../../container/Container';
import Loader from '../../../components/Loader';

const AdminHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: issuesResponse , isLoading: issuesLoading } = useQuery({
        queryKey: ['issues', 'admin'],
        queryFn: async () => {
            const res = await axiosSecure.get('/issues');
            return res.data;
        },
    });
    const issues = issuesResponse?.data || [];

    const { data: payments = [], isLoading: paymentsLoading } = useQuery({
        queryKey: ['payments', 'admin'],
        queryFn: async () => {
            const res = await axiosSecure.get('/payments');
            return res.data;
        },
    });

    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['users', 'citizen'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users/?role=citizen');
            return res.data;
        },
    });

    const { data: staffs = [], isLoading: staffsLoading } = useQuery({
        queryKey: ['staffs'],
        queryFn: async () => {
            const res = await axiosSecure.get('/staffs');
            return res.data;
        },
    });

    if (issuesLoading || paymentsLoading || usersLoading || staffsLoading) {
        return <Loader />;
    }

    const stats = {
        totalIssues: issues.length,
        pending: issues.filter(i => i.status === 'pending').length,
        resolved: issues.filter(i => i.status === 'resolved' || i.status === 'closed').length,
        rejected: issues.filter(i => i.status === 'rejected').length,
        totalPayments: payments.length,
        totalUsers: users.length,
        totalStaffs: staffs.length,
    };

    const latestIssues = issues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const latestPayments = payments.sort((a, b) => new Date(b.createdAt || b.created) - new Date(a.createdAt || a.created)).slice(0, 5);
    const latestUsers = users.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);

    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || p.amount_total / 100 || 0), 0);

    const statCards = [
        {
            title: 'Total Issues',
            value: stats.totalIssues,
            icon: FaClipboardList,
            color: 'bg-blue-500',
            link: '/dashboard/all-issues',
        },
        {
            title: 'Pending Issues',
            value: stats.pending,
            icon: FaClock,
            color: 'bg-yellow-500',
            link: '/dashboard/all-issues?status=pending',
        },
        {
            title: 'Resolved Issues',
            value: stats.resolved,
            icon: FaCheckCircle,
            color: 'bg-green-500',
            link: '/dashboard/all-issues?status=resolved',
        },
        {
            title: 'Rejected Issues',
            value: stats.rejected,
            icon: FaTimesCircle,
            color: 'bg-red-500',
            link: '/dashboard/all-issues?status=rejected',
        },
        {
            title: 'Total Payments',
            value: stats.totalPayments,
            icon: FaCreditCard,
            color: 'bg-indigo-500',
            link: '/dashboard/payments',
        },
        {
            title: 'Total Revenue',
            value: `৳${totalRevenue.toFixed(0)}`,
            icon: FaCreditCard,
            color: 'bg-green-600',
            link: '/dashboard/payments',
        },
        {
            title: 'Total Citizens',
            value: stats.totalUsers,
            icon: FaUsers,
            color: 'bg-purple-500',
            link: '/dashboard/manage-users',
        },
        {
            title: 'Total Staff',
            value: stats.totalStaffs,
            icon: FaUserTie,
            color: 'bg-orange-500',
            link: '/dashboard/manage-staffs',
        },
    ];

    return (
        <Container>
            <title>Dashboard</title>

            <div className="space-y-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">System overview and statistics</p>
                </motion.div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    {/* Issue Status Distribution */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Issue Status Distribution</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Pending', value: stats.pending, color: 'bg-yellow-500', total: stats.totalIssues },
                                { label: 'Resolved', value: stats.resolved, color: 'bg-green-500', total: stats.totalIssues },
                                { label: 'Rejected', value: stats.rejected, color: 'bg-red-500', total: stats.totalIssues },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                        <span className="text-sm text-gray-600">{item.value}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                            style={{ width: `${stats.totalIssues > 0 ? (item.value / stats.totalIssues) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Payment Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                <span className="font-medium text-gray-700">Total Revenue</span>
                                <span className="text-2xl font-bold text-green-600">৳{totalRevenue.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                                <span className="font-medium text-gray-700">Total Payments</span>
                                <span className="text-xl font-bold text-blue-600">{stats.totalPayments}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                                <span className="font-medium text-gray-700">Boost Payments</span>
                                <span className="text-xl font-bold text-purple-600">
                                    {payments.filter(p => p.purpose?.toLowerCase().includes('boost') || p.metadata?.issueId).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                                <span className="font-medium text-gray-700">Subscriptions</span>
                                <span className="text-xl font-bold text-orange-600">
                                    {payments.filter(p => p.purpose?.toLowerCase().includes('subscription') || p.metadata?.userId).length}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Latest Issues */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white rounded-lg shadow-md p-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Latest Issues</h3>
                        <Link to="/dashboard/all-issues" className="text-blue-600 hover:underline text-sm font-medium">
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
                                            issue.status === 'pending' ? 'badge-warning' :
                                            issue.status === 'resolved' || issue.status === 'closed' ? 'badge-success' :
                                            issue.status === 'rejected' ? 'badge-error' :
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
                        <p className="text-gray-500 text-center py-8">No issues found</p>
                    )}
                </motion.div>

                {/* Latest Payments */}
                {latestPayments.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Recent Payments</h3>
                            <Link to="/dashboard/payments" className="text-blue-600 hover:underline text-sm font-medium">
                                View All →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {latestPayments.map((payment) => (
                                <div key={payment._id || payment.sessionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {payment.purpose || (payment.metadata?.issueId ? 'Issue Boost' : 'Premium Subscription')}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {payment.customerEmail} • {new Date(payment.createdAt || payment.created).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">
                                        ৳{payment.amount || (payment.amount_total / 100) || 0}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Latest Registered Users */}
                {latestUsers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Latest Registered Users</h3>
                            <Link to="/dashboard/manage-users" className="text-blue-600 hover:underline text-sm font-medium">
                                View All →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {latestUsers.map((user) => (
                                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <img src={user.photoURL || '/avatar.png'} alt={user.displayName} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-medium text-gray-800">{user.displayName}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`badge ${user.isPremium ? 'badge-warning' : 'badge-outline'}`}>
                                        {user.isPremium ? 'Premium' : 'Free'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </Container>
    );
};

export default AdminHome;
