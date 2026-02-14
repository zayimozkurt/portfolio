import { UserService } from '@/services/user.service';
import { NextResponse } from 'next/server';

export async function GET() {
    const response = await UserService.readById();
    return NextResponse.json(response);
}
