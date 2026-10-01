import { NextRequest, NextResponse } from 'next/server';
import { GenerationEvent, ensureDb } from '../../../lib/sequelize';
import { corsHeaders } from '../../../lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// POST /api/events/generation - record a builder/user puzzle-generation attempt
export async function POST(request: NextRequest) {
  try {
    await ensureDb();
    const body = await request.json();

    if (body.activityType !== 'wordle' && body.activityType !== 'wordsearch') {
      return new NextResponse('activityType must be "wordle" or "wordsearch"', { status: 400, headers: corsHeaders });
    }
    if (body.status !== 'success' && body.status !== 'failure') {
      return new NextResponse('status must be "success" or "failure"', { status: 400, headers: corsHeaders });
    }

    const event = await GenerationEvent.create({
      activityType: body.activityType,
      status: body.status,
      errorReason: typeof body.errorReason === 'string' ? body.errorReason : null,
      durationMs: typeof body.durationMs === 'number' ? body.durationMs : null,
    });

    return NextResponse.json({ id: event.id }, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}
