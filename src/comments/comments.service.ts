import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) { }

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
}
