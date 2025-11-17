import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Play } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  videoUrl?: string;
  metrics?: { label: string; value: string };
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Legal Director',
    company: 'TechLaw Associates',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    content: 'iDocReminder transformed our entire contract management workflow. We\'ve cut review time by 73% and eliminated compliance errors completely.',
    rating: 5,
    metrics: { label: 'Time Saved', value: '73%' },
  },
  {
    id: 2,
    name: 'James Chen',
    role: 'Operations Manager',
    company: 'Global Finance Inc',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    content: 'The AI-powered analysis is incredible. What used to take our team days now takes hours. The ROI was evident within the first month.',
    rating: 5,
    metrics: { label: 'Documents Processed', value: '10K+' },
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'CEO',
    company: 'StartupXYZ',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
    content: 'Security was our top concern with sensitive client data. DocuVault\'s encryption and compliance certifications gave us complete peace of mind.',
    rating: 5,
    metrics: { label: 'Security Grade', value: 'A+' },
  },
  {
    id: 4,
    name: 'Marcus Thompson',
    role: 'Compliance Officer',
    company: 'Enterprise Solutions',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    content: 'The audit trail capabilities are exceptional. We\'ve achieved full regulatory compliance and haven\'t looked back since.',
    rating: 5,
    metrics: { label: 'Compliance Score', value: '99.8%' },
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
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      </motion.div>
    ))}
  </div>
);

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
    }, 6000);
    return () => clearTimeout(timer);
  }, [autoplay, current]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 px-4 py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-semibold backdrop-blur-sm">
              ⭐ Loved by 10,000+ professionals
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white mb-6">
            Trusted by Industry Leaders
          </h2>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Join thousands of companies that have transformed their document management with iDocReminder
          </p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative mb-12">
          <div className="relative h-[500px] md:h-[420px]">
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
                onMouseEnter={() => setAutoplay(false)}
                onMouseLeave={() => setAutoplay(true)}
              >
                <div className="h-full flex items-stretch">
                  {/* Left Side - Image & Info */}
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="hidden md:flex w-2/5 relative"
                  >
                    <div className="relative w-full group">
                      {/* Image Container */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
                      
                      <img
                        src={testimonials[current].image}
                        alt={testimonials[current].name}
                        className="w-full h-full object-cover rounded-3xl relative z-10 border border-blue-500/30"
                      />

                      {/* Overlay Info */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent rounded-3xl"
                      >
                        <h3 className="text-white font-bold text-2xl">
                          {testimonials[current].name}
                        </h3>
                        <p className="text-blue-400 font-semibold">
                          {testimonials[current].role}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {testimonials[current].company}
                        </p>
                      </motion.div>

                      {/* Video Badge */}
                      {testimonials[current].videoUrl && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="absolute top-6 right-6 z-20 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white transition-all group"
                        >
                          <Play className="w-6 h-6 fill-white" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>

                  {/* Right Side - Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="w-full md:w-3/5 md:pl-12 flex flex-col justify-between"
                  >
                    <div>
                      {/* Stars */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                      >
                        <StarRating rating={testimonials[current].rating} />
                      </motion.div>

                      {/* Quote Icon */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Quote className="w-12 h-12 text-blue-500/30 mb-4" />
                      </motion.div>

                      {/* Testimonial Content */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl md:text-2xl text-gray-100 leading-relaxed font-medium mb-8"
                      >
                        &quot;{testimonials[current].content}&quot;
                      </motion.p>
                    </div>

                    {/* Metrics Card */}
                    {testimonials[current].metrics && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="inline-flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl w-fit"
                      >
                        <div>
                          <p className="text-gray-400 text-sm">
                            {testimonials[current].metrics.label}
                          </p>
                          <p className="text-3xl font-bold text-white">
                            {testimonials[current].metrics.value}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Mobile Info */}
                  <div className="md:hidden absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
                    <div className="flex gap-4 items-end">
                      <img
                        src={testimonials[current].image}
                        alt={testimonials[current].name}
                        className="w-16 h-16 rounded-full object-cover border border-blue-500/30"
                      />
                      <div>
                        <h3 className="text-white font-bold">
                          {testimonials[current].name}
                        </h3>
                        <p className="text-blue-400 text-sm font-semibold">
                          {testimonials[current].role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.15, x: -6 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            className="absolute -left-6 md:-left-20 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg hover:shadow-blue-500/50 transition-all border border-blue-400/50"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.15, x: 6 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            className="absolute -right-6 md:-right-20 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg hover:shadow-blue-500/50 transition-all border border-blue-400/50"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Pagination Dots with Hover Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-2 flex-wrap mb-16"
        >
          {testimonials.map((testimonial, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
                setAutoplay(false);
              }}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="relative group"
            >
              <div
                className={`h-3 rounded-full transition-all ${
                  idx === current
                    ? 'w-10 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50'
                    : 'w-3 bg-slate-600 hover:bg-slate-500'
                }`}
              />
              
              {/* Tooltip */}
              {hoveredCard === idx && idx !== current && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-blue-500/50 rounded-lg p-2 text-xs text-gray-200 whitespace-nowrap pointer-events-none"
                >
                  {testimonial.name}
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            { num: '10K+', label: 'Active Users', icon: '👥' },
            { num: '99.9%', label: 'Uptime SLA', icon: '⚡' },
            { num: '4.9/5', label: 'Avg Rating', icon: '⭐' },
            { num: '50M+', label: 'Docs Processed', icon: '📄' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/50 transition-all text-center group"
            >
              <p className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {stat.icon}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {stat.num}
              </p>
              <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}