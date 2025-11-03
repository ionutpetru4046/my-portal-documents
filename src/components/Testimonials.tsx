import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Legal Director',
    company: 'TechLaw Associates',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    content: 'DocuVault transformed how we manage contracts. The AI-powered insights save us hours every week. Absolutely game-changing for our practice.',
    rating: 5,
  },
  {
    id: 2,
    name: 'James Chen',
    role: 'Operations Manager',
    company: 'Global Finance Inc',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    content: 'The document organization is seamless. We\'ve reduced compliance errors by 95% since implementing DocuVault.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'CEO',
    company: 'StartupXYZ',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    content: 'The security features give me peace of mind. We store sensitive data with confidence knowing it\'s protected.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Marcus Thompson',
    role: 'Compliance Officer',
    company: 'Enterprise Solutions',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    content: 'Best investment we\'ve made for document management. The ROI was evident within the first month.',
    rating: 5,
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {[...Array(rating)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: i * 0.1 }}
      >
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
      </motion.div>
    ))}
  </div>
);

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
    setAutoplay(false);
  };

  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [autoplay, current]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium">
              Loved by teams worldwide
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What our users are saying
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands of companies trusting DocuVault for secure document management
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative h-96 md:h-80">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              <div className="h-full flex items-center">
                <div className="w-full bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-12 hover:border-slate-600/50 transition-colors">
                  <div className="flex flex-col md:flex-row gap-8 h-full">
                    {/* Left: Avatar & Info */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center md:items-start justify-center md:justify-start"
                    >
                      <img
                        src={testimonials[current].image}
                        alt={testimonials[current].name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-blue-500/30 mb-4"
                      />
                      <h3 className="text-white font-bold text-lg">
                        {testimonials[current].name}
                      </h3>
                      <p className="text-blue-400 text-sm font-medium">
                        {testimonials[current].role}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {testimonials[current].company}
                      </p>
                    </motion.div>

                    {/* Right: Testimonial Content */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col justify-center flex-1"
                    >
                      <Quote className="w-8 h-8 text-blue-500/40 mb-4" />
                      <p className="text-gray-200 text-lg leading-relaxed mb-6">
                        "{testimonials[current].content}"
                      </p>
                      <StarRating rating={testimonials[current].rating} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <motion.button
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(-1)}
            onMouseEnter={() => setAutoplay(false)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:translate-x-0 z-10 p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 text-white transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, x: 4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(1)}
            onMouseEnter={() => setAutoplay(false)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-0 z-10 p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Pagination Dots */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-3 mt-12"
        >
          {testimonials.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
                setAutoplay(false);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2 rounded-full transition-all ${
                idx === current
                  ? 'w-8 bg-blue-500'
                  : 'w-2 bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-4 md:gap-8 text-center"
        >
          {[
            { num: '10K+', label: 'Active Users' },
            { num: '99.9%', label: 'Uptime' },
            { num: '4.9★', label: 'Rating' },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p className="text-2xl md:text-3xl font-bold text-blue-400">{stat.num}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}