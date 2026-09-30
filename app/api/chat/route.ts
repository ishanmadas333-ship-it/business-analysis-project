import { NextRequest, NextResponse } from 'next/server';
import { processAssistantChat } from '@/lib/ai/aiService';
import { FullBusinessReport } from '@/types/business';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, report } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Please provide a valid question or prompt.' },
        { status: 400 }
      );
    }

    if (!report || !report.idea) {
      return NextResponse.json(
        { error: 'Business context report is missing.' },
        { status: 400 }
      );
    }

    const aiResponse = await processAssistantChat(message, report as FullBusinessReport);
    return NextResponse.json({ success: true, data: aiResponse });
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process AI assistant message' },
      { status: 500 }
    );
  }
}
