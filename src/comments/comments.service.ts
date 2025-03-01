import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(userId: number, content: string, targetId: number) {
    const comment = this.commentRepository.create({
      userId,
      content,
      targetId,
    });
    return this.commentRepository.save(comment);
  }

  async findAll() {
    return this.commentRepository.find();
  }

  async findByTarget(targetId: number) {
    return this.commentRepository.find({ where: { targetId } });
  }

  async delete(id: number, userId: number) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment Not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }

    return this.commentRepository.delete(id);
  }

  async deleteMultiple(commentIds: number[], userId: number) {
    const comments = await this.commentRepository.find({
      where: { id: In(commentIds) },
    });
    if (comments.length == 0) {
      throw new NotFoundException('No comments found for the given IDs');
    }

    const unauthorizedComments = comments.filter(
      (comment) => comment.userId !== userId,
    );
    if (unauthorizedComments.length > 0) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.delete({ id: In(commentIds) });

    return {
      message: 'Comments deleted Successfully',
      deletedCount: commentIds.length,
    };
  }
  async deleteAllComments() {
    await this.commentRepository.query(
      'TRUNCATE TABLE comment RESTART IDENTITY CASCADE;',
    );
    return { message: 'All comments deleted successfully' };
  }
}
