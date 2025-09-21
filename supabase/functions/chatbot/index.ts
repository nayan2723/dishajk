import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface CollegeResult {
  college_name: string;
  type: string;
  district: string;
  urban_rural_status: string;
  courses_offered: string;
  working_college_link?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, userProfile } = await req.json();
    console.log('Chatbot request:', { message, userProfile });

    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!geminiApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Determine if this is a college/course query that needs database search
    const isSpecificCollegeQuery = /show me|list|find|colleges in|institutes in|admission in/i.test(message) && 
                                  /college|institute|university/i.test(message);
    
    let collegeData = null;
    let response = '';

    if (isSpecificCollegeQuery) {
      console.log('Detected specific college query, searching database...');
      
      // Extract location/district from message
      const locations = ['srinagar', 'jammu', 'kathua', 'udhampur', 'doda', 'rajouri', 'poonch', 'anantnag', 'pulwama', 'budgam', 'baramulla', 'kupwara', 'kulgam', 'shopian', 'ganderbal', 'bandipora', 'leh', 'kargil', 'ramban', 'kishtwar', 'samba', 'reasi'];
      const mentionedLocation = locations.find(loc => message.toLowerCase().includes(loc));
      
      // Search colleges based on message content
      let query = supabase.from('colleges').select('*');
      
      if (mentionedLocation) {
        query = query.ilike('District', `%${mentionedLocation}%`);
      }

      // Search in courses offered
      const courseKeywords = message.toLowerCase().match(/\b(engineering|medical|commerce|science|arts|bca|bba|ba|bsc|mca|mba|physics|chemistry|mathematics|computer|management|law|nursing|pharmacy|agriculture)\b/g);
      
      if (courseKeywords && courseKeywords.length > 0) {
        const courseQuery = courseKeywords.join('|');
        query = query.or(`"Courses Offered (Categorized Streams)".ilike.%${courseKeywords[0]}%`);
      }

      const { data, error } = await query.limit(10);
      
      if (!error && data && data.length > 0) {
        collegeData = data;
        console.log(`Found ${data.length} colleges matching query`);
      }
    }

    // Prepare context for Gemini
    let contextPrompt = `You are DISHA Mentor, a friendly and knowledgeable career guidance counselor for students in Jammu & Kashmir. You provide empathetic, helpful advice about careers, courses, education paths, degrees, and scholarships.

Current user query: "${message}"

Conversation history: ${conversationHistory ? JSON.stringify(conversationHistory.slice(-3)) : 'None'}

${userProfile ? `User profile: ${JSON.stringify(userProfile)}` : ''}

${collegeData && collegeData.length > 0 ? `
I found ${collegeData.length} colleges in our database that match the query:
${JSON.stringify(collegeData, null, 2)}

Please provide a helpful response that:
1. Acknowledges their query warmly
2. Explains the college options I found
3. Provides additional career guidance
4. Suggests next steps

Format college information in a friendly, conversational way. Don't just list data - explain why these options might be good for them.
` : ''}

For questions about degrees, courses, scholarships, or career guidance for J&K students, provide accurate and helpful information including:

DEGREES & COURSES:
- Popular undergraduate courses: Engineering (B.Tech), Medical (MBBS, BDS), Commerce (B.Com), Arts (BA), Science (B.Sc), Computer Applications (BCA), Business Administration (BBA)
- Postgraduate options: MBA, MCA, M.Tech, MA, M.Sc, specialized degrees
- Professional courses: CA, CS, CMA, Law (LLB), Teaching (B.Ed), Nursing, Pharmacy

SCHOLARSHIPS FOR J&K STUDENTS:
- Prime Minister's Scholarship Scheme for J&K students
- Merit-cum-Means Scholarship
- National Scholarship Portal schemes
- J&K Bank Educational Loan schemes
- Central government scholarships for professional courses
- State government scholarships and fee waivers
- Minority scholarships if applicable

CAREER PATHS:
- Government jobs: JKPSC, JKSSB, Banking, Teaching, Administrative services
- Private sector opportunities in IT, Banking, Healthcare, Tourism
- Entrepreneurship opportunities in J&K
- Remote work opportunities
- Skill development programs available in J&K

Guidelines:
- Be warm, encouraging, and supportive
- Provide practical, actionable advice specific to J&K context
- Keep responses concise but informative (2-3 key points maximum)
- Focus on answering exactly what the user asks
- Mention realistic opportunities and growth potential
- If you don't have specific current data, acknowledge limitations but still provide helpful guidance
- Always end with encouragement and next steps`;

    // Call Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: contextPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    const geminiData = await geminiResponse.json();
    console.log('Gemini response:', geminiData);

    if (geminiData.candidates && geminiData.candidates[0]) {
      response = geminiData.candidates[0].content.parts[0].text;
    } else {
      response = "I'm here to help! Could you please rephrase your question?";
    }

    return new Response(JSON.stringify({ 
      response,
      collegeData: collegeData || [],
      hasCollegeData: !!collegeData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chatbot function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm experiencing some technical difficulties. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});