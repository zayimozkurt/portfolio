import { UserService } from '@/services/user.service';
import { NextResponse } from 'next/server';

export async function DELETE() {
    const response = await UserService.deleteCv();
    return NextResponse.json(response);
}
