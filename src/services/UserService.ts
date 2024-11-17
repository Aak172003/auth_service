import { Repository } from "typeorm";
import { User } from "../entity/User";
import { LimitedUserData, UserData } from "../types";
import createHttpError from "http-errors";
import { CredentialService } from "./CredentialService";

export class UserService {
    // Method 1
    constructor(
        private userRepository: Repository<User>,
        private credentialService: CredentialService,
    ) {}

    // Method 2
    // userRepositery: Repository<User>;

    // // The userRepositery will have all the properties and methods that the Repository class provides.
    // // UserRepositery is not a custom thing , so we don't need to pass from any where , we simplement create in create in constructor

    // constructor(userRepositery: Repository<User>) {
    //     this.userRepositery = userRepositery;
    // }

    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
    }: UserData) {
        // Find any user is already register with the email id or not
        const findUser = await this.userRepository.findOne({
            where: { email: email },
        });

        if (findUser) {
            const error = createHttpError(400, "Email already exist");
            throw error;
        }
        // hashed the password
        // const saltRounds = 10;
        // const hashedPassword = await bcrypt.hash(password, saltRounds);

        const hashedPassword =
            await this.credentialService.giveHashedPassword(password);
        try {
            const savedUser = await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                tenantId: tenantId ? { id: tenantId } : undefined,
            });
            return savedUser;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            const error = createHttpError(
                500,
                "Failed to store the data in database",
            );

            throw error;
        }
    }

    async findByEmailWithPassword(email: string) {
        // as entity me maine password ko select false kia hai to wo yaha hashedpassword milega nhi , so wo kisse compare krega
        // that's why here maine all keys with password ko bhi explicitely add kia ki wo bhi mile mujhe
        const user = await this.userRepository.findOne({
            where: { email },
            select: [
                "id",
                "firstName",
                "lastName",
                "email",
                "password",
                "role",
            ],
        });
        return user;
    }

    async findById(user_id: number) {
        const user = await this.userRepository.findOne({
            where: { id: user_id },
        });
        return user;
    }

    async update(
        userId: number,
        { firstName, lastName, role }: LimitedUserData,
    ) {
        try {
            const updatUser = await this.userRepository.update(userId, {
                firstName,
                lastName,
                role,
            });

            console.log(
                "updatUser form user service ================== ",
                updatUser,
            );

            return updatUser;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            const error = createHttpError(
                500,
                "Failed to update the user in the database",
            );
            throw error;
        }
    }

    async getAll() {
        return await this.userRepository.find();
    }

    async deleteById(userId: number) {
        return await this.userRepository.delete(userId);
    }
}
