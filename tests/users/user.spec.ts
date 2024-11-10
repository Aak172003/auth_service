import { AppDataSource } from "../../src/config/data-source";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import bcrypt from "bcrypt";

import request from "supertest";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";

describe("Get /auth/self", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5500");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        // Database Truncate

        // Yaha hum sirf data clean kr rhe hai , dubara connection create nhi kr rhe hai
        // so db ko sync krne ke lie hume db ke sth new connection create krna pdega
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwks.stop();
    });
    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should return the 200 status code ", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .get("/auth/self")
                .send();

            expect(response.statusCode).toBe(200);
        });

        it("should return valid json response", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .get("/auth/self")
                .send();

            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should return user data as response", async () => {
            // Register user
            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const userRepository = connection.getRepository(User);

            const savedUser = await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });

            console.log(
                "savedUser savedUser savedUser savedUser savedUser ================= ",
                savedUser,
            );
            // Generate a Token

            const accesstoken = jwks.token({
                sub: String(savedUser.id),
                role: savedUser.role,
            });
            // Add tooken in cookie and send with the request

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accesstoken}`])
                .send();

            // check is user id matches with the registered user

            expect((response.body as Record<string, string>).id).toBe(
                savedUser.id,
            );
        });
    });
    describe("Fields are missing", () => {});
});
