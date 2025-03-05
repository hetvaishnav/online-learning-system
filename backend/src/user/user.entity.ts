import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { Role } from 'src/shared/enums/role.enum';

@Entity('users')  // Table name
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, name:"fullname"})
  fullName: string;

  @Column({  name:"email",length: 255, unique: true })
  email: string;

  @Column({ name:"password", type: 'text' })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT,
  })
  role: Role;

  @Column({ type: 'text', nullable: true })
  profilePicture?: string;


  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
