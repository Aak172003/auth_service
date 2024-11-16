import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { DataSource } from "typeorm";
import request from "supertest";
import { Tenant } from "../../src/entity/Tenant";

describe("POST /tenants", () => {
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
        it("should return 201 status code and should return json format data", async () => {
            const tenantData = {
                name: "Tenant 1",
                address: "Address 1",
            };

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/tenants")
                .send(tenantData);

            console.log("this is response --------- ", response.statusCode);
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
            const response = await request(app as any)
                .post("/tenants")
                .send(tenantData);

            const tenantRepository = connection.getRepository(Tenant);

            const tenants = await tenantRepository.find();

            console.log("this is tenant ---------------- ", tenants);
            console.log("response ----------- ", response.statusCode);

            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData.name);
            expect(tenants[0].address).toBe(tenantData.address);
        });
    });

    describe("Fields are missing", () => {});
});
