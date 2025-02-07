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
    @Column({ type: 'simple-array', nullable: true })
    images: string[] | null;
}