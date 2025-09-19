import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizAnswer, QuizResult } from '../types';
import { quizQuestions, courseRecommendations, colleges } from '../data/quizData';

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

    state.answers.forEach(answer => {
      const question = quizQuestions.find(q => q.id === answer.questionId);
      if (!question) return;

      const weight = question.weight;
      
      // Score based on answer patterns
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
        case 3: // Mixed or alternate science
          scienceScore += 5 * weight;
          artsScore += 3 * weight;
          break;
      }
    });

    let stream: 'Science' | 'Commerce' | 'Arts';
    let score: number;

    if (scienceScore >= commerceScore && scienceScore >= artsScore) {
      stream = 'Science';
      score = scienceScore;
    } else if (commerceScore >= artsScore) {
      stream = 'Commerce'; 
      score = commerceScore;
    } else {
      stream = 'Arts';
      score = artsScore;
    }

    // Get recommendations and colleges for the determined stream
    const recommendations = courseRecommendations[stream] || [];
    const relevantColleges = colleges.filter(college => 
      college.courses.some(course => 
        recommendations.some(rec => rec.name === course)
      )
    );

    const result: QuizResult = {
      stream,
      score: Math.round(score),
      recommendations,
      colleges: relevantColleges,
    };

    return result;
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