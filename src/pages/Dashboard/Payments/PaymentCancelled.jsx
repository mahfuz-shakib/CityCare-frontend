import React from 'react';
import { useNavigate } from 'react-router';
import Container from '../../../container/Container';

const PaymentCancelled = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
                <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-10 text-center">
                    <div className="text-7xl text-red-500 mb-4">✖</div>
                    <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
                    <p className="text-gray-600 mb-6">Your payment was not completed. No charges were made.</p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-md font-semibold"
                        >
                            Back to Dashboard
                        </button>

                        <button
                            onClick={() => window.history.back()}
                            className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold"
                        >
                            Try Again
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-6">If you think this is a mistake, contact support at <span className="font-semibold">support@citycare.com</span></p>
                </div>
            </div>
        </Container>
    );
};

export default PaymentCancelled;