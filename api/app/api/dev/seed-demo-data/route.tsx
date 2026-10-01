import { NextResponse } from 'next/server';
import { ActivityConfig, GenerationEvent, PageView, WordList, ensureDb } from '../../../lib/sequelize';
import { corsHeaders } from '../../../lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

const PAGES = ['wordle', 'wordsearch', 'settings', 'home'] as const;
const FAILURE_REASONS = ['empty word list', 'invalid phoneme data', 'could not place word in grid'];

function daysAgo(days: number, hourOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hourOffset);
  return d;
}

// POST /api/dev/seed-demo-data - backfill simulated historical stats so the dashboard has
// something to show before real usage accumulates. Dev-only, and only runs once (no-op if
// GenerationEvent already has rows) so it never overwrites real monitoring data.
export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Seeding is disabled in production', { status: 403, headers: corsHeaders });
  }

  try {
    await ensureDb();

    // idempotency marker, independent of any real usage data already recorded
    const SEED_MARKER = 'Beginner Wordle (3-phoneme)';
    const alreadySeeded = await ActivityConfig.findOne({ where: { name: SEED_MARKER } });
    if (alreadySeeded) {
      return NextResponse.json(
        { seeded: false, message: 'Skipped - demo data already seeded.' },
        { headers: corsHeaders }
      );
    }

    const wordLists = await WordList.findAll();
    const byLength = (len: number) => wordLists.find((w: any) => w.phonemeLength === len);

    const configRows: any[] = [];
    if (byLength(3)) {
      configRows.push({ name: 'Beginner Wordle (3-phoneme)', activityType: 'wordle', difficulty: 'easy', hintsEnabled: true, outputSettings: JSON.stringify({ maxAttempts: 6 }), wordListId: byLength(3).id });
      configRows.push({ name: 'Beginner Word Search (3-phoneme)', activityType: 'wordsearch', difficulty: 'easy', hintsEnabled: true, outputSettings: JSON.stringify({ gridRows: 8, gridCols: 8 }), wordListId: byLength(3).id });
    }
    if (byLength(4)) {
      configRows.push({ name: 'Intermediate Wordle (4-phoneme)', activityType: 'wordle', difficulty: 'medium', hintsEnabled: false, outputSettings: JSON.stringify({ maxAttempts: 5 }), wordListId: byLength(4).id });
    }
    if (byLength(5)) {
      configRows.push({ name: 'Advanced Word Search (5-phoneme)', activityType: 'wordsearch', difficulty: 'hard', hintsEnabled: false, outputSettings: JSON.stringify({ gridRows: 14, gridCols: 14 }), wordListId: byLength(5).id });
    }
    if (configRows.length > 0) await ActivityConfig.bulkCreate(configRows);

    const generationRows: any[] = [];
    for (let i = 0; i < 60; i++) {
      const activityType = i % 2 === 0 ? 'wordle' : 'wordsearch';
      const isFailure = i % 9 === 0; // ~11% failure rate
      generationRows.push({
        activityType,
        status: isFailure ? 'failure' : 'success',
        errorReason: isFailure ? FAILURE_REASONS[i % FAILURE_REASONS.length] : null,
        durationMs: isFailure ? null : 150 + Math.round(Math.random() * 400),
        createdAt: daysAgo(6 - (i % 7), i % 12),
        updatedAt: daysAgo(6 - (i % 7), i % 12),
      });
    }
    await GenerationEvent.bulkCreate(generationRows);

    const pageViewRows: any[] = [];
    for (let i = 0; i < 80; i++) {
      const page = PAGES[i % PAGES.length];
      const baseDuration = page === 'settings' ? 20000 : page === 'home' ? 8000 : 45000;
      pageViewRows.push({
        page,
        durationMs: Math.round(baseDuration * (0.5 + Math.random())),
        createdAt: daysAgo(6 - (i % 7), i % 12),
        updatedAt: daysAgo(6 - (i % 7), i % 12),
      });
    }
    await PageView.bulkCreate(pageViewRows);

    return NextResponse.json(
      { seeded: true, activityConfigs: configRows.length, generationEvents: generationRows.length, pageViews: pageViewRows.length },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}
