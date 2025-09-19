import { QuizQuestion, CourseRecommendation, College } from '../types';
import { jkDistricts } from './jkData';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is your area type?",
    options: ["Rural", "Urban"],
    category: 'profile',
    weight: 0.5,
    type: 'multiple_choice'
  },
  {
    id: 2,
    question: "What is your college preference?",
    options: ["Government", "Private"],
    category: 'profile',
    weight: 1.0,
    type: 'multiple_choice'
  },
  {
    id: 3,
    question: "What is your preferred stream?",
    options: ["Arts", "Commerce", "Science"],
    category: 'profile',
    weight: 2.0,
    type: 'multiple_choice'
  },
  {
    id: 4,
    question: "What are your 12th class marks?",
    options: ["Below 70", "70-80", "80-90", "Above 90"],
    category: 'skill',
    weight: 1.5,
    type: 'multiple_choice'
  },
  {
    id: 5,
    question: "Which district are you from in Jammu & Kashmir?",
    options: jkDistricts,
    category: 'profile',
    weight: 0.5,
    type: 'dropdown'
  }
];

export const courseRecommendations: Record<string, CourseRecommendation[]> = {
  Science: [
    {
      id: 1,
      name: "B.Tech/Engineering",
      description: "Four-year technical degree in various engineering disciplines",
      rationale: "Your analytical thinking and problem-solving skills make you ideal for engineering",
      duration: "4 years",
      scope: "Software companies, government jobs, higher studies, entrepreneurship"
    },
    {
      id: 2,
      name: "MBBS/Medical",
      description: "Medical degree for aspiring doctors and healthcare professionals",
      rationale: "Your scientific aptitude and interest in helping others suit medical field",
      duration: "5.5 years",
      scope: "Hospitals, private practice, government health services, research"
    },
    {
      id: 3,
      name: "B.Sc (Physics/Chemistry/Biology)",
      description: "Bachelor's degree in pure sciences with research opportunities",
      rationale: "Perfect for deep scientific understanding and research career",
      duration: "3 years",
      scope: "Research, teaching, higher studies, scientific organizations"
    }
  ],
  Commerce: [
    {
      id: 10,
      name: "B.Com/BBA",
      description: "Business and commerce degree with practical business knowledge",
      rationale: "Your interest in business and numerical skills make this ideal",
      duration: "3 years", 
      scope: "Banking, finance, business management, government jobs"
    },
    {
      id: 11,
      name: "CA/CS/CMA",
      description: "Professional courses in accounting, company secretarial, or cost management",
      rationale: "High-demand professional courses with excellent career prospects",
      duration: "3-4 years",
      scope: "Accounting firms, corporate sector, self-practice, consultancy"
    },
    {
      id: 12,
      name: "BCA/IT",
      description: "Computer applications and IT-focused business degree",
      rationale: "Combines your business acumen with growing IT sector opportunities",
      duration: "3 years",
      scope: "IT companies, software development, digital marketing, e-commerce"
    }
  ],
  Arts: [
    {
      id: 20,
      name: "B.A (English/History/Psychology)",
      description: "Liberal arts education with focus on humanities and social sciences",
      rationale: "Your creative thinking and communication skills are perfect for humanities",
      duration: "3 years",
      scope: "Civil services, journalism, teaching, social work, research"
    },
    {
      id: 21,
      name: "Mass Communication/Journalism",
      description: "Media and communication studies for journalism and media careers",
      rationale: "Your language skills and social awareness make you suited for media",
      duration: "3 years",
      scope: "Newspapers, TV channels, digital media, public relations, advertising"
    },
    {
      id: 22,
      name: "Social Work/NGO Management",
      description: "Focus on social development and community service",
      rationale: "Your empathy and desire to help society align with social work",
      duration: "3 years",
      scope: "NGOs, government social schemes, community development, counseling"
    }
  ]
};

export const colleges: College[] = [
  // This will be replaced by jkColleges in the context
];