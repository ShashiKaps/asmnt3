import { NextRequest, NextResponse } from 'next/server';
import { Word, WordList, ensureDb } from '../../../lib/sequelize';
import { corsHeaders } from '../../../lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /api/wordlists/:id - a single activity configuration with its words
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDb();
    const { id } = await params;

    const wordList: any = await WordList.findById(id, { include: [Word] });
    if (!wordList) {
      return new NextResponse('Word list not found', { status: 404, headers: corsHeaders });
    }

    return NextResponse.json(
      {
        id: wordList.id,
        name: wordList.name,
        description: wordList.description,
        phonemeLength: wordList.phonemeLength,
        words: (wordList.Words || []).map((w: any) => ({
          id: w.id,
          word: w.word,
          phonemes: JSON.parse(w.phonemes),
        })),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

// PUT /api/wordlists/:id - update the activity configuration's metadata
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDb();
    const { id } = await params;
    const body = await request.json();

    const wordList: any = await WordList.findById(id);
    if (!wordList) {
      return new NextResponse('Word list not found', { status: 404, headers: corsHeaders });
    }

    if (typeof body.name === 'string') wordList.name = body.name;
    if (typeof body.description === 'string') wordList.description = body.description;
    if (body.phonemeLength) wordList.phonemeLength = parseInt(body.phonemeLength);
    await wordList.save();

    return NextResponse.json(
      { id: wordList.id, name: wordList.name, description: wordList.description, phonemeLength: wordList.phonemeLength },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error(error);
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return new NextResponse('A word list with that name already exists', { status: 409, headers: corsHeaders });
    }
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

// DELETE /api/wordlists/:id - remove the activity configuration and all of its words
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDb();
    const { id } = await params;

    const wordList = await WordList.findById(id);
    if (!wordList) {
      return new NextResponse('Word list not found', { status: 404, headers: corsHeaders });
    }
    await wordList.destroy(); // cascades to Words via onDelete: 'CASCADE'

    return new NextResponse(null, { status: 204, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}
