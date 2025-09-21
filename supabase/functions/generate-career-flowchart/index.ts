import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY is not set');
    }

    const { quizData, userProfile } = await req.json();
    console.log('Received request with quiz data:', quizData);
    console.log('User profile:', userProfile);

    // Construct the prompt for Gemini
    const prompt = `
You are a career counselor creating a detailed, interactive career roadmap for a student in Jammu & Kashmir, India.

Student Profile:
- Stream: ${quizData.stream}
- Location: ${userProfile.location}, ${userProfile.district}
- Future Goals: ${userProfile.futureGoals}
- Assessment Score: ${quizData.score}/100

Based on this profile, generate a comprehensive JSON response with this EXACT structure:
{
  "title": "Career Roadmap for ${quizData.stream} Stream",
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "label": "Your Current Position",
      "description": "Brief description of where the student is now",
      "timeline": "Present",
      "skills": ["skill1", "skill2", "skill3"],
      "resources": ["resource1", "resource2"]
    },
    {
      "id": "courses",
      "type": "course", 
      "label": "Recommended Courses",
      "description": "Best courses for your stream",
      "options": [
        {
          "name": "Course Name 1",
          "duration": "3-4 years",
          "description": "Detailed course description",
          "skills_required": ["skill1", "skill2"],
          "sector": "Technology/Healthcare/Business/etc"
        }
      ]
    },
    {
      "id": "education",
      "type": "education",
      "label": "Higher Education Path",
      "description": "Advanced education opportunities", 
      "options": [
        {
          "name": "Masters/Specialization",
          "duration": "2 years",
          "description": "Specialization description",
          "skills_required": ["advanced skill1", "advanced skill2"]
        }
      ]
    },
    {
      "id": "careers", 
      "type": "career",
      "label": "Career Opportunities",
      "description": "Professional career paths",
      "options": [
        {
          "name": "Job Title 1",
          "sector": "Industry sector",
          "description": "Job role description",
          "salary_range": "₹X-Y LPA",
          "skills_required": ["professional skill1", "skill2"]
        }
      ]
    }
  ],
  "connections": [
    {"from": "start", "to": "courses"},
    {"from": "courses", "to": "education"},
    {"from": "education", "to": "careers"}
  ]
}

Requirements:
- Include 4-6 course options relevant to ${quizData.stream} stream
- Include 3-4 higher education options  
- Include 5-7 specific career opportunities with realistic salary ranges for J&K
- All content should be specific to Jammu & Kashmir opportunities
- Use realistic Indian salary ranges (LPA format)
- Focus on practical, actionable advice
- Include government job opportunities if future goal is "government_jobs"
- Be specific about local colleges and opportunities in J&K

Respond with valid JSON only, no additional text.`;

    console.log('Sending request to Gemini API...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 2000,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const geminiData = await response.json();
    console.log('Gemini API response:', JSON.stringify(geminiData, null, 2));

    if (!geminiData.candidates || !geminiData.candidates[0] || !geminiData.candidates[0].content) {
      throw new Error('Invalid response structure from Gemini API');
    }

    const generatedText = geminiData.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    let flowchartData;
    
    try {
      // Try to parse the JSON response from Gemini
      flowchartData = JSON.parse(generatedText);
      console.log('Successfully parsed AI flowchart data');
    } catch (parseError) {
      console.log('AI response is not valid JSON, creating fallback structure');
      
      // Fallback structure if AI doesn't return valid JSON
      flowchartData = {
        title: `Career Roadmap for ${quizData.stream} Stream`,
        nodes: [
          {
            id: "start",
            type: "start",
            label: "Your Current Position",
            description: `Currently completed ${quizData.stream} stream assessment with ${quizData.score}/100 score`,
            timeline: "Present",
            skills: ["Critical Thinking", "Problem Solving", "Communication"],
            resources: ["Career Counseling", "Online Learning Platforms", "Skill Assessment Tools"]
          },
          {
            id: "courses",
            type: "course",
            label: "Recommended Courses",
            description: `Best courses based on your ${quizData.stream} stream preference`,
            options: quizData.recommendations.slice(0, 5).map(course => ({
              name: course.name,
              duration: course.duration || "3-4 years",
              description: course.description,
              skills_required: ["Analytical Skills", "Technical Skills", "Communication"],
              sector: quizData.stream === 'Science' ? 'Technology/Healthcare' :
                     quizData.stream === 'Commerce' ? 'Business/Finance' : 'Arts/Humanities'
            }))
          },
          {
            id: "education",
            type: "education",
            label: "Higher Education Path",
            description: "Advanced education opportunities for career growth",
            options: [
              {
                name: quizData.stream === 'Science' ? 'Master of Technology' : 
                      quizData.stream === 'Commerce' ? 'Master of Business Administration' : 
                      'Master of Arts',
                duration: "2 years",
                description: "Advanced specialization for leadership roles",
                skills_required: ["Research Skills", "Leadership", "Specialization Knowledge"]
              },
              {
                name: "Professional Certification",
                duration: "6 months - 1 year",
                description: "Industry-recognized certifications for skill enhancement",
                skills_required: ["Industry Knowledge", "Practical Application", "Continuous Learning"]
              }
            ]
          },
          {
            id: "careers",
            type: "career",
            label: "Career Opportunities",
            description: "Professional career paths in J&K and beyond",
            options: quizData.stream === 'Science' ? [
              { 
                name: "Software Engineer", 
                sector: "Technology", 
                description: "Develop software applications and systems",
                salary_range: "₹4-15 LPA",
                skills_required: ["Programming", "Problem Solving", "System Design"]
              },
              { 
                name: "Data Scientist", 
                sector: "Analytics", 
                description: "Analyze data for business insights",
                salary_range: "₹6-20 LPA",
                skills_required: ["Statistics", "Machine Learning", "Data Analysis"]
              },
              { 
                name: "Government Technical Officer", 
                sector: "Government", 
                description: "Technical roles in J&K government departments",
                salary_range: "₹3-8 LPA",
                skills_required: ["Technical Knowledge", "Public Service", "Administration"]
              }
            ] : quizData.stream === 'Commerce' ? [
              { 
                name: "Financial Analyst", 
                sector: "Finance", 
                description: "Analyze financial data and investments",
                salary_range: "₹3-12 LPA",
                skills_required: ["Financial Analysis", "Market Research", "Risk Assessment"]
              },
              { 
                name: "Business Manager", 
                sector: "Management", 
                description: "Lead teams and business operations",
                salary_range: "₹5-18 LPA",
                skills_required: ["Leadership", "Strategic Planning", "Team Management"]
              },
              { 
                name: "Banking Officer", 
                sector: "Banking", 
                description: "Banking and financial services in J&K",
                salary_range: "₹3-10 LPA",
                skills_required: ["Banking Operations", "Customer Service", "Financial Products"]
              }
            ] : [
              { 
                name: "Civil Services Officer (IAS/KAS)", 
                sector: "Government", 
                description: "Administrative services for J&K development",
                salary_range: "₹5-25 LPA",
                skills_required: ["Administration", "Public Policy", "Leadership"]
              },
              { 
                name: "Teacher/Professor", 
                sector: "Education", 
                description: "Educator in schools/colleges in J&K",
                salary_range: "₹2-8 LPA",
                skills_required: ["Subject Knowledge", "Communication", "Student Guidance"]
              },
              { 
                name: "Social Development Officer", 
                sector: "NGO/Development", 
                description: "Community development and social work",
                salary_range: "₹2-6 LPA",
                skills_required: ["Community Engagement", "Project Management", "Social Awareness"]
              }
            ]
          }
        ],
        connections: [
          { from: "start", to: "courses" },
          { from: "courses", to: "education" },
          { from: "education", to: "careers" }
        ],
        aiInsights: generatedText
      };
    }

    return new Response(JSON.stringify({ flowchartData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-career-flowchart function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate career flowchart using Gemini API'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});