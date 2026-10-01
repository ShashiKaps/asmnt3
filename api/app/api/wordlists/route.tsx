import { NextRequest, NextResponse } from 'next/server';
import { Word, WordList, ensureDb } from '../../lib/sequelize';
import { corsHeaders } from '../../lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /api/wordlists - list all activity configurations (word lists) with their words
export async function GET() {
  try {
    await ensureDb();

    const wordLists = await WordList.findAll({ include: [Word], order: [['id', 'ASC']] });
    const payload = wordLists.map((list: any) => ({
      id: list.id,
      name: list.name,
      description: list.description,
      phonemeLength: list.phonemeLength,
      words: (list.Words || []).map((w: any) => ({
        id: w.id,
        word: w.word,
        phonemes: JSON.parse(w.phonemes),
      })),
    }));

    return NextResponse.json(payload, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

// POST /api/wordlists - create a new activity configuration, optionally with an initial set of words
export async function POST(request: NextRequest) {
  try {
    await ensureDb();
    const body = await request.json();

    if (!body.name || typeof body.name !== 'string') {
      return new NextResponse('name is required', { status: 400, headers: corsHeaders });
    }
    const phonemeLength = parseInt(body.phonemeLength);
    if (!phonemeLength) {
      return new NextResponse('phonemeLength is required', { status: 400, headers: corsHeaders });
    }

    const wordList = await WordList.create({
      name: body.name,
      description: body.description || null,
      phonemeLength,
    });

    if (Array.isArray(body.words) && body.words.length > 0) {
      const rows = body.words.map((w: any) => ({
        word: w.word,
        phonemes: JSON.stringify(w.phonemes),
        length: phonemeLength,
        wordListId: wordList.id,
      }));
      await Word.bulkCreate(rows);
    }

    return NextResponse.json(
      { id: wordList.id, name: wordList.name, description: wordList.description, phonemeLength: wordList.phonemeLength },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error(error);
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return new NextResponse('A word list with that name already exists', { status: 409, headers: corsHeaders });
    }
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}
