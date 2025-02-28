import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req, @Body() body: { content: string; targetId: number }) {
    return this.commentService.create(req.user.id, body.content, body.targetId);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':targetId')
  findByTarget(@Param('targetId') targetId: number) {
    return this.commentService.findByTarget(targetId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Req() req, @Param('id') id: number) {
    return this.commentService.delete(id, req.user.id);
  }
}
