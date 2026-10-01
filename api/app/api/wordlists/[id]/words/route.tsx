import { NextRequest, NextResponse } from 'next/server';
import { Word, WordList, ensureDb } from '../../../../lib/sequelize';
import { corsHeaders } from '../../../../lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// POST /api/wordlists/:id/words - add a new word+phonemes to an existing activity configuration
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDb();
    const { id } = await params;
    const body = await request.json();

    const wordList: any = await WordList.findById(id);
    if (!wordList) {
      return new NextResponse('Word list not found', { status: 404, headers: corsHeaders });
    }
    if (!body.word || typeof body.word !== 'string') {
      return new NextResponse('word is required', { status: 400, headers: corsHeaders });
    }
    if (!Array.isArray(body.phonemes) || body.phonemes.length === 0) {
      return new NextResponse('phonemes must be a non-empty array', { status: 400, headers: corsHeaders });
    }

    const word = await Word.create({
      word: body.word,
      phonemes: JSON.stringify(body.phonemes),
      length: body.phonemes.length,
      wordListId: wordList.id,
    });

    return NextResponse.json(
      { id: word.id, word: word.word, phonemes: JSON.parse(word.phonemes), wordListId: word.wordListId },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}
