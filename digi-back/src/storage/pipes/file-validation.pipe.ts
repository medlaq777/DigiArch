import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      throw new BadRequestException('No file provided');
    }
    
    // Check mime type (basic check)
    if (value.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    // Advanced: Check magic numbers could be implemented here for security
    // PDF Magic Number: %PDF (25 50 44 46)

    return value;
  }
}
