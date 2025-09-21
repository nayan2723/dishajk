import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StudentData {
  name: string;
  location: string;
  phone: string;
}

const StudentDetailsForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StudentData>({
    name: '',
    location: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({ title: "Validation Error", description: "Name is required", variant: "destructive" });
      return false;
    }
    if (!formData.location.trim()) {
      toast({ title: "Validation Error", description: "Location is required", variant: "destructive" });
      return false;
    }
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      toast({ title: "Validation Error", description: "Phone number must be at least 10 digits", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          name: formData.name.trim(),
          location: formData.location.trim(),
          phone: formData.phone.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      toast({ title: "Success", description: "Details saved successfully!", variant: "default" });

      // Redirect to /recommendations
      navigate('/recommendations');
    } catch (error) {
      console.error('Error saving student details:', error);
      toast({ title: "Error", description: "Failed to save details. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Student Details</CardTitle>
          <p className="text-muted-foreground">Please provide your details to continue</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" type="text" placeholder="Enter your location" value={formData.location} onChange={e => handleInputChange('location', e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+91 7979797979" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} required />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetailsForm;
