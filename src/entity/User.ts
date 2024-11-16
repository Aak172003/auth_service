import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
