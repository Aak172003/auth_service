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
        jwks = createJWKSMock("http://localhost:5501");
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
            // Generate a Token
            const accesstoken = jwks.token({
                sub: "1",
                role: Roles.CUSTOMER,
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accesstoken};`])
                .send();

            expect(response.statusCode).toBe(200);
        });

        it("should return valid json response", async () => {
            // Generate a Token
            const accesstoken = jwks.token({
                sub: "1",
                role: Roles.CUSTOMER,
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accesstoken};`])
                .send();

            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should return user data as response", async () => {
            // Register user
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

            // Generate a Token
            const accesstoken = jwks.token({
                sub: String(savedUser.id),
                role: savedUser.role,
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accesstoken};`])
                .send();

            // Ensure the response contains the user data
            expect((response.body as Record<string, string>).id).toBe(
                savedUser.id,
            );
        });

        it("should not the return password", async () => {
            // Register user
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

            // Generate a Token
            const accesstoken = jwks.token({
                sub: String(savedUser.id),
                role: savedUser.role,
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accesstoken};`])
                .send();

            // Ensure the response contains the user data
            expect(response.body).not.toHaveProperty("password");
        });

        it("should 401 status code if token does not exist in cookie", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .get("/auth/self")
                .send();

            // Ensure the response contains the user data
            expect(response.statusCode).toBe(401);
        });
    });
    describe("Fields are missing", () => {});
});
