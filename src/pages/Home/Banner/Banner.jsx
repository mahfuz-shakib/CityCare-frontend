import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { CheckCircle, MapIcon, Megaphone } from 'lucide-react';
import Container from '../../../container/Container';

const Banner = () => {
  return (
      <section className="relative pt-16 pb-32 overflow-hidden">
        <Container className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-surface-container-high text-primary font-bold text-xs tracking-widest uppercase">
              Community Driven Governance
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Fix Your City, <br/><span className="text-primary">One Report</span> at a Time
            </h1>
            <p className="font-headline text-lg text-secondary mb-10 max-w-xl leading-relaxed">
              Join thousands of citizens in building a better future. Report infrastructure issues, track resolutions in real-time, and hold local authorities accountable through transparency.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link to="/dashboard/report-issue"
                className="px-8 py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-800 transition-all flex items-center gap-2"
              >
                <Megaphone size={20} />
                Report Issue
              </Link>
              <Link to="/map-view" className="px-8 py-4 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-surface-container-highest transition-all flex items-center gap-2">
                <MapIcon size={20} />
                View Map
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -z-10 top-0 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-4 overflow-hidden transform lg:rotate-2 border border-white/40">
              <img 
                alt="Civic Platform Dashboard" 
                className="rounded-2xl w-full" 
                src="https://picsum.photos/seed/dashboard/800/600"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-8 left-8 right-8 glass-effect bg-white/70 p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="font-headline font-bold text-on-surface">Issue Resolved</p>
                    <p className="text-sm text-secondary">Main St. Pothole fixed in 48 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
  );
};

export default Banner;
