import React from 'react';
import { SignUp } from "@clerk/clerk-react";
import { useTranslation } from 'react-i18next';

const SignUpPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('auth.joinDisha')}</h1>
          <p className="text-muted-foreground">{t('auth.signUpSubtitle')}</p>
        </div>
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-card border border-border shadow-lg rounded-lg",
                headerTitle: "text-foreground",
                headerSubtitle: "text-muted-foreground",
                socialButtonsBlockButton: "bg-background border-border text-foreground hover:bg-accent",
                formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                footerActionLink: "text-primary hover:text-primary/80",
                identityPreviewEditButton: "text-primary hover:text-primary/80",
                formFieldInput: "bg-background border-border text-foreground focus:border-primary",
                formFieldLabel: "text-foreground",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground",
                otpCodeFieldInput: "bg-background border-border text-foreground focus:border-primary"
              }
            }}
            redirectUrl="/terms"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;