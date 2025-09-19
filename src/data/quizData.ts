import { QuizQuestion, CourseRecommendation, College, StudentData } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What type of activities do you enjoy most?",
    options: [
      "Solving mathematical problems and puzzles",
      "Reading about business and economics", 
      "Creating art or writing stories",
      "Analyzing data and conducting experiments"
    ],
    category: 'interest',
    weight: 1.2
  },
  {
    id: 2,
    question: "Which subject do you find most engaging?",
    options: [
      "Physics and Mathematics",
      "Economics and Accounting",
      "Literature and History", 
      "Biology and Chemistry"
    ],
    category: 'interest',
    weight: 1.5
  },
  {
    id: 3,
    question: "What describes your learning style best?",
    options: [
      "Learning through experiments and practical work",
      "Understanding through case studies and real examples",
      "Learning through discussion and creative expression",
      "Memorizing facts and following step-by-step processes"
    ],
    category: 'learning',
    weight: 1.0
  },
  {
    id: 4,
    question: "Which career appeals to you most?",
    options: [
      "Engineer or Doctor",
      "Business Manager or Entrepreneur", 
      "Teacher or Social Worker",
      "Artist or Writer"
    ],
    category: 'interest',
    weight: 1.3
  },
  {
    id: 5,
    question: "What are your strongest skills?",
    options: [
      "Logical thinking and problem-solving",
      "Communication and leadership",
      "Creativity and imagination", 
      "Analysis and attention to detail"
    ],
    category: 'skill',
    weight: 1.1
  },
  {
    id: 6,
    question: "Which environment do you thrive in?",
    options: [
      "Laboratory or technical workspace",
      "Office or business environment",
      "Classroom or community center",
      "Studio or creative space"
    ],
    category: 'learning',
    weight: 1.0
  },
  {
    id: 7,
    question: "What motivates you most?",
    options: [
      "Discovering how things work",
      "Building successful ventures",
      "Helping others and making a difference",
      "Expressing yourself creatively"
    ],
    category: 'interest',
    weight: 1.2
  },
  {
    id: 8,
    question: "Which activity would you choose for a project?",
    options: [
      "Building a robot or conducting research",
      "Creating a business plan",
      "Organizing a community event", 
      "Making a documentary or artwork"
    ],
    category: 'skill',
    weight: 1.1
  }
];

export const courseRecommendations: Record<string, CourseRecommendation[]> = {
  Science: [
    {
      id: 1,
      name: "Computer Science Engineering",
      description: "Study of computational systems, programming, and software development",
      rationale: "Perfect match for your logical thinking and problem-solving abilities",
      duration: "4 years",
      scope: "Software development, AI/ML, cybersecurity, research"
    },
    {
      id: 2, 
      name: "Medicine (MBBS)",
      description: "Comprehensive medical education for healthcare professionals",
      rationale: "Ideal for your analytical skills and desire to help others",
      duration: "5.5 years",
      scope: "Clinical practice, surgery, research, public health"
    },
    {
      id: 3,
      name: "Biotechnology", 
      description: "Application of biological processes for technological advancement",
      rationale: "Combines your interest in science with practical applications",
      duration: "4 years",
      scope: "Pharmaceutical, agriculture, environmental solutions"
    }
  ],
  Commerce: [
    {
      id: 4,
      name: "Business Administration (BBA)",
      description: "Comprehensive business management and entrepreneurship program",
      rationale: "Matches your leadership skills and business acumen",
      duration: "3 years", 
      scope: "Management, consulting, entrepreneurship, finance"
    },
    {
      id: 5,
      name: "Chartered Accountancy (CA)",
      description: "Professional accounting and financial management qualification",
      rationale: "Perfect for your analytical and detail-oriented approach",
      duration: "3-5 years",
      scope: "Auditing, taxation, financial consulting, corporate finance"
    },
    {
      id: 6,
      name: "Economics Honours", 
      description: "Advanced study of economic principles and market dynamics",
      rationale: "Ideal for understanding business and policy decisions",
      duration: "3 years",
      scope: "Policy analysis, banking, research, consulting"
    }
  ],
  Arts: [
    {
      id: 7,
      name: "Psychology",
      description: "Study of human behavior and mental processes", 
      rationale: "Perfect for your empathy and desire to understand people",
      duration: "3 years",
      scope: "Counseling, research, HR, social work"
    },
    {
      id: 8,
      name: "Mass Communication",
      description: "Media, journalism, and communication studies",
      rationale: "Great fit for your communication and creative skills",
      duration: "3 years", 
      scope: "Journalism, advertising, PR, digital media"
    },
    {
      id: 9,
      name: "Social Work",
      description: "Community development and social welfare programs",
      rationale: "Matches your passion for helping others and social change", 
      duration: "3 years",
      scope: "NGOs, government programs, community development"
    }
  ]
};

export const colleges: College[] = [
  {
    id: 1,
    name: "Indian Institute of Technology (IIT) Delhi",
    location: "Delhi", 
    district: "New Delhi",
    state: "Delhi",
    type: "Government",
    courses: ["Computer Science Engineering", "Mechanical Engineering", "Electrical Engineering"],
    website: "https://www.iitd.ac.in/",
    contact: "admissions@iitd.ac.in"
  },
  {
    id: 2,
    name: "All India Institute of Medical Sciences (AIIMS)",
    location: "Delhi",
    district: "New Delhi", 
    state: "Delhi",
    type: "Government",
    courses: ["Medicine (MBBS)", "Nursing", "Biotechnology"],
    website: "https://www.aiims.edu/",
    contact: "info@aiims.edu"
  },
  {
    id: 3,
    name: "Shri Ram College of Commerce (SRCC)",
    location: "Delhi",
    district: "New Delhi",
    state: "Delhi", 
    type: "Government",
    courses: ["Business Administration (BBA)", "Economics Honours", "Commerce"],
    website: "https://www.srcc.du.ac.in/",
    contact: "principal@srcc.du.ac.in"
  },
  {
    id: 4,
    name: "Lady Shri Ram College",
    location: "Delhi",
    district: "New Delhi",
    state: "Delhi",
    type: "Government", 
    courses: ["Psychology", "Mass Communication", "Social Work"],
    website: "https://www.lsr.edu.in/",
    contact: "admission@lsr.edu.in"
  },
  {
    id: 5,
    name: "Jawaharlal Nehru University (JNU)",
    location: "Delhi",
    district: "New Delhi",
    state: "Delhi",
    type: "Government",
    courses: ["Psychology", "Social Work", "Economics Honours"],
    website: "https://www.jnu.ac.in/",
    contact: "registrar@jnu.ac.in"
  },
  {
    id: 6,
    name: "Delhi Technological University (DTU)",
    location: "Delhi", 
    district: "New Delhi",
    state: "Delhi",
    type: "Government",
    courses: ["Computer Science Engineering", "Biotechnology", "Engineering"],
    website: "https://www.dtu.ac.in/",
    contact: "info@dtu.ac.in"
  }
];

export const mockStudentData: StudentData[] = [
  { id: 1, name: "Raj Sharma", stream: "Science", district: "Mumbai", score: 85, completedAt: "2024-01-15" },
  { id: 2, name: "Priya Patel", stream: "Commerce", district: "Ahmedabad", score: 78, completedAt: "2024-01-16" },
  { id: 3, name: "Amit Kumar", stream: "Arts", district: "Delhi", score: 72, completedAt: "2024-01-17" },
  { id: 4, name: "Sneha Gupta", stream: "Science", district: "Pune", score: 88, completedAt: "2024-01-18" },
  { id: 5, name: "Rohit Singh", stream: "Commerce", district: "Bangalore", score: 80, completedAt: "2024-01-19" },
  { id: 6, name: "Kavya Reddy", stream: "Science", district: "Hyderabad", score: 92, completedAt: "2024-01-20" },
  { id: 7, name: "Arjun Mehta", stream: "Arts", district: "Chennai", score: 75, completedAt: "2024-01-21" },
  { id: 8, name: "Ananya Das", stream: "Commerce", district: "Kolkata", score: 83, completedAt: "2024-01-22" },
  { id: 9, name: "Vikram Joshi", stream: "Science", district: "Jaipur", score: 87, completedAt: "2024-01-23" },
  { id: 10, name: "Isha Agarwal", stream: "Arts", district: "Lucknow", score: 79, completedAt: "2024-01-24" }
];