import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import bcrypt from "bcryptjs";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import { AppDataSource } from "../../src/set-up/data-source";

describe("POST /auth/login", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Database Truncate

        // Yaha hum sirf data clean kr rhe hai , dubara connection create nhi kr rhe hai
        // so db ko sync krne ke lie hume db ke sth new connection create krna pdega
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        if (connection) {
            await connection.destroy();
        } else {
            console.error("Connection is undefined during afterAll");
        }
    });

    describe("Given all fields", () => {
        it("should return the 200 status code ", async () => {
            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const userRepository = connection.getRepository(User);

            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/auth/login")
                .send(userData);

            // Assert(check output)
            expect(response.statusCode).toBe(200);
        });

        it("should return valid json response", async () => {
            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const userRepository = connection.getRepository(User);

            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });
            // Act on data
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/auth/login")
                .send(userData);

            console.log(
                "response ------------ login valid json response ----------- ",
                response.body,
            );
            console.log(
                "response --------- sttaus code ------------- ",
                response.statusCode,
            );
            // Assert -> application/json
            // response headers has content type information

            expect(response.statusCode).toBe(200);
            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });
    });
    describe("Fields are missing", () => {});
});
