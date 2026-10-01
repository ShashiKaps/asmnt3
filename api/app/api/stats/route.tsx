import { NextResponse } from 'next/server';
import { ActivityConfig, GenerationEvent, PageView, WordList, ensureDb } from '../../lib/sequelize';
import { corsHeaders } from '../../lib/cors';
import { Sequelize } from 'sequelize';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /api/stats - aggregate counters for the dashboard
export async function GET() {
  try {
    await ensureDb();

    const [wordListCount, activityCounts, generationCounts, avgDuration, pageViewByPage, recentFailures] =
      await Promise.all([
        WordList.count(),
        ActivityConfig.findAll({
          attributes: ['activityType', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
          group: ['activityType'],
          raw: true,
        }) as Promise<{ activityType: string; count: string }[]>,
        GenerationEvent.findAll({
          attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
          group: ['status'],
          raw: true,
        }) as Promise<{ status: string; count: string }[]>,
        PageView.findOne({
          attributes: [[Sequelize.fn('AVG', Sequelize.col('durationMs')), 'avg']],
          raw: true,
        }) as Promise<{ avg: string | null }>,
        PageView.findAll({
          attributes: ['page', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
          group: ['page'],
          raw: true,
        }) as Promise<{ page: string; count: string }[]>,
        GenerationEvent.findAll({
          where: { status: 'failure' },
          order: [['createdAt', 'DESC']],
          limit: 10,
          raw: true,
        }) as Promise<any[]>,
      ]);

    const activityTotals: Record<string, number> = { wordle: 0, wordsearch: 0 };
    for (const row of activityCounts) activityTotals[row.activityType] = parseInt(row.count, 10);

    const generationTotals: Record<string, number> = { success: 0, failure: 0 };
    for (const row of generationCounts) generationTotals[row.status] = parseInt(row.count, 10);

    const pageViewTotals: Record<string, number> = {};
    for (const row of pageViewByPage) pageViewTotals[row.page] = parseInt(row.count, 10);
    const mostUsedActivityType =
      activityTotals.wordle === activityTotals.wordsearch
        ? null
        : activityTotals.wordle > activityTotals.wordsearch
        ? 'wordle'
        : 'wordsearch';

    return NextResponse.json(
      {
        wordListCount,
        activityConfigCounts: activityTotals,
        generationCounts: generationTotals,
        averageTimeOnPageMs: avgDuration.avg ? Math.round(parseFloat(avgDuration.avg)) : 0,
        pageViewCounts: pageViewTotals,
        mostUsedActivityType,
        recentFailures: recentFailures.map((f) => ({
          id: f.id,
          activityType: f.activityType,
          errorReason: f.errorReason,
          createdAt: f.createdAt,
        })),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}
