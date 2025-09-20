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
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      throw new Error('PERPLEXITY_API_KEY is not set');
    }

    const { quizData, userProfile } = await req.json();
    console.log('Received request with quiz data:', quizData);
    console.log('User profile:', userProfile);

    // Construct the prompt for Perplexity
    const prompt = `As a career guidance expert, create a comprehensive career flowchart for the following student:

Student Profile:
- Name: ${userProfile?.name || 'Student'}
- Standard: ${userProfile?.standard || 'Not specified'}
- Interest: ${userProfile?.interest || 'Not specified'}
- Strengths: ${userProfile?.strengths || 'Not specified'}

Quiz Assessment Results:
- Recommended Stream: ${quizData.stream}
- Assessment Score: ${quizData.score}/100
- Top Course Recommendations: ${quizData.recommendations.slice(0, 3).map(c => c.name).join(', ')}
- Recommended Colleges: ${quizData.colleges.slice(0, 3).map(c => c.name).join(', ')}

Create a detailed career roadmap showing progression from current education to career goals. Structure it as a flowchart with these stages:

1. Current Education Level → 2. Recommended Stream Courses → 3. Higher Education Options → 4. Career Opportunities → 5. Future Growth Paths

For each stage, provide:
- Specific course/degree names with duration
- Key skills to develop
- Entry requirements
- Career prospects and salary ranges
- Industry growth potential

Focus on the ${quizData.stream} stream and ensure all recommendations align with the student's assessed interests and strengths.

Return the response as a structured JSON object with flowchart data including nodes, connections, and detailed information for each pathway stage.`;

    console.log('Sending request to Perplexity API...');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a career guidance expert. Provide detailed, actionable career advice and return responses in structured JSON format when requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      throw new Error(`Perplexity API error: ${response.status} ${errorText}`);
    }

    const perplexityData = await response.json();
    console.log('Perplexity API response:', JSON.stringify(perplexityData, null, 2));

    if (!perplexityData.choices || !perplexityData.choices[0] || !perplexityData.choices[0].message) {
      throw new Error('Invalid response structure from Perplexity API');
    }

    const generatedText = perplexityData.choices[0].message.content;
    console.log('Generated text:', generatedText);

    // Create structured flowchart data based on the AI response
    const flowchartData = {
      title: `Career Pathway for ${userProfile?.name || 'Student'}`,
      nodes: [
        {
          id: "current_education",
          label: `Current Education - ${userProfile?.standard || 'Class 12'}`,
          type: "start",
          description: `Student studying ${userProfile?.standard || 'Class 12'} with interest in ${userProfile?.interest || quizData.stream}`
        },
        {
          id: "recommended_courses",
          label: `${quizData.stream} Stream Courses`,
          type: "courses",
          options: quizData.recommendations.slice(0, 3).map(course => ({
            name: course.name,
            duration: course.duration || "3-4 years",
            description: `Recommended based on your ${quizData.stream} stream assessment`
          }))
        },
        {
          id: "higher_studies",
          label: "Higher Education Options",
          type: "education",
          options: [
            {
              name: quizData.stream === 'Science' ? 'Bachelor of Engineering/Technology' : 
                    quizData.stream === 'Commerce' ? 'Bachelor of Commerce/Business Administration' : 
                    'Bachelor of Arts/Liberal Arts',
              duration: "3-4 years",
              description: "Undergraduate degree in your chosen specialization"
            },
            {
              name: quizData.stream === 'Science' ? 'Master of Technology/Science' : 
                    quizData.stream === 'Commerce' ? 'Master of Business Administration' : 
                    'Master of Arts/Social Work',
              duration: "2 years",
              description: "Advanced specialization for career growth"
            }
          ]
        },
        {
          id: "career_opportunities",
          label: "Career Opportunities",
          type: "careers",
          options: quizData.stream === 'Science' ? [
            { name: "Software Engineer", sector: "Technology", description: "Develop software applications and systems" },
            { name: "Data Scientist", sector: "Analytics", description: "Analyze data to drive business decisions" },
            { name: "Research Scientist", sector: "R&D", description: "Conduct scientific research and innovation" }
          ] : quizData.stream === 'Commerce' ? [
            { name: "Financial Analyst", sector: "Finance", description: "Analyze financial data and investment opportunities" },
            { name: "Business Manager", sector: "Management", description: "Lead teams and drive business growth" },
            { name: "Chartered Accountant", sector: "Accounting", description: "Provide financial and audit services" }
          ] : [
            { name: "Civil Services Officer", sector: "Government", description: "Serve in administrative roles for public welfare" },
            { name: "Teacher/Professor", sector: "Education", description: "Educate and mentor future generations" },
            { name: "Social Worker", sector: "NGO/Social", description: "Work for social causes and community development" }
          ]
        }
      ],
      connections: [
        { from: "current_education", to: "recommended_courses" },
        { from: "recommended_courses", to: "higher_studies" },
        { from: "higher_studies", to: "career_opportunities" }
      ],
      aiInsights: generatedText
    };

    return new Response(JSON.stringify({ flowchartData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-career-flowchart function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate career flowchart using Perplexity API'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});