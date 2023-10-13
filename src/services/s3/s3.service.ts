import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { UploadS3Dto } from './dto/upload-s3.dto';

interface GetObjectRequestWithExpires extends AWS.S3.Types.GetObjectRequest {
  Expires: number;
}

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    });
    this.s3 = new AWS.S3();
  }

  async uploadFile(file: any, uploadS3Data: UploadS3Dto) {
    try {
      await this.s3_upload(
        file.buffer,
        process.env.AWS_S3_BUCKET,
        uploadS3Data.name,
        file.mimetype,
      );

      return 'Upload successful!';
    } catch (error) {
      return 'Upload failed!';
    }
  }

  async getDownloadUrl(objectKey: string): Promise<string> {
    const url = await this.s3_genarate_persigned_url(
      objectKey,
      process.env.AWS_S3_BUCKET,
    );
    return url;
  }

  async deleteObject(objectKey: string): Promise<string> {
    try {
      await this.s3_delete_object(objectKey, process.env.AWS_S3_BUCKET);

      return 'Object deleted successfully';
    } catch (error) {
      return 'Failed to delete object';
    }
  }

  async s3_delete_object(
    objectKey: string,
    bucket: string,
  ): Promise<object | void> {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: bucket,
      Key: objectKey,
    };

    try {
      const s3Response = await this.s3.deleteObject(params).promise();
      return s3Response;
    } catch (error) {
      console.log(error);
    }
  }

  async s3_upload(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ): Promise<object | void> {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (error) {
      console.log(error);
    }
  }

  async s3_genarate_persigned_url(
    objectKey: string,
    bucket: string,
  ): Promise<string> {
    const params: GetObjectRequestWithExpires = {
      Bucket: bucket,
      Key: objectKey,
      Expires: 30,
    };

    try {
      const url = await new Promise<string>((resolve, reject) => {
        this.s3.getSignedUrl('getObject', params, (err, url) => {
          if (err) {
            reject(err);
          } else {
            resolve(url);
          }
        });
      });

      return url;
    } catch (error) {
      return 'Failed to generate presigned URL';
    }
  }
}
