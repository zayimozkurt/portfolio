import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserSignUpDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    userName!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsString()
    @IsNotEmpty()
    fullName!: string;

    @IsString()
    @IsNotEmpty()
    headline!: string;

    @IsString()
    @IsNotEmpty()
    bio!: string;

    @IsString()
    @IsNotEmpty()
    about!: string;

    @IsString()
    @IsNotEmpty()
    location!: string;
}
