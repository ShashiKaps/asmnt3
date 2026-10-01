import { NextRequest, NextResponse } from 'next/server';
import { Word, ensureDb } from '../../../lib/sequelize';
import { corsHeaders } from '../../../lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDb();
    const { id } = await params;
    const body = await request.json();

    const word = await Word.findById(id);
    if (!word) {
      return new NextResponse('Word not found', { status: 404, headers: corsHeaders });
    }

    if (typeof body.word === 'string') word.word = body.word;
    if (Array.isArray(body.phonemes)) {
      word.phonemes = JSON.stringify(body.phonemes);
      word.length = body.phonemes.length;
    }
    await word.save();

    return NextResponse.json(
      { id: word.id, word: word.word, phonemes: JSON.parse(word.phonemes), wordListId: word.wordListId },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDb();
    const { id } = await params;

    const word = await Word.findById(id);
    if (!word) {
      return new NextResponse('Word not found', { status: 404, headers: corsHeaders });
    }
    await word.destroy();

    return new NextResponse(null, { status: 204, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}
