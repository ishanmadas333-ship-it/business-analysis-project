import { NextRequest, NextResponse } from 'next/server';
import { extractBusinessRequirements } from '@/lib/ai/aiService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a business idea prompt.' },
        { status: 400 }
      );
    }

    const extracted = await extractBusinessRequirements(prompt.trim());
    return NextResponse.json({ success: true, data: extracted });
  } catch (error: any) {
    console.error('API /api/analyze error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze business idea' },
      { status: 500 }
    );
  }
}
