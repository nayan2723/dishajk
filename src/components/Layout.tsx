import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Home, ClipboardList, Target, BarChart3 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/quiz', label: 'Take Quiz', icon: ClipboardList },
    { path: '/recommendations', label: 'Recommendations', icon: Target },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`sticky top-0 z-0 w-full transition-all duration-300 ${
        location.pathname === '/' 
          ? 'bg-transparent border-transparent' 
          : 'border-b bg-card/80 backdrop-blur-sm shadow-soft'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-smooth">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">Disha</h1>
                <p className="text-xs text-muted-foreground">Career Guidance Platform</p>
              </div>
            </Link>

            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <nav className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      asChild
                      className="transition-smooth"
                    >
                      <Link to={item.path} className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  );
                })}
              </nav>
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="outline" size="sm">
                Menu
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                © 2024 Disha - Personalized Career & Education Advisor
              </span>
            </div>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-smooth">About</a>
              <a href="#" className="hover:text-primary transition-smooth">Contact</a>
              <a href="#" className="hover:text-primary transition-smooth">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;