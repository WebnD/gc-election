
import { GetCandidates } from '@/lib/actions';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { team } = await req.json();
    
    const result = await GetCandidates(team)
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to confirm booking", error)
    return NextResponse.json({ success: false, message: error.message });
  }
}
