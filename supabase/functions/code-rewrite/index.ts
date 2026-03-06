import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CodeRewriteRequest {
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
    const { code, language, focus_areas }: CodeRewriteRequest = await req.json();

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

    const prompt = `You are an expert software engineer. Rewrite and optimize the following ${language} code focusing on: ${focusStr}.

Original Code:
\`\`\`${language}
${code}
\`\`\`

Provide your response in the following format:

### Rewritten Code
\`\`\`${language}
[Your optimized, production-ready code here]
\`\`\`

### Key Improvements
- Improvement 1: [Description]
- Improvement 2: [Description]
- Improvement 3: [Description]

### Explanation
[Brief explanation of the major changes and why they improve the code]

Make sure the rewritten code is complete, well-documented, follows best practices, and is ready for production use.`;

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
        JSON.stringify({ error: "Failed to rewrite code using AI" }),
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
    const rewriteText = groqData.choices[0]?.message?.content || "No rewrite generated";

    return new Response(JSON.stringify({ rewrite: rewriteText }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in code-rewrite function:", error);
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
