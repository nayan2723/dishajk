import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ClipboardList, Target, BarChart3, Users, Award, TrendingUp, Star, ArrowRight, Mail, MapPin, Phone, Eye, Heart, Lightbulb } from 'lucide-react';
import { useForm } from 'react-hook-form';
import HeroCarousel from '@/components/HeroCarousel';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';

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

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Handle form submission here
    reset();
  };

  const aboutCards = [
    {
      icon: Eye,
      title: 'Our Mission',
      description: 'Empowering students with personalized career guidance through innovative technology.',
    },
    {
      icon: Heart,
      title: 'Our Vision',
      description: 'Creating a future where every student finds their perfect career path.',
    },
    {
      icon: Lightbulb,
      title: 'Our Values',
      description: 'Innovation, integrity, and inclusive education for all students.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section with Geometric Shapes */}
      <HeroGeometric 
        badge="Disha - Career Guidance"
        title1="Your Personalized Career &"
        title2="Education Advisor"
      />

      {/* Hero Carousel Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Discover Your Path
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Helping J&K students choose the right stream, college, and career path through personalized guidance
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                asChild
                className="rounded-full text-lg px-8 py-6 group"
              >
                <Link to="/quiz" className="flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full text-lg px-8 py-6"
              >
                <Link to="/dashboard">Explore Features</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <HeroCarousel />
          </motion.div>
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

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-muted/10 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                About <span className="text-primary">Us</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We are revolutionizing career guidance through cutting-edge technology and personalized insights. 
                Our platform combines AI-driven assessments with expert knowledge to help students in Jammu & Kashmir 
                discover their ideal career paths and make informed educational decisions.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
                  <span className="text-primary text-sm font-medium">AI-Powered</span>
                </div>
                <div className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
                  <span className="text-primary text-sm font-medium">Personalized</span>
                </div>
                <div className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
                  <span className="text-primary text-sm font-medium">Future-Ready</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Futuristic Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full card-gradient border border-border/50 rounded-3xl flex items-center justify-center shadow-soft">
                  <div className="text-6xl">🚀</div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 card-gradient border border-border/50 rounded-full flex items-center justify-center shadow-soft">
                  <div className="text-2xl">✨</div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 card-gradient border border-border/50 rounded-full flex items-center justify-center shadow-soft">
                  <div className="text-xl">🎯</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mini Cards */}
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {aboutCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={index}
                  className="card-gradient border border-border/50 p-6 rounded-2xl shadow-soft hover:shadow-medium transition-smooth"
                  whileHover={{ y: -5, scale: 1.02 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary text-primary-foreground rounded-full mr-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold">{card.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{card.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 px-4 bg-background relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get in <span className="relative text-primary">
                Touch
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full"></div>
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you. Fill out the form or connect with us.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Label htmlFor="name" className="mb-2 block">Name</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    className="transition-smooth focus:ring-2 focus:ring-primary"
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message as string}</p>}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Label htmlFor="email" className="mb-2 block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="transition-smooth focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message as string}</p>}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Label htmlFor="message" className="mb-2 block">Message</Label>
                  <Textarea
                    id="message"
                    {...register('message', { required: 'Message is required' })}
                    className="transition-smooth focus:ring-2 focus:ring-primary min-h-[120px]"
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message as string}</p>}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full font-semibold py-4 shadow-medium transition-smooth"
                  >
                    Send Message
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="card-gradient border border-border/50 p-8 rounded-2xl shadow-soft">
                <h3 className="text-2xl font-semibold mb-6">Other Ways to Reach Us</h3>
                
                <div className="space-y-6">
                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-3 bg-primary text-primary-foreground rounded-full">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:hello@disha.career" className="text-muted-foreground hover:text-primary transition-smooth">
                        hello@disha.career
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-3 bg-primary text-primary-foreground rounded-full">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+911234567890" className="text-muted-foreground hover:text-primary transition-smooth">
                        +91 123 456 7890
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-3 bg-primary text-primary-foreground rounded-full">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">Jammu & Kashmir, India</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Social Media */}
              <motion.div
                className="card-gradient border border-border/50 p-6 rounded-2xl shadow-soft"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {['📘', '🐦', '💼', '📷'].map((icon, index) => (
                    <motion.button
                      key={index}
                      className="w-12 h-12 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center transition-smooth"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {icon}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;