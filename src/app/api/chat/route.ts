import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: [
          {
            role: 'system',
            content:
              'You are a fun, friendly study buddy who helps students learn and makes studying enjoyable. Always explain things clearly and add a touch of humor or encouragement!',
          },
          { role: 'user', content: message },
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    console.log("OpenRouter response:", response.status, JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "OpenRouter error" }, { status: 500 });
    }

    if (data.choices?.[0]?.message?.content) {
      return NextResponse.json({ reply: data.choices[0].message.content });
    }

    return NextResponse.json({ error: 'No response from AI.', debug: data }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error contacting OpenRouter: ' + (error?.message || error) }, { status: 500 });
  }
}
