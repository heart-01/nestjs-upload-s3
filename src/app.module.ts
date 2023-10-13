import { S3Module } from './services/s3/s3.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [S3Module],
  controllers: [],
  providers: [],
})
export class AppModule {}
