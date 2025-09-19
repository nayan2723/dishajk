import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizAnswer, QuizResult, UserProfile } from '../types';
import { quizQuestions, courseRecommendations } from '../data/quizData';
import { vocationalCourses } from '../data/jkData';
import { supabase } from '@/integrations/supabase/client';

interface QuizState {
  currentQuestion: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  result: QuizResult | null;
}

type QuizAction =
  | { type: 'ANSWER_QUESTION'; payload: QuizAnswer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ' };

const initialState: QuizState = {
  currentQuestion: 0,
  answers: [],
  isComplete: false,
  result: null,
};

const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  calculateResult: () => Promise<QuizResult>;
} | null>(null);

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'ANSWER_QUESTION':
      const existingAnswerIndex = state.answers.findIndex(
        a => a.questionId === action.payload.questionId
      );
      let newAnswers;
      if (existingAnswerIndex >= 0) {
        newAnswers = [...state.answers];
        newAnswers[existingAnswerIndex] = action.payload;
      } else {
        newAnswers = [...state.answers, action.payload];
      }
      return { ...state, answers: newAnswers };
    
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestion: Math.min(state.currentQuestion + 1, quizQuestions.length - 1),
      };
    
    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestion: Math.max(state.currentQuestion - 1, 0),
      };
    
    case 'COMPLETE_QUIZ':
      return { ...state, isComplete: true };
    
    case 'RESET_QUIZ':
      return initialState;
    
    default:
      return state;
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const calculateResult = async (): Promise<QuizResult> => {
    // Extract user profile from answers
    let userProfile: UserProfile = {
      stream: 'Science',
      location: '',
      district: '',
      futureGoals: 'higher_studies'
    };

    let areaType = 'Urban';
    let ownership = 'Government';
    let preferredStream = 'Science';
    let marksRange = 'Above 90';

    // Process quiz answers
    state.answers.forEach(answer => {
      const question = quizQuestions.find(q => q.id === answer.questionId);
      if (!question) return;

      switch (question.id) {
        case 1: // Area type
          areaType = question.options![answer.selectedOption];
          break;
        case 2: // Ownership preference
          ownership = question.options![answer.selectedOption];
          break;
        case 3: // Stream preference
          preferredStream = question.options![answer.selectedOption];
          userProfile.stream = preferredStream as 'Science' | 'Commerce' | 'Arts';
          break;
        case 4: // 12th marks
          marksRange = question.options![answer.selectedOption];
          break;
        case 5: // District
          userProfile.district = answer.value || '';
          userProfile.location = answer.value || '';
          break;
      }
    });

    // Determine recommended stream based on marks and preference
    let stream: 'Science' | 'Commerce' | 'Arts' = preferredStream as 'Science' | 'Commerce' | 'Arts';
    let score = 85; // Base score

    // Adjust score based on marks
    switch (marksRange) {
      case 'Above 90':
        score = 95;
        break;
      case '80-90':
        score = 85;
        break;
      case '70-80':
        score = 75;
        break;
      case 'Below 70':
        score = 65;
        break;
    }

    // Get recommendations based on stream
    let recommendations = courseRecommendations[stream] || [];

    // Fetch colleges from Supabase using direct query
    try {
      const response = await fetch(`https://iaenrgkstxjthwiecwli.supabase.co/rest/v1/colleges?select=*`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZW5yZ2tzdHhqdGh3aWVjd2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDQwMTIsImV4cCI6MjA3Mzg4MDAxMn0.U3hNv5emyHwxB2e7s4Juu1chE_pzV5On15lm0wwouwg',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZW5yZ2tzdHhqdGh3aWVjd2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDQwMTIsImV4cCI6MjA3Mzg4MDAxMn0.U3hNv5emyHwxB2e7s4Juu1chE_pzV5On15lm0wwouwg'
        }
      });
      const allColleges = await response.json();
      const error = !response.ok ? { message: 'Failed to fetch' } : null;

      if (error) {
        console.error('Error fetching colleges:', error);
        return {
          stream,
          score,
          recommendations,
          colleges: [],
          userProfile: { ...userProfile, stream }
        };
      }

      let filteredColleges = allColleges || [];

      // Filter by area type
      filteredColleges = filteredColleges.filter(college => 
        college['Urban/Rural Status'] === areaType
      );

      // Filter by ownership type
      filteredColleges = filteredColleges.filter(college => {
        const collegeType = college['Type'] || '';
        if (ownership === 'Government') {
          return collegeType.toLowerCase().includes('govt') || 
                 collegeType.toLowerCase().includes('government');
        } else {
          return collegeType.toLowerCase().includes('private') || 
                 collegeType.toLowerCase().includes('pvt');
        }
      });

      // Filter by district (if specified)
      if (userProfile.district) {
        const nearbyDistricts = getNearbyDistricts(userProfile.district);
        filteredColleges = filteredColleges.filter(college => 
          nearbyDistricts.includes(college['District'])
        );
      }

      // Filter by stream-relevant courses
      filteredColleges = filteredColleges.filter(college => {
        const courses = college['Courses Offered (Categorized Streams)'] || '';
        const coursesLower = courses.toLowerCase();
        
        switch (stream) {
          case 'Science':
            return coursesLower.includes('science') || 
                   coursesLower.includes('tech') || 
                   coursesLower.includes('mbbs') ||
                   coursesLower.includes('engineering');
          case 'Commerce':
            return coursesLower.includes('commerce') || 
                   coursesLower.includes('comm') || 
                   coursesLower.includes('mgt') ||
                   coursesLower.includes('management');
          case 'Arts':
            return coursesLower.includes('arts') || 
                   coursesLower.includes('law') ||
                   coursesLower.includes('humanities');
          default:
            return true;
        }
      });

      // If no colleges match all criteria, relax filters
      if (filteredColleges.length === 0) {
        filteredColleges = allColleges.filter(college => {
          const courses = college['Courses Offered (Categorized Streams)'] || '';
          const coursesLower = courses.toLowerCase();
          
          switch (stream) {
            case 'Science':
              return coursesLower.includes('science') || coursesLower.includes('tech');
            case 'Commerce':
              return coursesLower.includes('commerce') || coursesLower.includes('mgt');
            case 'Arts':
              return coursesLower.includes('arts');
            default:
              return true;
          }
        });
      }

      // Convert to the expected format
      const colleges = filteredColleges.slice(0, 5).map((college, index) => ({
        id: index + 1,
        name: college['College Name'] || 'Unknown College',
        location: college['District'] || 'Unknown',
        district: college['District'] || 'Unknown',
        type: college['Type'] || 'Unknown',
        courses: [college['Courses Offered (Categorized Streams)'] || 'General'],
        contact: college['Working College Link'] || 'No contact available',
        website: college['Working College Link'] || null,
        areaType: college['Urban/Rural Status'] || 'Unknown'
      }));

      const result: QuizResult = {
        stream,
        score,
        recommendations,
        colleges,
        userProfile: { ...userProfile, stream }
      };

      // Save quiz session to database
      try {
        const studentNameAnswer = state.answers.find(a => a.questionId === 6);
        const studentName = studentNameAnswer?.value || 'Anonymous Student';

        await supabase
          .from('quiz_sessions')
          .insert({
            student_name: studentName,
            location: userProfile.location,
            district: userProfile.district,
            stream: result.stream,
            score: result.score,
            quiz_answers: state.answers,
            user_profile: userProfile
          });
      } catch (error) {
        console.error('Error saving quiz session:', error);
      }

      return result;

    } catch (error) {
      console.error('Error in calculateResult:', error);
      return {
        stream,
        score,
        recommendations,
        colleges: [],
        userProfile: { ...userProfile, stream }
      };
    }
  };

  // Helper function to get nearby districts
  const getNearbyDistricts = (district: string): string[] => {
    const districtGroups = {
      'Srinagar': ['Srinagar', 'Budgam', 'Ganderbal', 'Pulwama'],
      'Jammu': ['Jammu', 'Samba', 'Kathua', 'Udhampur'],
      'Baramulla': ['Baramulla', 'Kupwara', 'Bandipora'],
      'Anantnag': ['Anantnag', 'Kulgam', 'Shopian', 'Pulwama'],
      'Budgam': ['Budgam', 'Srinagar', 'Ganderbal'],
      'Pulwama': ['Pulwama', 'Srinagar', 'Anantnag', 'Kulgam'],
      'Kathua': ['Kathua', 'Jammu', 'Samba', 'Udhampur'],
      'Udhampur': ['Udhampur', 'Jammu', 'Doda', 'Kathua']
    };
    
    return districtGroups[district] || [district];
  };

  return (
    <QuizContext.Provider value={{ state, dispatch, calculateResult }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}