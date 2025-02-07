import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    description: string;
    @Column({ type: 'decimal', nullable: true })
    salesValue: number | null;
    @Column('int')
    stock: number | null;
    @Column({ nullable: true })
    images: string;
}