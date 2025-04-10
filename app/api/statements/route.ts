import { NextRequest, NextResponse } from 'next/server';
import { getAllStatements } from '@/lib/db/queries';

export async function GET(_request: NextRequest) {
  try {
    const statements = await getAllStatements();
    return NextResponse.json({ statements });
  } catch (error) {
    console.error('Error fetching statements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statements' },
      { status: 500 }
    );
  }
}