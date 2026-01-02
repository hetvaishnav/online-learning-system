import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { ChatRoom } from './chat-room.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  message: string;

  @ManyToOne(() => User, user => user.chats)
  sender: User;

  @ManyToOne(() => ChatRoom, chatRoom => chatRoom.chats, { onDelete: 'CASCADE' })
  chatRoom: ChatRoom;

  @CreateDateColumn()
  createdAt: Date;
}
