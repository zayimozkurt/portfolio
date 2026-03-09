import { UserService } from '@/services/user.service';
import { NextResponse } from 'next/server';

export async function GET() {
    console.time('label');
    const response = await UserService.readById();
    console.timeEnd('label');
    return NextResponse.json(response);
}
