export const jkDistricts = [
  "Srinagar", "Jammu", "Baramulla", "Budgam", "Pulwama", "Anantnag", "Bandipora", 
  "Ganderbal", "Kulgam", "Shopian", "Kupwara", "Kathua", "Udhampur", "Doda", 
  "Ramban", "Kishtwar", "Poonch", "Rajouri", "Reasi", "Samba"
];

export const jkColleges = [
  // Srinagar District
  {
    id: 1,
    name: "University of Kashmir",
    location: "Hazratbal",
    district: "Srinagar",
    state: "Jammu & Kashmir",
    type: "Government" as const,
    courses: ["B.Sc", "B.Com", "B.A", "BBA", "BCA", "B.Tech", "MBBS"],
    website: "https://www.kashmiruniversity.net",
    contact: "0194-2420076",
    details: {
      established: "1948",
      accreditation: "NAAC A+",
      specializations: ["Science", "Commerce", "Arts", "Engineering", "Medical"]
    }
  },
  {
    id: 2,
    name: "Government College for Women MA Road",
    location: "MA Road",
    district: "Srinagar",
    state: "Jammu & Kashmir",
    type: "Government" as const,
    courses: ["B.A", "B.Com", "B.Sc", "M.A", "M.Com"],
    website: "https://gcwmaroad.edu.in",
    contact: "0194-2479820"
  },
  {
    id: 3,
    name: "SP College Srinagar",
    location: "Gogji Bagh",
    district: "Srinagar",
    state: "Jammu & Kashmir",
    type: "Government" as const,
    courses: ["B.A", "B.Com", "B.SC", "M.A", "M.Com", "M.Sc"],
    contact: "0194-2311628"
  },
  
  // Jammu District
  {
    id: 4,
    name: "University of Jammu",
    location: "Jammu",
    district: "Jammu",
    state: "Jammu & Kashmir",
    type: "Government" as const,
    courses: ["B.Sc", "B.Com", "B.A", "BBA", "BCA", "B.Tech", "MBBS", "LLB"],
    website: "https://www.jammuuniversity.ac.in",
    contact: "0191-2435402"
  },
  {
    id: 5,
    name: "Government College of Engineering and Technology",
    location: "Chak Bhalwal",
    district: "Jammu",
    state: "Jammu & Kashmir", 
    type: "Government" as const,
    courses: ["B.Tech", "M.Tech"],
    website: "https://www.gcetjammu.ac.in",
    contact: "0191-2560618"
  },
  {
    id: 6,
    name: "Government Medical College Jammu",
    location: "Sector-3 Bhagwati Nagar",
    district: "Jammu",
    state: "Jammu & Kashmir",
    type: "Government" as const,
    courses: ["MBBS", "MD", "MS"],
    website: "https://www.gmcjammu.nic.in",
    contact: "0191-2538078"
  },

  // Baramulla District  
  {
    id: 7,
    name: "Government Degree College Baramulla",
    location: "Baramulla",
    district: "Baramulla",
    state: "Jammu & Kashmir",
    type: "Government" as const,
    courses: ["B.A", "B.Com", "B.Sc", "BCA"],
    contact: "01952-232406"
  },

  // Budgam District
  {
    id: 8,
    name: "Government Degree College Budgam",
    location: "Budgam",
    district: "Budgam", 
    state: "Jammu & Kashmir",
    type: "Government" as const,
    courses: ["B.A", "B.Com", "B.Sc"],
    contact: "01951-255208"
  },

  // Anantnag District
  {
    id: 9,
    name: "Government Degree College Anantnag",
    location: "Anantnag",
    district: "Anantnag",
    state: "Jammu & Kashmir", 
    type: "Government" as const,
    courses: ["B.A", "B.Com", "B.Sc", "BBA"],
    contact: "01932-227424"
  },

  // Pulwama District
  {
    id: 10,
    name: "Government Degree College Pulwama",
    location: "Pulwama",
    district: "Pulwama",
    state: "Jammu & Kashmir",
    type: "Government" as const,
    courses: ["B.A", "B.Com", "B.Sc"],
    contact: "01931-260208"
  },

  // Kathua District
  {
    id: 11,
    name: "Government Degree College Kathua",
    location: "Kathua",
    district: "Kathua",
    state: "Jammu & Kashmir",
    type: "Government" as const,
    courses: ["B.A", "B.Com", "B.Sc", "BCA"],
    contact: "01922-232147"
  },

  // Udhampur District
  {
    id: 12,
    name: "Government Degree College Udhampur",
    location: "Udhampur",
    district: "Udhampur",
    state: "Jammu & Kashmir",
    type: "Government" as const,
    courses: ["B.A", "B.Com", "B.Sc"],
    contact: "01992-270393"
  },

  // Private Colleges
  {
    id: 13,
    name: "Lovely Professional University Jammu Campus",
    location: "Jammu",
    district: "Jammu",
    state: "Jammu & Kashmir",
    type: "Private" as const,
    courses: ["B.Tech", "BBA", "BCA", "B.Com", "B.Sc"],
    website: "https://www.lpu.in",
    contact: "0191-3500100"
  },
  {
    id: 14,
    name: "Shri Mata Vaishno Devi University",
    location: "Katra",
    district: "Reasi",
    state: "Jammu & Kashmir",
    type: "Government" as const,
    courses: ["B.Tech", "B.Sc", "BBA", "BCA", "MBA"],
    website: "https://www.smvdu.ac.in",
    contact: "01991-285524"
  }
];

export const vocationalCourses = [
  {
    id: 30,
    name: "Handicrafts & Traditional Arts",
    description: "Learn traditional Kashmiri crafts including carpet weaving, wood carving, and papier-mâché",
    rationale: "J&K has a rich tradition of handicrafts with strong market demand",
    duration: "1-2 years",
    scope: "Local artisan, export business, tourism industry"
  },
  {
    id: 31,
    name: "Tourism & Hospitality Management", 
    description: "Specialization in adventure tourism, hotel management, and travel services",
    rationale: "J&K's tourism industry offers excellent career opportunities",
    duration: "2-3 years",
    scope: "Hotel industry, tour operations, adventure tourism"
  },
  {
    id: 32,
    name: "Horticulture & Agriculture",
    description: "Focus on apple cultivation, saffron farming, and modern agricultural techniques",
    rationale: "J&K's climate is perfect for specialized horticulture and agriculture",
    duration: "2-4 years", 
    scope: "Farming, agribusiness, food processing, export"
  },
  {
    id: 33,
    name: "IT & Digital Services",
    description: "Web development, digital marketing, and IT services",
    rationale: "Growing digital economy provides remote work opportunities",
    duration: "1-2 years",
    scope: "IT companies, freelancing, digital marketing agencies"
  }
];

export const mockStudentData = [
  { id: 1, name: "Aamir Khan", stream: "Science", district: "Srinagar", score: 85, completedAt: "2024-01-15" },
  { id: 2, name: "Priya Sharma", stream: "Commerce", district: "Jammu", score: 78, completedAt: "2024-01-16" },
  { id: 3, name: "Rahul Gupta", stream: "Arts", district: "Baramulla", score: 72, completedAt: "2024-01-17" },
  { id: 4, name: "Saira Bano", stream: "Science", district: "Budgam", score: 88, completedAt: "2024-01-18" },
  { id: 5, name: "Arjun Singh", stream: "Vocational", district: "Anantnag", score: 75, completedAt: "2024-01-19" },
  { id: 6, name: "Fatima Ali", stream: "Commerce", district: "Pulwama", score: 82, completedAt: "2024-01-20" },
  { id: 7, name: "Vikram Pandit", stream: "Science", district: "Kathua", score: 90, completedAt: "2024-01-21" },
  { id: 8, name: "Zara Sheikh", stream: "Arts", district: "Udhampur", score: 79, completedAt: "2024-01-22" },
  { id: 9, name: "Rohit Kumar", stream: "Vocational", district: "Srinagar", score: 73, completedAt: "2024-01-23" },
  { id: 10, name: "Mehak Devi", stream: "Science", district: "Jammu", score: 86, completedAt: "2024-01-24" }
];