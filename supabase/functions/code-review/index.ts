import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CodeReviewRequest {
  code: string;
  language: string;
  focus_areas: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { code, language, focus_areas }: CodeReviewRequest = await req.json();

    if (!code || code.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Code cannot be empty" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const focusStr = focus_areas.join(", ");

    const prompt = `You are an expert code reviewer with 15+ years of experience. Analyze this ${language} code and provide a detailed review focusing on: ${focusStr}.

Code to review:
\`\`\`${language}
${code}
\`\`\`

Provide your review in the following structured format:

### 🔴 Critical Issues
[List each critical bug or security vulnerability as separate bullet points. If none, write "None found"]

### 🟠 High Priority
[List each high priority item as separate bullet points. If none, write "None found"]

### 🟡 Medium Priority
[List each medium priority item as separate bullet points. If none, write "None found"]

### 🟢 Low Priority
[List each low priority item as separate bullet points. If none, write "None found"]

Be specific with line numbers and provide actionable suggestions.`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        top_p: 0.9,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error("Groq API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to get review from AI" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const groqData = await groqResponse.json();
    const reviewText = groqData.choices[0]?.message?.content || "No review generated";

    const criticalMatch = reviewText.match(/###\s*🔴\s*Critical Issues[:\s]*([\s\S]*?)(?=###|$)/i);
    const highMatch = reviewText.match(/###\s*🟠\s*High Priority[:\s]*([\s\S]*?)(?=###|$)/i);
    const mediumMatch = reviewText.match(/###\s*🟡\s*Medium Priority[:\s]*([\s\S]*?)(?=###|$)/i);
    const lowMatch = reviewText.match(/###\s*🟢\s*Low Priority[:\s]*([\s\S]*?)(?=###|$)/i);

    const countIssues = (text: string) => {
      if (!text || text.includes("None found")) return 0;
      const bullets = text.match(/^[\s]*[-*•]\s/gm);
      return bullets ? bullets.length : 0;
    };

    const data = {
      review: reviewText,
      critical_count: criticalMatch ? countIssues(criticalMatch[1]) : 0,
      high_count: highMatch ? countIssues(highMatch[1]) : 0,
      medium_count: mediumMatch ? countIssues(mediumMatch[1]) : 0,
      low_count: lowMatch ? countIssues(lowMatch[1]) : 0,
    };

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in code-review function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
