import { Controller, Post, Get, UseInterceptors, UploadedFile, UseGuards, Req, Query, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileValidationPipe } from '../storage/pipes/file-validation.pipe';
import type { Response } from 'express';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Req() req,
  ) {
    return this.documentsService.uploadDocument(file, req.user.userId);
  }

  @Get('search')
  async search(@Query() query) {
    return this.documentsService.search(query);
  }

  @Get('stream/:id')
  async streamFile(@Param('id') id: string, @Req() req, @Res() res: Response) {
    const { stream, doc } = await this.documentsService.getDocumentStream(id, req.user.userId);
    
    res.set({
      'Content-Type': doc.mimeType,
      'Content-Disposition': `inline; filename="${doc.originalName}"`,
    });

    stream.pipe(res);
  }
}
