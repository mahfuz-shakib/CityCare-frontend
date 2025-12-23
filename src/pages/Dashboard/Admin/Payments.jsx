import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { FaDownload, FaFilter } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Container from '../../../container/Container';
import Loader from '../../../components/Loader';
import { toast } from 'react-toastify';

const formatDate = (ts) => {
    try {
        const d = new Date(ts);
        return d.toLocaleString();
    } catch (e) {
        return ts;
    }
};

const toCurrency = (amount, currency = 'BDT') => `${amount} ${currency?.toUpperCase()}`;

const Payments = () => {
    const axiosSecure = useAxiosSecure();
    const [filters, setFilters] = useState({ purpose: 'all', status: 'all', search: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['payments', 'admin'],
        queryFn: async () => {
            const res = await axiosSecure.get('/payments');
            return res.data;
        },
    });

    const payments = data || [];

    const filtered = useMemo(() => {
        return payments
            .filter((p) => {
                // Purpose filter
                if (filters.purpose !== 'all') {
                    const purposeLower = String((p.purpose || '').toLowerCase());
                    const filterMatch = 
                        (filters.purpose === 'boost' && (purposeLower.includes('boost') || p.metadata?.issueId)) ||
                        (filters.purpose === 'subscription' && (purposeLower.includes('subscription') || p.metadata?.userId)) ||
                        (filters.purpose === 'unknown' && purposeLower === 'unknown');
                    if (!filterMatch) return false;
                }
                
                // Status filter
                if (filters.status !== 'all' && String((p.paymentStatus || p.status || '').toLowerCase()) !== filters.status) return false;
                
                // Search filter
                if (filters.search) {
                    const s = filters.search.toLowerCase();
                    return (
                        (p.customerEmail || '').toLowerCase().includes(s) ||
                        (p.sessionId || p.session || p.id || '').toLowerCase().includes(s) ||
                        (p.metadata?.issueTitle || '').toLowerCase().includes(s)
                    );
                }
                return true;
            })
            .sort((a, b) => new Date(b.createdAt || b.created || 0) - new Date(a.createdAt || a.created || 0));
    }, [payments, filters]);

    // Pagination
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const downloadInvoicePDF = (payment) => {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 20;

        // Header Background
        pdf.setFillColor(34, 197, 94);
        pdf.rect(0, 0, pageWidth, 50, 'F');

        // Title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(28);
        pdf.setTextColor(255, 255, 255);
        pdf.text('PAYMENT INVOICE', pageWidth / 2, 20, { align: 'center' });

        pdf.setFontSize(12);
        pdf.text('CityCare - City Issue Management', pageWidth / 2, 32, { align: 'center' });

        // Reset to black text
        pdf.setTextColor(0, 0, 0);
        yPosition = 60;

        // Invoice Details
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('INVOICE DETAILS', 20, yPosition);
        yPosition += 10;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Transaction ID:', 20, yPosition);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text(payment.sessionId || payment.id || 'N/A', 60, yPosition);
        yPosition += 8;

        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text('Date:', 20, yPosition);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text(formatDate(payment.createdAt || payment.created), 60, yPosition);
        yPosition += 8;

        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text('Customer Email:', 20, yPosition);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text(payment.customerEmail || 'N/A', 60, yPosition);
        yPosition += 15;

        // Payment Amount Box
        pdf.setFillColor(240, 253, 250);
        pdf.rect(20, yPosition, pageWidth - 40, 25, 'F');
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('TOTAL AMOUNT', 30, yPosition + 8);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.setTextColor(22, 163, 74);
        pdf.text(`${payment.amount || (payment.amount_total / 100) || 0} ${(payment.currency || 'BDT').toUpperCase()}`, 30, yPosition + 20);
        yPosition += 35;

        // Payment Type
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('PAYMENT TYPE', 20, yPosition);
        yPosition += 8;

        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 8;

        const purpose = payment.purpose || (payment.metadata?.issueId ? 'Boost' : payment.metadata?.userId ? 'Premium Subscription' : 'Unknown');
        
        if (payment.metadata?.issueId) {
            pdf.setFillColor(245, 208, 254);
            pdf.rect(20, yPosition, pageWidth - 40, 30, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(11);
            pdf.setTextColor(139, 92, 246);
            pdf.text('ISSUE BOOST', 30, yPosition + 8);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Issue: ${payment.metadata?.issueTitle || 'N/A'}`, 30, yPosition + 17);
            pdf.text(`ID: ${payment.metadata.issueId}`, 30, yPosition + 25);
            yPosition += 40;
        } else if (payment.metadata?.userId) {
            pdf.setFillColor(254, 243, 199);
            pdf.rect(20, yPosition, pageWidth - 40, 30, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(11);
            pdf.setTextColor(180, 83, 9);
            pdf.text('PREMIUM SUBSCRIPTION', 30, yPosition + 8);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Unlock premium features and exclusive benefits', 30, yPosition + 17);
            pdf.text(`User ID: ${payment.metadata?.userId}`, 30, yPosition + 25);
            yPosition += 40;
        }

        // Status
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Payment Status:', 20, yPosition);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(22, 163, 74);
        pdf.text((payment.paymentStatus || payment.status || 'paid').toUpperCase(), 80, yPosition);

        // Footer
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, pageHeight - 40, pageWidth - 20, pageHeight - 40);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Thank you for your payment!', pageWidth / 2, pageHeight - 30, { align: 'center' });
        pdf.text('For support, contact us at support@citycare.com', pageWidth / 2, pageHeight - 24, { align: 'center' });
        pdf.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 18, { align: 'center' });

        // Save PDF
        pdf.save(`payment-invoice-${payment.sessionId || payment.id || 'unknown'}.pdf`);
        toast.success('Invoice downloaded successfully');
    };

    const totalRevenue = filtered.reduce((sum, p) => sum + (p.amount || p.amount_total / 100 || 0), 0);

    return (
        <Container>
            <title>Payments</title>
            
            <div className="space-y-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-between items-center"
                >
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Payments Management</h2>
                        <p className="text-gray-600 mt-1">View and manage all payment transactions</p>
                    </div>
                    <div className="bg-green-50 px-6 py-3 rounded-lg border-2 border-green-500">
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600">৳{totalRevenue.toFixed(0)}</p>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white p-4 rounded-lg shadow-md"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <FaFilter className="text-gray-600" />
                        <h3 className="font-semibold text-gray-800">Filters</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <select
                            className="select select-bordered"
                            value={filters.purpose}
                            onChange={(e) => setFilters((f) => ({ ...f, purpose: e.target.value }))}
                        >
                            <option value="all">All purposes</option>
                            <option value="boost">Boost</option>
                            <option value="subscription">Subscription</option>
                            <option value="unknown">Unknown</option>
                        </select>
                        <select
                            className="select select-bordered"
                            value={filters.status}
                            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                        >
                            <option value="all">All status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                        </select>
                        <input
                            placeholder="Search by email, transaction ID, or issue title..."
                            className="input input-bordered flex-1 min-w-64"
                            value={filters.search}
                            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                        />
                    </div>
                </motion.div>

                {/* Payments Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th>Date</th>
                                    <th>Customer Email</th>
                                    <th>Amount</th>
                                    <th>Purpose</th>
                                    <th>Status</th>
                                    <th>Transaction ID</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6">
                                            <Loader />
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6 text-gray-500">
                                            No payments found
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((p) => {
                                        let displayPurpose = p.purpose || '';
                                        if (!displayPurpose) {
                                            displayPurpose = (p.metadata?.issueId ? 'Boost' : p.metadata?.userId ? 'Premium Subscription' : 'Unknown');
                                        }
                                        return (
                                            <tr key={p._id || p.sessionId || p.id} className="hover:bg-gray-50">
                                                <td>{formatDate(p.createdAt || p.created)}</td>
                                                <td className="text-sm">{p.customerEmail}</td>
                                                <td className="font-semibold text-green-600">
                                                    {toCurrency(p.amount || p.amount_total / 100, p.currency)}
                                                </td>
                                                <td>
                                                    <span className={`badge ${
                                                        displayPurpose.toLowerCase().includes('boost') ? 'badge-primary' :
                                                        displayPurpose.toLowerCase().includes('subscription') ? 'badge-warning' :
                                                        'badge-outline'
                                                    }`}>
                                                        {displayPurpose}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${
                                                        (p.paymentStatus || p.status || '').toLowerCase() === 'paid' ? 'badge-success' : 'badge-error'
                                                    }`}>
                                                        {(p.paymentStatus || p.status || 'paid').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="font-mono text-xs">{p.sessionId || p.id || 'N/A'}</td>
                                                <td>
                                                    <button
                                                        onClick={() => downloadInvoicePDF(p)}
                                                        className="btn btn-sm btn-outline btn-primary"
                                                        title="Download Invoice PDF"
                                                    >
                                                        <FaDownload />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 p-4 border-t">
                            <button
                                className="btn btn-sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            >
                                Previous
                            </button>
                            <span className="text-sm">
                                Page {currentPage} of {totalPages} ({filtered.length} total)
                            </span>
                            <button
                                className="btn btn-sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </Container>
    );
};

export default Payments;
