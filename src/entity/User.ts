import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tenant } from "./Tenant";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    // @Column({select:false}) -> if i do globally , so jaha jaha i need passwrod i need to mention {select:["password"]} ,
    // which means it extract only password fields from whole user resposne
    @Column()
    password: string;

    @Column()
    role: string;

    // typeorm autom,atically create tenantId we don't need to give tenantId as key name
    @ManyToOne(() => Tenant)
    tenant: Tenant;
}
