import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    userName?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    fullName?: string;

    @IsString()
    @IsOptional()
    headline?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    about?: string;

    @IsString()
    @IsOptional()
    location?: string;

    @IsOptional()
    @IsString()
    cvUrl?: string | null;
}
