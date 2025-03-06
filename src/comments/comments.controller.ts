import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthenticatedRequest } from 'src/auth/auth.types';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) { }

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Req() req: AuthenticatedRequest,
    @Body() body: { content: string; targetId: number; parentId?: number },
  ) {
    return this.commentService.create(
      req.user.id,
      body.content,
      body.targetId,
      body.parentId,
    );
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':targetId')
  findByTarget(@Param('targetId') targetId: number) {
    return this.commentService.findByTarget(targetId);
  }
  @Delete('all')
  @UseGuards(AuthGuard)
  async deleteAll() {
    return this.commentService.deleteAllComments();
  }
  @Delete('bulk')
  @UseGuards(AuthGuard)
  deleteMultiple(
    @Req() req: AuthenticatedRequest,
    @Body() body: { commentIds: number[] },
  ) {
    return this.commentService.deleteMultiple(body.commentIds, req.user.id);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Req() req: AuthenticatedRequest, @Param('id') id: number) {
    return this.commentService.delete(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  edit(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: number,
    @Body() body: { content: string },
  ) {
    return this.commentService.edit(id, req.user.id, body.content);
  }
}
