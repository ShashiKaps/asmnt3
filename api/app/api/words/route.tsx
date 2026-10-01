import { NextRequest, NextResponse } from 'next/server';
import { Word, ensureDb } from '../../lib/sequelize';
import { corsHeaders } from '../../lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  try {
    await ensureDb();

    const lengthParam = request.nextUrl.searchParams.get('length');
    const where = lengthParam ? { length: parseInt(lengthParam) } : undefined;

    const words = await Word.findAll(where ? { where } : undefined);
    const payload = words.map((w: any) => ({
      id: w.id,
      word: w.word,
      phonemes: JSON.parse(w.phonemes),
      wordListId: w.wordListId,
    }));

    return NextResponse.json(payload, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

