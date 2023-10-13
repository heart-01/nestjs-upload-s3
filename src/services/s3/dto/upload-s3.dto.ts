import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UploadS3Dto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  name: string;
}
