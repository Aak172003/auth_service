import { AppDataSource } from "../../src/Config/data-source";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";

import request from "supertest";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";
import { Tenant } from "../../src/entity/tenant";
import { createTenant } from "../../src/utils";

describe("POST /users", () => {
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
        it("should persist the user in the database", async () => {
            const tenant = await createTenant(connection.getRepository(Tenant));

            console.log("user test -------- tenant create ---------- ", tenant);
            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
                tenantId: tenant.id,
                role: Roles.MANAGER,
            };

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            await request(app as any)
                .post("/users")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send(userData);

            const userRepository = connection.getRepository(User);

            const users = await userRepository.find();

            console.log("response -------- ");

            expect(users).toHaveLength(1);
            expect(users[0].email).toBe(userData.email);
        });

        it("should create manager user", async () => {
            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
                tenantId: 1,
                role: Roles.MANAGER,
            };

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            await request(app as any)
                .post("/users")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send(userData);

            const userRepository = connection.getRepository(User);

            const users = await userRepository.find();

            console.log("response -------- ");

            expect(users).toHaveLength(1);
            expect(users[0].role).toBe(Roles.MANAGER);
        });

        it("should return 403 if non admin tries to create a user", async () => {
            const accessToken = jwks.token({
                sub: "1",
                role: Roles.CUSTOMER,
            });

            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
                tenantId: 1,
            };

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/users")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send(userData);

            const userRepository = connection.getRepository(User);

            const users = await userRepository.find();

            console.log("response -------- ");

            expect(response.statusCode).toBe(403);

            expect(users).toHaveLength(0);
        });
    });
    describe("Fields are missing", () => {});
});
