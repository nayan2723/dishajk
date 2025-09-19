import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quizData, userProfile } = await req.json();

    const prompt = `
    Based on the following student quiz data, generate a comprehensive career guidance flowchart in JSON format:
    
    Student Profile:
    - Stream: ${userProfile.stream}
    - Location: ${userProfile.location}
    - District: ${userProfile.district}
    - Future Goals: ${userProfile.futureGoals}
    
    Quiz Answers: ${JSON.stringify(quizData)}
    
    Generate a detailed career flowchart with the following structure:
    {
      "title": "Career Guidance Flowchart for [Student Stream]",
      "nodes": [
        {
          "id": "stream",
          "label": "[Stream Name]",
          "type": "start",
          "description": "Starting point based on selected stream"
        },
        {
          "id": "courses",
          "label": "Recommended Courses",
          "type": "courses",
          "options": [
            {
              "name": "Course 1",
              "duration": "Duration",
              "description": "Course description"
            }
          ]
        },
        {
          "id": "higher_studies",
          "label": "Higher Studies Options",
          "type": "education",
          "options": [
            {
              "name": "Degree/Program",
              "duration": "Duration",
              "description": "Program description"
            }
          ]
        },
        {
          "id": "careers",
          "label": "Career Opportunities",
          "type": "careers",
          "options": [
            {
              "name": "Job Title",
              "sector": "Industry",
              "description": "Job description and growth prospects"
            }
          ]
        }
      ],
      "connections": [
        { "from": "stream", "to": "courses" },
        { "from": "courses", "to": "higher_studies" },
        { "from": "higher_studies", "to": "careers" }
      ]
    }
    
    Make it specific to the student's stream (${userProfile.stream}) and future goals (${userProfile.futureGoals}). Include at least 3-4 course options, 3-4 higher studies options, and 5-6 career opportunities. Focus on opportunities available in Jammu and Kashmir region when relevant.
    
    Return ONLY the JSON object, no additional text.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Clean up the response to extract JSON
    let cleanedText = generatedText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    let flowchartData;
    try {
      flowchartData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('Raw response:', cleanedText);
      throw new Error('Failed to parse flowchart data from Gemini response');
    }

    return new Response(JSON.stringify({ flowchartData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-career-flowchart function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});