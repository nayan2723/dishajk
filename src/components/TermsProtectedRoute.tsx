import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

interface TermsProtectedRouteProps {
  children: React.ReactNode;
}

const TermsProtectedRoute: React.FC<TermsProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Check if user has accepted terms
  const termsAccepted = user?.unsafeMetadata?.termsAccepted as boolean;
  
  if (!termsAccepted) {
    return <Navigate to="/terms" replace />;
  }

  return <>{children}</>;
};

export default TermsProtectedRoute;