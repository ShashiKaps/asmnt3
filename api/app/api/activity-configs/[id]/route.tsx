import { NextRequest, NextResponse } from 'next/server';
import { ActivityConfig, ensureDb } from '../../../lib/sequelize';
import { corsHeaders } from '../../../lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// DELETE /api/activity-configs/:id - remove a builder-configured activity
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDb();
    const { id } = await params;

    const config = await ActivityConfig.findByPk(id);
    if (!config) {
      return new NextResponse('Activity config not found', { status: 404, headers: corsHeaders });
    }
    await config.destroy();

    return new NextResponse(null, { status: 204, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}
