import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList, Target, BarChart3, Users, Award, TrendingUp, Star, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: ClipboardList,
      title: 'Interactive Quiz',
      description: 'Comprehensive psychometric assessment to understand your interests and skills',
    },
    {
      icon: Target,
      title: 'Personalized Recommendations',
      description: 'Get tailored stream and course suggestions based on your unique profile',
    },
    {
      icon: Award,
      title: 'College Guidance',
      description: 'Find the best government colleges and institutions for your chosen path',
    },
    {
      icon: TrendingUp,
      title: 'Career Insights',
      description: 'Understand career prospects and growth opportunities in different fields',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Students Guided', icon: Users },
    { number: '95%', label: 'Success Rate', icon: Star },
    { number: '500+', label: 'Partner Colleges', icon: Award },
    { number: '50+', label: 'Career Paths', icon: TrendingUp },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="w-full">
      {/* Web3 Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-black via-purple-900 to-purple-700 text-white overflow-hidden">
        {/* Glowing Orbit Background */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 animate-pulse"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              className="animate-spin"
              style={{ animationDuration: '20s' }}
            />
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="1"
              className="animate-spin"
              style={{ animationDuration: '15s', animationDirection: 'reverse' }}
            />
          </svg>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
            <motion.div
              className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight"
                variants={itemVariants}
              >
                Discover Your
                <br />
                Perfect Career Path
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl mb-8 opacity-80 max-w-2xl"
                variants={itemVariants}
              >
                Personalized Career & Education Advisor for Jammu & Kashmir Students using cutting-edge AI technology
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    asChild
                    className="glassmorphism rounded-full text-lg px-8 py-6 text-white hover:bg-white/20 transition-all duration-300 group"
                  >
                    <Link to="/quiz" className="flex items-center space-x-2">
                      <span>Get in Touch</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="rounded-full text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <Link to="/dashboard">Learn More</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="relative">
                <motion.div
                  className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full glassmorphism"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="absolute inset-8 bg-gradient-to-tr from-purple-400/30 to-pink-400/30 rounded-full glassmorphism"
                  animate={{
                    scale: [1.1, 1, 1.1],
                    rotate: [360, 180, 0]
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        className="py-16 px-4 bg-muted/30"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Disha Helps You
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform guides you through every step of your career decision-making process
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="card-gradient shadow-soft hover:shadow-medium transition-smooth border-0 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-primary text-primary-foreground">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 bg-primary text-primary-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Discover Your Path?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Take our comprehensive quiz and get personalized recommendations 
            for your education and career journey.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" variant="secondary" asChild className="shadow-medium">
              <Link to="/quiz" className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5" />
                <span>Start Your Journey</span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;