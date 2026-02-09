import { userService } from '@/services/user.service';
import { NextResponse } from 'next/server';

export async function GET() {
    const response = await userService.readById();
    return NextResponse.json(response);
}
