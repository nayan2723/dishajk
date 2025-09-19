import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizAnswer, QuizResult, UserProfile } from '../types';
import { quizQuestions, courseRecommendations, colleges } from '../data/quizData';
import { jkColleges, vocationalCourses } from '../data/jkData';

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
  calculateResult: () => QuizResult;
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

  const calculateResult = (): QuizResult => {
    // Simple scoring algorithm
    let scienceScore = 0;
    let commerceScore = 0;
    let artsScore = 0;
    let vocationalScore = 0;

    // Extract user profile from answers
    let userProfile: UserProfile = {
      stream: 'Science',
      location: '',
      district: '',
      futureGoals: 'higher_studies'
    };

    state.answers.forEach(answer => {
      const question = quizQuestions.find(q => q.id === answer.questionId);
      if (!question) return;

      const weight = question.weight;
      
      // Handle profile questions separately
      if (question.category === 'profile') {
        switch (question.id) {
          case 9: // Stream preference
            if (answer.selectedOption === 0) userProfile.stream = 'Science';
            else if (answer.selectedOption === 1) userProfile.stream = 'Commerce'; 
            else if (answer.selectedOption === 2) userProfile.stream = 'Arts';
            else if (answer.selectedOption === 3) userProfile.stream = 'Vocational';
            break;
          case 10: // District
            userProfile.district = answer.value || '';
            userProfile.location = answer.value || '';
            break;
          case 11: // Future goals
            if (answer.selectedOption === 0) userProfile.futureGoals = 'higher_studies';
            else if (answer.selectedOption === 1) userProfile.futureGoals = 'government_jobs';
            else if (answer.selectedOption === 2) userProfile.futureGoals = 'private_sector';
            else if (answer.selectedOption === 3) userProfile.futureGoals = 'skill_based';
            break;
        }
        return;
      }
      
      // Score based on answer patterns for other questions
      switch (answer.selectedOption) {
        case 0: // Usually science-oriented
          scienceScore += 10 * weight;
          break;
        case 1: // Usually commerce-oriented  
          commerceScore += 10 * weight;
          break;
        case 2: // Usually arts-oriented
          artsScore += 10 * weight;
          break;
        case 3: // Mixed or vocational
          vocationalScore += 8 * weight;
          scienceScore += 3 * weight;
          break;
      }
    });

    let stream: 'Science' | 'Commerce' | 'Arts' | 'Vocational';
    let score: number;

    // Use explicit stream preference if provided, otherwise use calculated scores
    if (userProfile.stream !== 'Science' || scienceScore === 0) {
      stream = userProfile.stream;
      score = Math.max(scienceScore, commerceScore, artsScore, vocationalScore);
    } else if (scienceScore >= commerceScore && scienceScore >= artsScore && scienceScore >= vocationalScore) {
      stream = 'Science';
      score = scienceScore;
    } else if (commerceScore >= artsScore && commerceScore >= vocationalScore) {
      stream = 'Commerce'; 
      score = commerceScore;
    } else if (vocationalScore >= artsScore) {
      stream = 'Vocational';
      score = vocationalScore;
    } else {
      stream = 'Arts';
      score = artsScore;
    }

    // Get recommendations
    let recommendations = courseRecommendations[stream] || [];
    if (stream === 'Vocational') {
      recommendations = vocationalCourses;
    }

    // Filter colleges by district and courses
    let relevantColleges = [...jkColleges];
    
    // Filter by district if specified
    if (userProfile.district) {
      const nearbyDistricts = getNearbyDistricts(userProfile.district);
      relevantColleges = relevantColleges.filter(college => 
        nearbyDistricts.includes(college.district)
      );
    }
    
    // Filter by stream-relevant courses
    relevantColleges = relevantColleges.filter(college => 
      college.courses.some(course => 
        recommendations.some(rec => 
          course.toLowerCase().includes(rec.name.toLowerCase().split(' ')[0].toLowerCase()) ||
          rec.name.toLowerCase().includes(course.toLowerCase().split(' ')[0])
        )
      )
    );

    // If no relevant colleges found, show all J&K colleges
    if (relevantColleges.length === 0) {
      relevantColleges = jkColleges;
    }

    const result: QuizResult = {
      stream,
      score: Math.round(score),
      recommendations,
      colleges: relevantColleges.slice(0, 8), // Limit to 8 colleges
      userProfile: { ...userProfile, stream }
    };

    return result;
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