
import {  Log, Vote } from '@/lib/actions';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { selectedCandidate } = await req.json();
    console.log("Logging user")
    const response = await Log();
    if(selectedCandidate.$id!=="abstain" && selectedCandidate.$id!=="nota" && response)//if logged out ... don't consider as valid vote
    await Vote(selectedCandidate)

    return NextResponse.json({ success: true, message: "Added Vote" });
  } catch (error: any) {
    console.error("Failed to confirm booking", error)
    return NextResponse.json({ success: false, message: error.message });
  }
}
