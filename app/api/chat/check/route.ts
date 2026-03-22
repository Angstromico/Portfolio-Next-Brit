import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    const apiKey = process.env.OPEN_AI_API; // Note: using OPEN_AI_API instead of OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ ok: false, message: 'API key missing' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });
    
    // We can do a lightweight check just reading a list of models to ensure the key is valid.
    // However, if we just want to conditionally render based if key exists, we can skip fetching.
    // The prompt says "if the API responds positively", so let's do a fast call:
    await openai.models.list();
    
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('OpenAI check failed:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
