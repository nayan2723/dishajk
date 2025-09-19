import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./components/ThemeProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Recommendations from "./pages/Recommendations";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import TermsProtectedRoute from "./components/TermsProtectedRoute";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const publishableKey = "pk_test_bGl2ZS1zdGFsbGlvbi00My5jbGVyay5hY2NvdW50cy5kZXYk";

if (!publishableKey) {
  throw new Error("Missing Publishable Key")
}

const App = () => (
  <ClerkProvider publishableKey={publishableKey}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <QuizProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/quiz" element={<Layout><TermsProtectedRoute><Quiz /></TermsProtectedRoute></Layout>} />
                <Route path="/recommendations" element={<Layout><TermsProtectedRoute><Recommendations /></TermsProtectedRoute></Layout>} />
                <Route path="/dashboard" element={<Layout><TermsProtectedRoute><Dashboard /></TermsProtectedRoute></Layout>} />
                <Route path="/terms" element={<ProtectedRoute><Terms /></ProtectedRoute>} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </BrowserRouter>
          </QuizProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ClerkProvider>
);

export default App;
