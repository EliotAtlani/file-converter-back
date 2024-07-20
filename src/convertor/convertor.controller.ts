import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ConvertorService } from './convertor.service';
import { FileType } from './types';
import * as sharp from 'sharp';
@Controller('convertor')
export class ConvertorController {
  //Import services
  constructor(private readonly convertorService: ConvertorService) {}

  @Post('image')
  @UseInterceptors(FilesInterceptor('files'))
  async convertImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('type') type: FileType,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    if (!Object.values(FileType).includes(type)) {
      throw new BadRequestException('Invalid target file type');
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const extension = this.getFileType(file.originalname);
        if (extension === type) {
          return {
            fileName: file.originalname,
            buffer: file.buffer,
          };
        }
        const fileName = file.originalname.replace(/\.[^/.]+$/, `.${type}`);
        return {
          fileName,
          buffer: await this.convertorService.convertImage(file, type),
        };
      }),
    );

    return results;
  }

  private getFileType(filename: string): FileType {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (
      !extension ||
      !Object.values(FileType).includes(extension as FileType)
    ) {
      throw new BadRequestException(`Unsupported file type: ${extension}`);
    }
    return extension as FileType;
  }

  @Post('compress')
  @UseInterceptors(FilesInterceptor('files'))
  async compressFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('quality') quality: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const compressionQuality = parseInt(quality) || 80; // Default to 80 if not provided

    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const outputFormat = file.originalname.split('.').pop() || 'jpeg';

          const compressedBuffer = await sharp(file.buffer)
            .toFormat(outputFormat as keyof sharp.FormatEnum, {
              quality: compressionQuality,
            })
            .toBuffer();

          return {
            originalName: file.originalname,
            compressedName: `${file.originalname.split('.')[0]}.${outputFormat}`,
            originalSize: file.size,
            compressedSize: compressedBuffer.length,
            buffer: compressedBuffer,
          };
        } catch (error) {
          console.error(`Error compressing file ${file.originalname}:`, error);
          throw new BadRequestException(
            `Failed to compress file ${file.originalname}`,
          );
        }
      }),
    );

    return results;
  }

  @Post('resize-pixel')
  @UseInterceptors(FilesInterceptor('files'))
  async resizeFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('keepAspectRatio') aspectRatio: boolean,
    @Body('width') widthString: string,
    @Body('height') heightString: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const results = await Promise.all(
      files.map(async (file) => {
        try {
          let resizedBuffer: Buffer;
          if (aspectRatio) {
            if (widthString == 'auto') {
              resizedBuffer = await sharp(file.buffer)
                .resize({ height: parseInt(heightString) })
                .toBuffer();
            }
            if (heightString == 'auto') {
              resizedBuffer = await sharp(file.buffer)
                .resize({ width: parseInt(widthString) })
                .toBuffer();
            }
          } else {
            resizedBuffer = await sharp(file.buffer)
              .resize(parseInt(widthString), parseInt(heightString))
              .toBuffer();
          }

          return {
            originalName: file.originalname,
            resizedName: `${file.originalname.split('.')[0]}-resized.${file.originalname.split('.').pop()}`,
            buffer: resizedBuffer,
          };
        } catch (error) {
          console.error(`Error resizing file ${file.originalname}:`, error);
          throw new BadRequestException(
            `Failed to resize file ${file.originalname}`,
          );
        }
      }),
    );

    return results;
  }

  @Post('resize-percentage')
  @UseInterceptors(FilesInterceptor('files'))
  async resizeFilesPercentage(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('ratio') ratio: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const { width, height } = await sharp(file.buffer).metadata();
          console.log(width, height);
          console.log((100 - parseInt(ratio)) / 100);
          const resizedBuffer = await sharp(file.buffer)
            .resize(
              width * ((100 - parseInt(ratio)) / 100),
              height * ((100 - parseInt(ratio)) / 100),
            )
            .toBuffer();

          return {
            originalName: file.originalname,
            resizedName: `${file.originalname.split('.')[0]}-resized.${file.originalname.split('.').pop()}`,
            originalSize: file.size,
            resizedSize: resizedBuffer.length,
            buffer: resizedBuffer,
          };
        } catch (error) {
          console.error(`Error resizing file ${file.originalname}:`, error);
          throw new BadRequestException(
            `Failed to resize file ${file.originalname}`,
          );
        }
      }),
    );

    return results;
  }
}
