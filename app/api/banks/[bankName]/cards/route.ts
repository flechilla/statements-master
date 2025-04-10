import { NextRequest, NextResponse } from 'next/server';
import { getCardsByBank } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { bankName: string } }
) {
  try {
    const { bankName } = params;
    
    if (!bankName) {
      return NextResponse.json(
        { error: 'Bank name is required' },
        { status: 400 }
      );
    }
    
    const cards = await getCardsByBank(bankName);
    return NextResponse.json({ cards });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}