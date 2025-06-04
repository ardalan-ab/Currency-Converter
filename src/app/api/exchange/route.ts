// app/api/exchange/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fallbackData from '@/data/fallback.json';
let lastValidRates: any = null;

export async function GET(req: NextRequest) {
  try {
    const res = await fetch('https://api.navasan.tech/latest/?api_key=free4UdRZhvdw25YDBRdAcIqRznMjoKq', {
    
    });

    if (!res.ok) throw new Error('API limit or error');

    const data = await res.json();
    lastValidRates = data;

    return NextResponse.json({ source: 'live', rates: data });
  } catch (error) {
    if (lastValidRates) {
      return NextResponse.json({ source: 'cache', rates: lastValidRates });
    }
    return NextResponse.json({ source:"fallback Data",rates:fallbackData }, { status: 500 });
  }
}