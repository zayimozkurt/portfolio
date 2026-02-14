import { UserService } from '@/services/user.service';
import { UpdateUserDto } from '@/types/dto/user/update-user.dto';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    const reqBody = await req.json();

    const { email, userName, password, fullName, headline, bio, about, location, cvUrl } = reqBody;

    const dto: UpdateUserDto = {
        email,
        userName,
        password,
        fullName,
        headline,
        bio,
        about,
        location,
        cvUrl,
    };

    const response = await UserService.update(dto);
    return NextResponse.json(response);
}
