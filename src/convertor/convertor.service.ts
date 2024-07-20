import { BadRequestException, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { FileType } from './types';
import * as heicConvert from 'heic-convert';

@Injectable()
export class ConvertorService {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

  async convertImage(
    file: Express.Multer.File,
    targetType: FileType,
  ): Promise<Buffer> {
    if (file.size > this.MAX_FILE_SIZE) {
      return null;
    }

    let sharpInstance: sharp.Sharp;

    // Handle HEIC input
    if (file.mimetype === 'image/heic') {
      const heicBuffer = await heicConvert({
        buffer: file.buffer,
        format: 'JPEG', // Convert HEIC to JPEG first
        quality: 1,
      });
      sharpInstance = sharp(heicBuffer);
    } else {
      sharpInstance = sharp(file.buffer);
    }

    switch (targetType) {
      case FileType.WEBP:
        return sharpInstance.webp().toBuffer();
      case FileType.PNG:
        return sharpInstance.png().toBuffer();
      case FileType.JPEG:
        return sharpInstance.jpeg().toBuffer();
      case FileType.GIF:
        return sharpInstance.gif().toBuffer();
      case FileType.ICO:
        return sharpInstance.resize(250, 250).toBuffer();
      case FileType.JPG:
        return sharpInstance.jpeg().toBuffer();
      case FileType.HEIC:
        // Sharp doesn't support HEIC output, so we'll throw an error
        throw new BadRequestException('Converting to HEIC is not supported');
      default:
        throw new BadRequestException(
          `Unsupported target file type: ${targetType}`,
        );
    }
  }
}
