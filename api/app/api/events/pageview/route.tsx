import { NextRequest, NextResponse } from 'next/server';
import { PageView, ensureDb } from '../../../lib/sequelize';
import { corsHeaders } from '../../../lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// POST /api/events/pageview - record time spent on a page, for average-time-on-page reporting
export async function POST(request: NextRequest) {
  try {
    await ensureDb();
    const body = await request.json();

    if (!body.page || typeof body.page !== 'string') {
      return new NextResponse('page is required', { status: 400, headers: corsHeaders });
    }
    if (typeof body.durationMs !== 'number' || body.durationMs < 0) {
      return new NextResponse('durationMs must be a non-negative number', { status: 400, headers: corsHeaders });
    }

    const view = await PageView.create({ page: body.page, durationMs: Math.round(body.durationMs) });
    return NextResponse.json({ id: view.id }, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}
