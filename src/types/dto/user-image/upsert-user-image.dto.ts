import { UserImagePlace } from '@/enums/user-image-place.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpsertUserImageDto {
    @IsEnum(UserImagePlace)
    @IsNotEmpty()
    place!: UserImagePlace;
}
