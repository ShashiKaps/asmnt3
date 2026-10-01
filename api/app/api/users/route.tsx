import { NextRequest, NextResponse } from 'next/server';
import { User, ensureDb } from '../../lib/sequelize';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  try {
    await ensureDb();
    const id = request.nextUrl.searchParams.get('id');
    if (id) {
      const user = await User.findByPk(parseInt(id));
      if (!user) {
        return new NextResponse('User not found', { status: 404, headers: corsHeaders });
      }
      return NextResponse.json(user, { headers: corsHeaders });
    }

    const users = await User.findAll();
    return NextResponse.json(users, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDb();
    const { name, lineStatus } = await request.json();

    if (!name || !lineStatus) {
      return new NextResponse('Missing name or lineStatus', { status: 400, headers: corsHeaders });
    }

    const newUser = await User.create({
      name,
      lineStatus,
    });

    return NextResponse.json(newUser, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request body', { status: 400, headers: corsHeaders });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await ensureDb();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing id', { status: 400, headers: corsHeaders });
    }

    const user = await User.findByPk(parseInt(id));
    if (!user) {
      return new NextResponse('User not found', { status: 404, headers: corsHeaders });
    }

    const { name, lineStatus } = await request.json();
    if (name !== undefined) user.name = name;
    if (lineStatus !== undefined) user.lineStatus = lineStatus;

    await user.save();
    return NextResponse.json(user, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureDb();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing id', { status: 400, headers: corsHeaders });
    }

    const user = await User.findByPk(parseInt(id));
    if (!user) {
      return new NextResponse('User not found', { status: 404, headers: corsHeaders });
    }

    await user.destroy();
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}