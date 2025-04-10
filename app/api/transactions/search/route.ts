import { NextRequest, NextResponse } from 'next/server';
import { searchTransactions } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    const transactions = await searchTransactions(query);
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error searching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to search transactions' },
      { status: 500 }
    );
  }
}