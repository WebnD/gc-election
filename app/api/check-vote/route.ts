
import {  CheckLog } from '@/lib/actions';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if(email){
        console.log("Checking user")
        const response = await CheckLog(email);
        if(response)
        return NextResponse.json(false);
        else
        return NextResponse.json(true);
    }
    else
    return NextResponse.json(false);

    
  } catch (error: any) {
    console.error("Failed to confirm booking", error)
    return NextResponse.json({ success: false, message: error.message });
  }
}
