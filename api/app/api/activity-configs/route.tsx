import { NextRequest, NextResponse } from 'next/server';
import { ActivityConfig, WordList, ensureDb } from '../../lib/sequelize';
import { corsHeaders } from '../../lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /api/activity-configs - list all builder-configured Wordle/Word Search activities
export async function GET() {
  try {
    await ensureDb();
    const configs = await ActivityConfig.findAll({ include: [WordList], order: [['id', 'ASC']] });
    const payload = configs.map((c: any) => ({
      id: c.id,
      name: c.name,
      activityType: c.activityType,
      difficulty: c.difficulty,
      hintsEnabled: c.hintsEnabled,
      outputSettings: c.outputSettings ? JSON.parse(c.outputSettings) : null,
      wordListId: c.wordListId,
      wordListName: c.WordList ? c.WordList.name : null,
    }));
    return NextResponse.json(payload, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

// POST /api/activity-configs - create a new builder-configured activity
export async function POST(request: NextRequest) {
  try {
    await ensureDb();
    const body = await request.json();

    if (!body.name || typeof body.name !== 'string') {
      return new NextResponse('name is required', { status: 400, headers: corsHeaders });
    }
    if (body.activityType !== 'wordle' && body.activityType !== 'wordsearch') {
      return new NextResponse('activityType must be "wordle" or "wordsearch"', { status: 400, headers: corsHeaders });
    }
    if (!body.wordListId) {
      return new NextResponse('wordListId is required', { status: 400, headers: corsHeaders });
    }
    const wordList = await WordList.findByPk(body.wordListId);
    if (!wordList) {
      return new NextResponse('Word list not found', { status: 404, headers: corsHeaders });
    }

    const config = await ActivityConfig.create({
      name: body.name,
      activityType: body.activityType,
      difficulty: body.difficulty || 'medium',
      hintsEnabled: !!body.hintsEnabled,
      outputSettings: body.outputSettings ? JSON.stringify(body.outputSettings) : null,
      wordListId: body.wordListId,
    });

    return NextResponse.json(
      { id: config.id, name: config.name, activityType: config.activityType },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}
