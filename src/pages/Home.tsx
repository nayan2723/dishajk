import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList, Target, BarChart3, Users, Award, TrendingUp, Star } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

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

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 px-4 hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-white to-accent-foreground bg-clip-text text-transparent">
                Disha
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-slide-up">
              Personalized Career & Education Advisor
            </p>
            <p className="text-lg mb-10 text-white/80 max-w-2xl mx-auto animate-slide-up">
              Discover your ideal career path through our comprehensive assessment. 
              Get personalized recommendations for streams, courses, and colleges 
              that align with your unique interests and skills.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 shadow-medium">
                <Link to="/quiz" className="flex items-center space-x-2">
                  <ClipboardList className="h-5 w-5" />
                  <span>Take Quiz</span>
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-white text-white hover:bg-white hover:text-primary">
                <Link to="/recommendations" className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>View Recommendations</span>
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-white text-white hover:bg-white hover:text-primary">
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Admin Dashboard</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Disha Helps You
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform guides you through every step of your career decision-making process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="card-gradient shadow-soft hover:shadow-medium transition-smooth border-0">
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
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Discover Your Path?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Take our comprehensive quiz and get personalized recommendations 
            for your education and career journey.
          </p>
          <Button size="lg" variant="secondary" asChild className="shadow-medium">
            <Link to="/quiz" className="flex items-center space-x-2">
              <ClipboardList className="h-5 w-5" />
              <span>Start Your Journey</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;