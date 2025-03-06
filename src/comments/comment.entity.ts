import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  content: string;

  @Column()
  targetId: number;

  @Column({ nullable: true })
  parentId?: number;

  @CreateDateColumn()
  createdAt: Date;
}
