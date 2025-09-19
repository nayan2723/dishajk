import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizAnswer, QuizResult, UserProfile, College } from '../types';
import { quizQuestions, courseRecommendations, colleges } from '../data/quizData';
import { jkColleges, vocationalCourses } from '../data/jkData';
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
    // Extract user preferences from answers
    let userProfile: UserProfile = {
      stream: 'Science',
      location: '',
      district: '',
      futureGoals: 'higher_studies'
    };

    let areaType = 'Urban'; // Rural/Urban
    let collegePreference = 'Government'; // Government/Private
    let preferredStream = 'Science'; // Arts/Commerce/Science
    let marks = 'Above 90'; // Marks range

    state.answers.forEach(answer => {
      const question = quizQuestions.find(q => q.id === answer.questionId);
      if (!question) return;

      switch (question.id) {
        case 1: // Area type
          areaType = answer.selectedOption === 0 ? 'Rural' : 'Urban';
          break;
        case 2: // College preference
          collegePreference = answer.selectedOption === 0 ? 'Government' : 'Private';
          break;
        case 3: // Preferred stream
          if (answer.selectedOption === 0) preferredStream = 'Arts';
          else if (answer.selectedOption === 1) preferredStream = 'Commerce';
          else if (answer.selectedOption === 2) preferredStream = 'Science';
          break;
        case 4: // 12th marks
          if (answer.selectedOption === 0) marks = 'Below 70';
          else if (answer.selectedOption === 1) marks = '70-80';
          else if (answer.selectedOption === 2) marks = '80-90';
          else if (answer.selectedOption === 3) marks = 'Above 90';
          break;
        case 5: // District
          userProfile.district = answer.value || '';
          userProfile.location = answer.value || '';
          break;
      }
    });

    // Set stream in userProfile
    userProfile.stream = preferredStream as 'Science' | 'Commerce' | 'Arts' | 'Vocational';

    // Calculate a score based on preferences (simple scoring)
    const baseScore = marks === 'Above 90' ? 90 : marks === '80-90' ? 80 : marks === '70-80' ? 70 : 60;

    // Get course recommendations
    const recommendations = courseRecommendations[preferredStream] || [];

    // Fetch colleges from Supabase database
    try {
      let query = supabase
        .from('colleges')
        .select('*');

      // Filter by area type
      query = query.eq('area_type', areaType);

      // Filter by ownership (college preference)
      query = query.eq('ownership', collegePreference);

      // Filter by district (nearby districts)
      if (userProfile.district) {
        const nearbyDistricts = getNearbyDistricts(userProfile.district);
        query = query.in('district', nearbyDistricts);
      }

      // Filter by streams offered (must include the preferred stream)
      query = query.contains('streams_offered', [preferredStream]);

      // Execute query
      const { data: colleges, error } = await query;

      if (error) {
        console.error('Error fetching colleges:', error);
        // Fallback to static data if database query fails
        return createFallbackResult(userProfile, preferredStream, baseScore, recommendations);
      }

      // Transform database colleges to match the expected format
      const transformedColleges = (colleges || []).map(college => ({
        id: college.id,
        name: college.college_name,
        location: college.district,
        district: college.district,
        type: college.ownership as 'Government' | 'Private',
        website: college.website,
        contact: 'Contact via website', // Placeholder since not in our schema
        courses: college.streams_offered,
        feeRange: college.fee_range_ug || 'Fee information not available'
      }));

      // If no colleges match all criteria, relax the filters
      let finalColleges = transformedColleges;
      if (finalColleges.length === 0) {
        // Try again with just district and stream filters
        const { data: relaxedColleges } = await supabase
          .from('colleges')
          .select('*')
          .contains('streams_offered', [preferredStream]);

        if (relaxedColleges) {
          finalColleges = relaxedColleges.map(college => ({
            id: college.id,
            name: college.college_name,
            location: college.district,
            district: college.district,
            type: college.ownership as 'Government' | 'Private',
            website: college.website,
            contact: 'Contact via website',
            courses: college.streams_offered,
            feeRange: college.fee_range_ug || 'Fee information not available'
          }));
        }
      }

      const result: QuizResult = {
        stream: preferredStream as 'Science' | 'Commerce' | 'Arts' | 'Vocational',
        score: baseScore,
        recommendations,
        colleges: finalColleges.slice(0, 8), // Limit to 8 colleges
        userProfile
      };

      return result;
    } catch (error) {
      console.error('Database connection error:', error);
      // Fallback to static data
      return createFallbackResult(userProfile, preferredStream, baseScore, recommendations);
    }
  };

  // Fallback function for when database is unavailable
  const createFallbackResult = (userProfile: UserProfile, stream: string, score: number, recommendations: any[]) => {
    // Create basic colleges as fallback (simplified)
    const fallbackColleges: College[] = [
      {
        id: 'fallback-1',
        name: 'Government Degree College Srinagar',
        location: 'Srinagar',
        district: 'Srinagar',
        type: 'Government',
        courses: ['Science', 'Commerce', 'Arts'],
        website: 'https://gdcsrinagar.edu.in',
        contact: 'Contact via website',
        feeRange: 'Rs. 5,000-15,000'
      },
      {
        id: 'fallback-2',
        name: 'Kashmir University',
        location: 'Srinagar',
        district: 'Srinagar', 
        type: 'Government',
        courses: ['Science', 'Commerce', 'Arts', 'Law', 'Engineering'],
        website: 'https://kashmiruniversity.net',
        contact: 'Contact via website',
        feeRange: 'Rs. 10,000-30,000'
      }
    ];

    return {
      stream: stream as 'Science' | 'Commerce' | 'Arts' | 'Vocational',
      score,
      recommendations,
      colleges: fallbackColleges,
      userProfile
    };
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