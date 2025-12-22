import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Container from '../../container/Container';

const Contact = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = (data) => {
        // In a real app, this would send an email or save to database
        toast.success('Thank you for your message! We will get back to you soon.');
        reset();
    };

    const contactInfo = [
        {
            icon: FaEnvelope,
            title: 'Email',
            content: 'support@citycare.com',
            link: 'mailto:support@citycare.com',
        },
        {
            icon: FaPhone,
            title: 'Phone',
            content: '+880 1234 567890',
            link: 'tel:+8801234567890',
        },
        {
            icon: FaMapMarkerAlt,
            title: 'Address',
            content: 'City Hall, Dhaka, Bangladesh',
            link: null,
        },
    ];

    return (
        <Container>
            <div className="min-h-screen py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-gray-800 mb-4">Contact Us</h1>
                        <p className="text-xl text-gray-600">
                            Have questions or need help? We're here to assist you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                                <p className="text-gray-600 mb-8">
                                    Whether you have a question about our services, need technical support, 
                                    or want to provide feedback, we'd love to hear from you.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {contactInfo.map((info, index) => (
                                    <motion.div
                                        key={info.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                        className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <info.icon className="text-blue-600 text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                                            {info.link ? (
                                                <a href={info.link} className="text-blue-600 hover:underline">
                                                    {info.content}
                                                </a>
                                            ) : (
                                                <p className="text-gray-600">{info.content}</p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Office Hours</h3>
                                <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                                <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                                <p className="text-gray-600">Sunday: Closed</p>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white p-8 rounded-lg shadow-md"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Name
                                    </label>
                                    <input
                                        {...register('name', { required: 'Name is required' })}
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="Enter your name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                        type="email"
                                        className="input input-bordered w-full"
                                        placeholder="Enter your email"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject
                                    </label>
                                    <input
                                        {...register('subject', { required: 'Subject is required' })}
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="What is this regarding?"
                                    />
                                    {errors.subject && (
                                        <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        {...register('message', {
                                            required: 'Message is required',
                                            minLength: {
                                                value: 10,
                                                message: 'Message must be at least 10 characters',
                                            },
                                        })}
                                        className="textarea textarea-bordered w-full h-32"
                                        placeholder="Tell us how we can help..."
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    <FaPaperPlane />
                                    Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </Container>
    );
};

export default Contact;


