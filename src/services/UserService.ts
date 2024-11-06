import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";

export class UserService {
    // Method 1
    constructor(private userRepository: Repository<User>) {}

    // Method 2
    // userRepositery: Repository<User>;

    // // The userRepositery will have all the properties and methods that the Repository class provides.
    // // UserRepositery is not a custom thing , so we don't need to pass from any where , we simplement create in create in constructor

    // constructor(userRepositery: Repository<User>) {
    //     this.userRepositery = userRepositery;
    // }

    async create({ firstName, lastName, email, password }: UserData) {
        // const userRepository = AppDataSource.getRepository(User);

        console.log(
            "object firstName, lastName, email, password  --------------- ",
            firstName,
            lastName,
            email,
            password,
        );
        try {
            const savedUser = await this.userRepository.save({
                firstName,
                lastName,
                email,
                password,
                role: Roles.CUSTOMER,
            });

            console.log("savedUser ------------ ", savedUser);

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
}
