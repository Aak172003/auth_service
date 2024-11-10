import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";

describe("Get /auth/self", () => {
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .get("/auth/self")
                .send();

            console.log(
                "user spec response ------------------------- ",
                response.statusCode,
            );

            expect(response.statusCode).toBe(200);
        });

        it("should return valid json response", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .get("/auth/self")
                .send();

            expect(response.statusCode).toBe(200);
            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });
    });
    describe("Fields are missing", () => {});
});
