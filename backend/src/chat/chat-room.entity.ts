import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Course } from '../courses/course.entity';
import { Chat } from './chat.entity';

@Entity('chat_rooms')
export class ChatRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 'General' })
    name: string;

    @ManyToOne(() => Course, (course) => course.chatRooms, { onDelete: 'CASCADE' })
    course: Course;

    @OneToMany(() => Chat, (chat) => chat.chatRoom)
    chats: Chat[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
