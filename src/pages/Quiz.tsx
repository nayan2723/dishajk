import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { quizQuestions } from '../data/quizData';
import QuizProgress from '../components/QuizProgress';
import { useToast } from '@/hooks/use-toast';
import StudentDetailsForm from '../components/StudentDetailsForm';
import Recommendations from './Recommendations';

const Quiz: React.FC = () => {
  const { state, dispatch } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [textInputValue, setTextInputValue] = useState('');
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const currentQuestion = quizQuestions[state.currentQuestion];
  const currentAnswer = state.answers.find(a => a.questionId === currentQuestion?.id);
  const isFirstQuestion = state.currentQuestion === 0;
  const isLastQuestion = state.currentQuestion === quizQuestions.length - 1;
  const canProceed = currentAnswer !== undefined;

  const handleAnswerChange = (value: string) => {
    const selectedOption = parseInt(value);
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: {
        questionId: currentQuestion.id,
        selectedOption,
      },
    });
  };

  const handleTextInputChange = (value: string) => {
    setTextInputValue(value);
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: {
        questionId: currentQuestion.id,
        selectedOption: 0, // Default value for text inputs
        value: value,
      },
    });
  };

  const handleNext = () => {
    if (!canProceed) {
      toast({
        title: "Please select an answer",
        description: "You need to choose an option before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (isLastQuestion) {
      // All questions answered, complete quiz and show student form
      if (state.answers.length === quizQuestions.length) {
        dispatch({ type: 'COMPLETE_QUIZ' });
        setShowStudentForm(true);
      } else {
        toast({
          title: "Complete all questions",
          description: "Please answer all questions before submitting.",
          variant: "destructive",
        });
      }
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  const handlePrevious = () => {
    dispatch({ type: 'PREVIOUS_QUESTION' });
  };

  const handleStudentFormSuccess = (studentId: string) => {
    // Store student ID for future use if needed
    console.log('Student saved with ID:', studentId);
    setShowStudentForm(false);
    setShowRecommendations(true);
  };

  // Show student details form after quiz completion
  if (showStudentForm) {
    return <StudentDetailsForm onSuccess={handleStudentFormSuccess} />;
  }

  // Show recommendations after student form completion
  if (showRecommendations) {
    return <Recommendations />;
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p>Loading quiz...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Career Assessment Quiz</h1>
          <p className="text-lg text-muted-foreground">
            Answer these questions honestly to get personalized career recommendations
          </p>
        </div>

        {/* Progress */}
        <QuizProgress 
          current={state.currentQuestion} 
          total={quizQuestions.length} 
        />

        {/* Question Card */}
        <Card className="card-gradient shadow-medium border-0 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl text-center">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {currentQuestion.type === 'multiple_choice' && (
              <RadioGroup
                value={currentAnswer?.selectedOption.toString() || ""}
                onValueChange={handleAnswerChange}
                className="space-y-4"
              >
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-smooth border border-transparent hover:border-primary/20">
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${index}`}
                      className="text-primary"
                    />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer text-sm md:text-base leading-relaxed"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === 'dropdown' && (
              <Select value={currentAnswer?.value || ""} onValueChange={handleTextInputChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your district" />
                </SelectTrigger>
                <SelectContent>
                  {currentQuestion.options?.map((option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {currentQuestion.type === 'input' && (
              <Input
                type="text"
                placeholder="Enter your answer"
                value={currentAnswer?.value || textInputValue}
                onChange={(e) => handleTextInputChange(e.target.value)}
                className="w-full"
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="text-sm text-muted-foreground">
            {state.answers.length} of {quizQuestions.length} answered
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex items-center space-x-2"
          >
            {isLastQuestion ? (
              <>
                <Send className="h-4 w-4" />
                <span>Submit</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Answer honestly for the most accurate recommendations. 
            There are no right or wrong answers - we're here to help you discover your strengths!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quiz;