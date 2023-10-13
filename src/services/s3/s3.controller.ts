import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { S3Service } from './s3.service';
import { UploadS3Dto } from './dto/upload-s3.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadS3RequestBody } from './dto/swagger-s3.request';

@ApiTags('S3 Service')
@Controller('s3-service')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadS3RequestBody })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: any,
    @Body() uploadS3Data: UploadS3Dto,
  ): Promise<string> {
    return this.s3Service.uploadFile(file, uploadS3Data);
  }

  @Get()
  async getDownloadUrl(@Query('objectKey') objectKey: string): Promise<string> {
    const url = await this.s3Service.getDownloadUrl(objectKey);
    return url;
  }

  @Delete(':objectKey')
  async deleteObject(
    @Param('objectKey') objectKey: string,
  ): Promise<string> {
    return await this.s3Service.deleteObject(objectKey);
  }
}
