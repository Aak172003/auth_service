import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { DataSource } from "typeorm";
import request from "supertest";
import { Tenant } from "../../src/entity/Tenant";
import createJWKSMock from "mock-jwks";
import { Roles } from "../../src/constants";

describe("POST /tenants", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string;

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

        // Generate a Token
        adminToken = jwks.token({
            sub: "1",
            role: Roles.ADMIN,
        });
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should return 201 status code and should return json format data", async () => {
            const tenantData = {
                name: "Tenant 1",
                address: "Address 1",
            };

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/tenants")
                .set("Cookie", [`accessToken=${adminToken};`])

                .send(tenantData);

            // Assert(check output)
            expect(response.statusCode).toBe(201);
            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should create tenant in the database", async () => {
            const tenantData = {
                name: "Tenant 1",
                address: "Address 1",
            };

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            await request(app as any)
                .post("/tenants")
                .set("Cookie", [`accessToken=${adminToken};`])

                .send(tenantData);

            const tenantRepository = connection.getRepository(Tenant);

            const tenants = await tenantRepository.find();

            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData.name);
            expect(tenants[0].address).toBe(tenantData.address);
        });

        it("should return 401 if user is not authenticated", async () => {
            const tenantData = {
                name: "Tenant 1",
                address: "Address 1",
            };

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/tenants")
                .send(tenantData);

            expect(response.statusCode).toBe(401);
            const tenantRepository = connection.getRepository(Tenant);

            const tenants = await tenantRepository.find();

            expect(tenants).toHaveLength(0);
        });
    });

    describe("Fields are missing", () => {});
});
