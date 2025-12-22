import React, { useEffect, useMemo, useState } from 'react';
import Container from '../../../container/Container';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import { useQuery } from '@tanstack/react-query';

const formatDate = (ts) => {
    try {
        const d = new Date(ts);
        return d.toLocaleString();
    } catch (e) {
        return ts;
    }
};
// 
const toCurrency = (amount, currency = 'BDT') => `${amount} ${currency?.toUpperCase()}`;

const PaymentHistory = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [filters, setFilters] = useState({ purpose: 'all', status: 'all', search: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6; // Show 6 rows per page

    const { role, roleLoading } = useRole();
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['payments', role, user?.email],
        queryFn: async () => {
            if (role === 'admin') {
                const res = await axiosSecure.get('/payments');
                return res.data;
            }
            if (!user?.email) return [];
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return res.data;
        },
    });

    const payments = data || [];

    const filtered = useMemo(() => {
        return payments
            .filter((p) => {
                // Purpose filter: normalize purpose to match filter
                if (filters.purpose !== 'all') {
                    const purposeLower = String((p.purpose || '').toLowerCase());
                    const filterMatch = 
                        (filters.purpose === 'boost' && (purposeLower.includes('boost') || p.metadata?.issueId)) ||
                        (filters.purpose === 'subscription' && (purposeLower.includes('subscription') || p.metadata?.userId)) ||
                        (filters.purpose === 'unknown' && purposeLower === 'unknown');
                    if (!filterMatch) return false;
                }
                
                if (filters.status !== 'all' && String((p.paymentStatus || p.status || '').toLowerCase()) !== filters.status) return false;
                
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

    // Chart data per month
    const monthly = useMemo(() => {
        const map = {}; // 'YYYY-MM' -> total
        (payments || []).forEach((p) => {
            const ts = p.createdAt || p.created || Date.now();
            const d = new Date(ts);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            map[key] = (map[key] || 0) + (p.amount || p.amount_total / 100 || 0);
        });
        const entries = Object.entries(map).sort();
        return entries.map(([k, v]) => ({ month: k, total: v }));
    }, [payments]);

    // Chart data by purpose
    const purposeData = useMemo(() => {
        const map = { Boost: 0, 'Premium Subscription': 0, Unknown: 0 };
        (payments || []).forEach((p) => {
            let purpose = p.purpose || '';
            if (!purpose) {
                purpose = (p.metadata?.issueId ? 'Boost' : p.metadata?.userId ? 'Premium Subscription' : 'Unknown');
            }
            if (purpose.includes('boost') || purpose === 'Boost') {
                map['Boost'] += p.amount || p.amount_total / 100 || 0;
            } else if (purpose.includes('subscription') || purpose === 'Premium Subscription') {
                map['Premium Subscription'] += p.amount || p.amount_total / 100 || 0;
            } else {
                map['Unknown'] += p.amount || p.amount_total / 100 || 0;
            }
        });
        return Object.entries(map)
            .filter(([, val]) => val > 0)
            .map(([label, value]) => ({ label, value }));
    }, [payments]);

    const colors = ['#3b82f6', '#10b981', '#f59e0b'];

    const downloadJSON = (payment) => {
        const content = JSON.stringify(payment, null, 2);
        const a = document.createElement('a');
        a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(content);
        a.download = `payment-${payment.sessionId || payment.id || 'unknown'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    useEffect(() => {
        if (!roleLoading) refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email, role, roleLoading]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const isCitizen = role === 'citizen';
    const tableColSpan = isCitizen ? 5 : 6;

    return (
        <Container>
            <title>Payment History</title>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Payment History</h2>
                    <div className="flex gap-2">
                        <select className="select select-bordered" value={filters.purpose} onChange={(e) => setFilters((f) => ({ ...f, purpose: e.target.value }))}>
                            <option value="all">All purposes</option>
                            <option value="boost">Boost</option>
                            <option value="subscription">Subscription</option>
                            <option value="unknown">Unknown</option>
                        </select>
                        <select className="select select-bordered" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
                            <option value="all">All status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                        </select>
                        <input placeholder="Search..." className="input input-bordered" value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Purpose</th>
                                    {isCitizen ? <th>Issue</th> : <th>Email</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={tableColSpan} className="text-center py-6"><Loader /></td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={tableColSpan} className="text-center py-6">No payments found</td></tr>
                                ) : (
                                    paginatedData.map((p) => {
                                        let displayPurpose = p.purpose || '';
                                        if (!displayPurpose) {
                                            displayPurpose = (p.metadata?.issueId ? 'Boost' : p.metadata?.userId ? 'Premium Subscription' : 'Unknown');
                                        }
                                        return (
                                            <tr key={p._id || p.sessionId || p.id}>
                                                <td>{formatDate(p.createdAt || p.created)}</td>
                                                <td>{toCurrency(p.amount || p.amount_total / 100, p.currency)}</td>
                                                <td className="capitalize">{(p.paymentStatus || p.status || '').toLowerCase()}</td>
                                                <td className="capitalize">{displayPurpose}</td>
                                                {isCitizen ? (
                                                    <td>{p.metadata?.issueTitle || 'N/A'}</td>
                                                ) : (
                                                    <td className="text-sm">{p.customerEmail}</td>
                                                )}
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
                                Page {currentPage} of {totalPages}
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
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Monthly Bar Chart */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold mb-4">Monthly Totals</h3>
                        {monthly.length === 0 ? (
                            <p className="text-sm text-gray-500">No data</p>
                        ) : (
                            <div className="w-full h-48 flex items-end gap-2">
                                {monthly.map((m) => {
                                    const max = Math.max(...monthly.map((x) => x.total), 1);
                                    const height = (m.total / max) * 100; // percent
                                    return (
                                        <div key={m.month} className="flex-1 text-center">
                                            <div style={{ height: `${height}%` }} className="bg-blue-500 rounded-t-md transition-all hover:bg-blue-600 cursor-pointer" title={`${m.month}: ${m.total}`}></div>
                                            <div className="text-xs mt-2">{m.month}</div>
                                            <div className="text-xs font-bold">{m.total.toFixed(0)}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Pie Chart by Purpose */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold mb-4">Payment by Type</h3>
                        {purposeData.length === 0 ? (
                            <p className="text-sm text-gray-500">No data</p>
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <svg width="200" height="200" viewBox="0 0 200 200">
                                    {(() => {
                                        const total = purposeData.reduce((sum, d) => sum + d.value, 0);
                                        let startAngle = -90;
                                        return purposeData.map((d, i) => {
                                            const sliceAngle = (d.value / total) * 360;
                                            const endAngle = startAngle + sliceAngle;
                                            const radius = 80;
                                            const x1 = 100 + radius * Math.cos((startAngle * Math.PI) / 180);
                                            const y1 = 100 + radius * Math.sin((startAngle * Math.PI) / 180);
                                            const x2 = 100 + radius * Math.cos((endAngle * Math.PI) / 180);
                                            const y2 = 100 + radius * Math.sin((endAngle * Math.PI) / 180);
                                            const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                                            const pathData = [
                                                `M 100 100`,
                                                `L ${x1} ${y1}`,
                                                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                                'Z'
                                            ].join(' ');
                                            const result = (
                                                <path
                                                    key={i}
                                                    d={pathData}
                                                    fill={colors[i % colors.length]}
                                                    stroke="white"
                                                    strokeWidth="2"
                                                />
                                            );
                                            startAngle = endAngle;
                                            return result;
                                        });
                                    })()}
                                </svg>
                                <div className="mt-4 space-y-2 text-sm">
                                    {purposeData.map((d, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}></div>
                                            <span>{d.label}: {d.value.toFixed(0)} BDT</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
};


export default PaymentHistory;