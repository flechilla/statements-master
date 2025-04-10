import { NextRequest, NextResponse } from 'next/server';
import { getStatementById, getTotalAmountByStatementId } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid statement ID' },
        { status: 400 }
      );
    }
    
    const statements = await getStatementById(id);
    
    if (!statements.length) {
      return NextResponse.json(
        { error: 'Statement not found' },
        { status: 404 }
      );
    }
    
    const totalAmount = await getTotalAmountByStatementId(id);
    
    return NextResponse.json({
      statement: statements[0],
      totalAmount
    });
  } catch (error) {
    console.error('Error fetching statement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statement' },
      { status: 500 }
    );
  }
}