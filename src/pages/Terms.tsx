import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

const Terms = () => {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAccept = async () => {
    if (!user || !accepted) return;
    
    setLoading(true);
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          termsAccepted: true,
        },
      });
      
      toast({
        title: "Terms Accepted",
        description: "Welcome to Disha! You can now access all features.",
      });
      
      navigate('/', { replace: true });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update terms acceptance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-border shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Terms & Conditions
          </CardTitle>
          <p className="text-muted-foreground">
            Please review and accept our terms to continue using Disha
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div className="space-y-4 text-sm text-foreground/80">
              <h3 className="font-semibold text-foreground">1. Acceptance of Terms</h3>
              <p>
                By accessing and using Disha, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              
              <h3 className="font-semibold text-foreground">2. Use License</h3>
              <p>
                Permission is granted to temporarily use Disha for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
              
              <h3 className="font-semibold text-foreground">3. Privacy Policy</h3>
              <p>
                We respect your privacy and are committed to protecting your personal data. Your information will be handled in accordance with our Privacy Policy.
              </p>
              
              <h3 className="font-semibold text-foreground">4. User Responsibilities</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
              
              <h3 className="font-semibold text-foreground">5. Limitation of Liability</h3>
              <p>
                Disha shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
              </p>
              
              <h3 className="font-semibold text-foreground">6. Modifications</h3>
              <p>
                Disha reserves the right to revise these terms at any time without notice. By using this service, you are agreeing to be bound by the current version of these terms.
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms-acceptance"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked as boolean)}
                className="mt-1"
              />
              <label 
                htmlFor="terms-acceptance" 
                className="text-sm text-foreground leading-relaxed cursor-pointer"
              >
                I have read and accept the Terms & Conditions and Privacy Policy
              </label>
            </div>
            
            <Button
              onClick={handleAccept}
              disabled={!accepted || loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Processing..." : "Accept & Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms;