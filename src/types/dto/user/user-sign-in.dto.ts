import { IsNotEmpty, IsString } from 'class-validator';

export class UserSignInDto {
    @IsString()
    @IsNotEmpty()
    password!: string;
}
