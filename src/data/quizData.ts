import { QuizQuestion, CourseRecommendation, College } from '../types';
import { jkDistricts } from './jkData';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What type of subjects interest you the most?",
    options: [
      "Physics, Chemistry, Mathematics, Biology",
      "Business Studies, Economics, Accountancy", 
      "History, Literature, Psychology, Sociology",
      "Computer Science, Technology, Innovation"
    ],
    category: 'interest',
    weight: 1.5,
    type: 'multiple_choice'
  },
  {
    id: 2,
    question: "Which activity do you enjoy most in your free time?",
    options: [
      "Solving puzzles, experiments, reading science magazines",
      "Managing money, planning events, following market trends",
      "Reading books, writing, painting, music",
      "Learning new skills, hands-on work, creating things"
    ],
    category: 'interest',
    weight: 1.2,
    type: 'multiple_choice'
  },
  {
    id: 3,
    question: "How do you prefer to learn new concepts?",
    options: [
      "Through experiments and practical demonstrations",
      "Through case studies and real-world examples",
      "Through discussions, stories, and creative expression",
      "Through hands-on practice and skill development"
    ],
    category: 'learning',
    weight: 1.0,
    type: 'multiple_choice'
  },
  {
    id: 4,
    question: "What kind of career environment appeals to you?",
    options: [
      "Research labs, hospitals, engineering firms",
      "Corporate offices, banks, business organizations",
      "Museums, media houses, NGOs, cultural centers",
      "Workshops, studios, field work, practical settings"
    ],
    category: 'interest',
    weight: 1.3,
    type: 'multiple_choice'
  },
  {
    id: 5,
    question: "Which of these skills do you feel strongest in?",
    options: [
      "Logical reasoning, analytical thinking, problem-solving",
      "Communication, leadership, numerical ability",
      "Creativity, empathy, language skills",
      "Practical skills, adaptability, quick learning"
    ],
    category: 'skill',
    weight: 1.4,
    type: 'multiple_choice'
  },
  {
    id: 6,
    question: "What motivates you to study harder?",
    options: [
      "Understanding how things work, discovering new facts",
      "Achieving financial success and career growth",
      "Making a positive impact on society and culture", 
      "Developing practical skills for immediate use"
    ],
    category: 'learning',
    weight: 1.1,
    type: 'multiple_choice'
  },
  {
    id: 7,
    question: "Which type of projects excite you most?",
    options: [
      "Science fair projects, research work, technical innovations",
      "Business plans, marketing campaigns, financial analysis",
      "Art exhibitions, social awareness campaigns, creative writing",
      "Skill-based workshops, practical demonstrations, DIY projects"
    ],
    category: 'interest',
    weight: 1.2,
    type: 'multiple_choice'
  },
  {
    id: 8,
    question: "How do you handle complex problems?",
    options: [
      "Break them down systematically and find logical solutions",
      "Look for practical approaches and cost-effective solutions",
      "Consider multiple perspectives and creative alternatives",
      "Focus on immediate, practical solutions that work"
    ],
    category: 'skill',
    weight: 1.0,
    type: 'multiple_choice'
  },
  {
    id: 9,
    question: "Which stream are you most interested in?",
    options: [
      "Science (PCM/PCB)",
      "Commerce (Business/Economics)",
      "Arts/Humanities",
      "Vocational/Skill-based courses"
    ],
    category: 'profile',
    weight: 2.0,
    type: 'multiple_choice'
  },
  {
    id: 10,
    question: "Which district are you from in Jammu & Kashmir?",
    options: jkDistricts,
    category: 'profile',
    weight: 0.5,
    type: 'dropdown'
  },
  {
    id: 11,
    question: "What are your future career goals?",
    options: [
      "Pursue higher studies (Engineering, Medical, etc.)",
      "Government jobs (Civil Services, Banking, Teaching)",
      "Private sector jobs (Corporate, IT, Business)",
      "Skill-based careers (Entrepreneurship, Crafts, Tourism)"
    ],
    category: 'profile',
    weight: 1.5,
    type: 'multiple_choice'
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