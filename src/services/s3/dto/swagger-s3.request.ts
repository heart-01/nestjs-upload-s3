import { ApiProperty } from '@nestjs/swagger';

export class UploadS3RequestBody {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true, type: 'string', format: 'binary' })
  file: any;
}
