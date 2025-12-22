import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import Container from '../../../container/Container';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'Rahman Ali',
            role: 'Local Resident',
            image: 'i',
            text: 'CityCare made it so easy to report the pothole near my house. It was fixed within a week!',
            rating: 5,
        },
        {
            name: 'Fatima Begum',
            role: 'Business Owner',
            image: 'i',
            text: 'The broken streetlight outside my shop was reported and fixed quickly. Great service!',
            rating: 5,
        },
        {
            name: 'Karim Uddin',
            role: 'Community Leader',
            image: 'i',
            text: 'This platform has transformed how we engage with city services. Highly recommended!',
            rating: 5,
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
                    <p className="text-gray-600 text-lg">Real feedback from citizens who made a difference</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <FaQuoteLeft className="text-blue-500 text-3xl mb-4" />
                            <div className="flex mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FaStar key={i} className="text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://ui-avatars.com/api/?name=' + testimonial.name + '&background=random';
                                    }}
                                />
                                <div>
                                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Testimonials;








