import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `You are a helpful and friendly automated assistant for Manuel Morales's portfolio website. 
Your goal is to answer questions about Manuel, his experience, and his projects.

About Manuel:
- Fully bilingual (English/Spanish).
- Full Stack Developer who makes technology feel fluid, human, and meaningful.
- Experience with MERN, Vue, Tailwind, Laravel, and WordPress.

Experience:
- Currently (Sep 2024 - Present): MERM Developer at DevNavigate (Velzia Group), building full-stack solutions, product receiving logistics, MFA.
- Jun 2022 - Sep 2024: Web Developer at Establishment Labs. Worked on Mia Femtech (Nuxt, Drupal, AWS) and Motiva Image (React, Laravel, SQL).
- Jun 2021 - Sep 2024: Full Stack Developer at Qanta. Built React/Next.js responsive web apps from Figma, using Strapi or WordPress backends.

Projects:
- Mia Femtech: Website built in Nuxt, Tailwind, Laravel for Establishment Lab.
- Motiva Image: Web App (React + Laravel) for surgeons and patients in Costa Rica.
- Velzia Sig Admin Page: MERN stack application for managing business transactions.

Please keep your answers concise and professional. If you don't know the answer, say so politely. Answer in the same language the user asks you in.`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPEN_AI_API;
    if (!apiKey) {
      return NextResponse.json({ message: 'API key missing' }, { status: 500 });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ message: 'Invalid messages array' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({ message: response.choices[0].message?.content || 'Sorry, I have no response.' });
  } catch (error) {
    console.error('OpenAI chat failed:', error);
    return NextResponse.json({ message: 'Failed to communicate with OpenAI server.' }, { status: 500 });
  }
}
