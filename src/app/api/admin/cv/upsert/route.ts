import { UserService } from '@/services/user.service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const formData = await req.formData();

    const file = formData.get('file') as File;

    const response = await UserService.upsertCv(file);
    return NextResponse.json(response);
}
