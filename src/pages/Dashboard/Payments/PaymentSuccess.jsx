import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import Container from '../../../container/Container';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import jsPDF from 'jspdf';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const axiosSecure = useAxiosSecure();
    // 
    useEffect(() => {
        if (sessionId) {
            fetchPaymentInfo();
        }
    }, [sessionId, axiosSecure]);

    const fetchPaymentInfo = async () => {
        try {
            const { data } = await axiosSecure.get(`/payment-session-info?sessionId=${sessionId}`);
            setPaymentInfo(data);
            
            // Save to database
            savePaymentToDatabase(data);
        } catch (error) {
            console.error('Error fetching payment info:', error);
        } finally {
            setLoading(false);
        }
    };

    const savePaymentToDatabase = async (data) => {
        try {
            const paymentData = {
                sessionId: data.id,
                amount: data.amount_total / 100,
                currency: data.currency,
                paymentStatus: data.payment_status,
                customerEmail: data.customer_email,
                metadata: data.metadata,
                purpose: data.metadata?.issueId ? 'Boost' : data.metadata?.userId ? 'Premium Subscription' : 'Unknown',
            };
            console.log('Saving payment data: ',paymentData)
            await axiosSecure.post('/payments', paymentData);
            
            // Create timeline entry for boost payment
            if (data.metadata?.issueId) {
                const timelineInfo = {
                    issueId: data.metadata.issueId,
                    message: "Issue priority boosted (Payment: ৳100)",
                    updatedBy: "Citizen"
                };
                try {
                    await axiosSecure.post("/timelines", timelineInfo);
                } catch (err) {
                    console.error('Error creating timeline entry:', err);
                }
            }
            
            setSaved(true);
        } catch (error) {
            console.error('Error saving payment to database:', error);
        }
    };

    const downloadReceipt = () => {
        if (!paymentInfo) return;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 20;

        // Header Background
        pdf.setFillColor(34, 197, 94); // Green color
        pdf.rect(0, 0, pageWidth, 50, 'F');

        // Title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(28);
        pdf.setTextColor(255, 255, 255);
        pdf.text('PAYMENT RECEIPT', pageWidth / 2, 20, { align: 'center' });

        pdf.setFontSize(12);
        pdf.text('CityCare - City Issue Management', pageWidth / 2, 32, { align: 'center' });

        // Reset to black text
        pdf.setTextColor(0, 0, 0);
        yPosition = 60;

        // Status Badge
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.setTextColor(22, 163, 74);
        pdf.text('✓ PAYMENT SUCCESSFUL', 20, yPosition);
        yPosition += 15;

        // Divider
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;

        // Transaction ID
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Transaction ID:', 20, yPosition);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text(paymentInfo.id, 60, yPosition);
        yPosition += 8;

        // Date
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text('Date:', 20, yPosition);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text(new Date(paymentInfo.created * 1000).toLocaleString(), 60, yPosition);
        yPosition += 15;

        // Payment Details Section
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('PAYMENT DETAILS', 20, yPosition);
        yPosition += 8;

        // Divider
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 8;

        // Amount Box
        pdf.setFillColor(240, 253, 250);
        pdf.rect(20, yPosition, pageWidth - 40, 25, 'F');
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('TOTAL AMOUNT', 30, yPosition + 8);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.setTextColor(22, 163, 74);
        pdf.text(`${paymentInfo.amount_total / 100} ${paymentInfo.currency?.toUpperCase()}`, 30, yPosition + 20);
        yPosition += 35;

        // Status
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Payment Status:', 20, yPosition);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(22, 163, 74);
        pdf.text(paymentInfo.payment_status.toUpperCase(), 80, yPosition);
        yPosition += 10;

        // Customer Email
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text('Customer Email:', 20, yPosition);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(paymentInfo.customer_email, 80, yPosition);
        yPosition += 15;

        // Payment Type Section
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('PAYMENT TYPE', 20, yPosition);
        yPosition += 8;

        // Divider
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 8;

        // Payment Type Details
        if (paymentInfo.metadata?.issueId) {
            // Issue Boost
            pdf.setFillColor(245, 208, 254);
            pdf.rect(20, yPosition, pageWidth - 40, 30, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(11);
            pdf.setTextColor(139, 92, 246);
            pdf.text('ISSUE BOOST', 30, yPosition + 8);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Issue: ${paymentInfo.metadata?.issueTitle || 'N/A'}`, 30, yPosition + 17);
            pdf.text(`ID: ${paymentInfo.metadata.issueId}`, 30, yPosition + 25);
            yPosition += 40;
        } else if (paymentInfo.metadata?.userId) {
            // Premium Subscription
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
            pdf.text(`User ID: ${paymentInfo.metadata?.userId}`, 30, yPosition + 25);
            yPosition += 40;
        }

        // Footer
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, pageHeight - 40, pageWidth - 20, pageHeight - 40);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Thank you for your payment!', pageWidth / 2, pageHeight - 30, { align: 'center' });
        pdf.text('For support, contact us at support@citycare.com', pageWidth / 2, pageHeight - 24, { align: 'center' });
        pdf.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 18, { align: 'center' });
        pdf.text('This is an official payment receipt. Please keep it for your records.', pageWidth / 2, pageHeight - 12, { align: 'center' });

        // Save PDF
        pdf.save(`payment-receipt-${paymentInfo.id}.pdf`);
    };

    return (
        <Container>
            <title>Payment Success</title>

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-96">
                            <div className="text-center">
                                <div className="inline-block">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500"></div>
                                </div>
                                <p className="mt-6 text-gray-600 text-lg">Processing your payment...</p>
                            </div>
                        </div>
                    ) : paymentInfo ? (
                        <div className="space-y-6">
                            {/* Success Card */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-green-500">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-8 text-white text-center">
                                    <div className="text-6xl mb-4">✓</div>
                                    <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
                                    <p className="text-green-100">Thank you for your payment</p>
                                </div>

                                {/* Payment Details */}
                                <div className="px-8 py-8">
                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Amount</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                                {paymentInfo.amount_total / 100} {paymentInfo.currency?.toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Status</p>
                                            <p className="text-2xl font-bold text-green-600 mt-1">
                                                {paymentInfo.payment_status.charAt(0).toUpperCase() + paymentInfo.payment_status.slice(1)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Customer Email */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                                        <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Customer Email</p>
                                        <p className="text-lg text-gray-900 mt-1">{paymentInfo.customer_email}</p>
                                    </div>

                                    {/* Payment Type Details */}
                                    <div className="border-t pt-8">
                                        <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Details</h3>
                                        {paymentInfo.metadata?.issueId && (
                                            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded">
                                                <div className="flex items-center mb-4">
                                                    <span className="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">ISSUE BOOST</span>
                                                </div>
                                                <p className="text-gray-700 mb-2">
                                                    <strong className="text-gray-900">Issue Title:</strong> {paymentInfo.metadata?.issueTitle}
                                                </p>
                                                <p className="text-gray-700">
                                                    <strong className="text-gray-900">Issue ID:</strong> {paymentInfo.metadata.issueId}
                                                </p>
                                            </div>
                                        )}
                                        {paymentInfo.metadata?.userId && (
                                            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded">
                                                <div className="flex items-center mb-4">
                                                    <span className="inline-block bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">PREMIUM SUBSCRIPTION</span>
                                                </div>
                                                <p className="text-gray-700">
                                                    <strong className="text-gray-900">User ID:</strong> {paymentInfo.metadata?.userId}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Session ID */}
                                    <div className="mt-8 pt-8 border-t">
                                        <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">Transaction ID</p>
                                        <p className="font-mono text-sm bg-gray-100 p-3 rounded text-gray-900 break-all">{sessionId}</p>
                                    </div>

                                    {/* Success Message */}
                                    {saved && (
                                        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                            <p className="text-green-700 font-semibold">✓ Payment information saved successfully to our records</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-8 flex gap-4">
                                        <button
                                            onClick={downloadReceipt}
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-4-2m4 2l4-2" />
                                            </svg>
                                            Download PDF Receipt
                                        </button>
                                        <a
                                            href="/dashboard"
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8M3 3v6h6m0 0l-2.35-2.35a8.25 8.25 0 0114.7 0" />
                                            </svg>
                                            Back to Dashboard
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
                                <p className="text-sm">
                                    Need help? Contact our support team at <span className="font-semibold text-gray-900">support@citycare.com</span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Payment</h2>
                            <p className="text-gray-600 mb-6">Could not retrieve payment information. Please try again or contact support.</p>
                            <a
                                href="/dashboard"
                                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                            >
                                Return to Dashboard
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default PaymentSuccess;