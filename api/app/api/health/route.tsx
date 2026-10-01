import { NextResponse } from 'next/server';
import { sequelize, ensureDb } from '../../lib/sequelize';
import { corsHeaders } from '../../lib/cors';

const startedAt = Date.now();

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /api/health - DB connectivity check + process uptime, for the dashboard's health badge
export async function GET() {
  try {
    await ensureDb();
    await sequelize.authenticate();
    return NextResponse.json(
      { status: 'ok', uptimeMs: Date.now() - startedAt },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: 'error', uptimeMs: Date.now() - startedAt },
      { status: 503, headers: corsHeaders }
    );
  }
}
