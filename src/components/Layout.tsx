import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Home, ClipboardList, Target, BarChart3, Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import ThemeToggle from './ThemeToggle';
import { Chatbot } from './Chatbot';
import logo from '../assets/logo-img.png';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/quiz', label: 'Take Quiz', icon: ClipboardList },
    { path: '/recommendations', label: 'Recommendations', icon: Target },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 h-20 w-full border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}

          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src={logo}
              alt="Disha Logo"
              className="h-24 w-24 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-primary">Disha</h1>
              <p className="text-xs text-muted-foreground">Career Guidance Platform</p>
            </div>
          </Link>



          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <SignedIn>
              <nav className="flex items-center space-x-1">
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
            </SignedIn>

            <SignedOut>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/sign-up">Sign Up</Link>
                </Button>
              </div>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-card border-border",
                    userButtonPopoverActionButton: "text-foreground hover:bg-accent",
                    userButtonPopoverActionButtonText: "text-foreground",
                    userButtonPopoverActionButtonIcon: "text-muted-foreground",
                  },
                }}
              />
            </SignedIn>

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="outline" size="sm" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b shadow-soft">
          <nav className="flex flex-col space-y-2 px-4 py-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <SignedOut>
              <div className="flex flex-col space-y-2">
                <Link
                  to="/sign-in"
                  className="px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center space-x-3 px-3 py-2">
                <UserButton />
                <ThemeToggle />
              </div>
            </SignedIn>
          </nav>
        </div>
      )}

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
                © 2025 Disha - Personalized Career & Education Advisor
              </span>
            </div>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <a href="#about" className="hover:text-primary transition-smooth">About</a>
              <a href="#contact" className="hover:text-primary transition-smooth">Contact</a>
              <a href="#" className="hover:text-primary transition-smooth">Privacy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Layout;
