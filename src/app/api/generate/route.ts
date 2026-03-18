export async function POST(request: Request) {
  try {
    const { notes } = await request.json();

    if (!notes || typeof notes !== "string" || notes.trim().length === 0) {
      return Response.json({ error: "Notes are required" }, { status: 400 });
    }

    const truncated = notes.slice(0, 8000);

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a flashcard generator. Given study notes, produce a JSON array of flashcard objects with 'question' and 'answer' keys. Return ONLY the JSON array, no markdown, no explanation. Generate 5-15 flashcards depending on content length.",
          },
          {
            role: "user",
            content: truncated,
          },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json(
        { error: "Groq API error: " + err },
        { status: 502 }
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "[]";

    // Parse the JSON from the response
    let flashcards;
    try {
      flashcards = JSON.parse(content);
    } catch {
      // Try to extract JSON array from the response
      const match = content.match(/\[[\s\S]*\]/);
      if (match) {
        flashcards = JSON.parse(match[0]);
      } else {
        return Response.json(
          { error: "Failed to parse flashcards from AI response" },
          { status: 500 }
        );
      }
    }

    return Response.json({ flashcards });
  } catch (error) {
    console.error("Generate error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
