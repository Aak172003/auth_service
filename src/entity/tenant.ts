import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "tenants" })
export class Tenant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 100 })
    name: string;

    @Column("varchar", { length: 300 })
    address: string;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}
