import { UserService } from '@/services/user.service';
import { ResponseBase } from '@/types/response/response-base';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const file = formData.get('file');

        if (!file || !(file instanceof File))
            return NextResponse.json({ isSuccess: false, message: "file doesn't exist", statusCode: 400 }, { status: 400 });
        if (file.type !== 'application/pdf')
            return NextResponse.json({ isSuccess: false, message: 'file must be a pdf', statusCode: 400 }, { status: 400 });

        const response = await UserService.upsertCv(file);

        return NextResponse.json(response, { status: response.statusCode });
    } catch (error) {
        const response: ResponseBase = { isSuccess: false, message: 'internal server error', statusCode: 500 };
        return NextResponse.json(response, { status: 500 });
    }
}
