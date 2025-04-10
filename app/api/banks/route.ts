import { NextRequest, NextResponse } from 'next/server';
import { getAllBanks } from '@/lib/db/queries';

export async function GET(_request: NextRequest) {
  try {
    const banks = await getAllBanks();
    return NextResponse.json({ banks });
  } catch (error) {
    console.error('Error fetching banks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banks' },
      { status: 500 }
    );
  }
}