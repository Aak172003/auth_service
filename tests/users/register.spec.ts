import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/entity/User";
import { AppDataSource } from "../../src/config/data-source";
import { truncateTables } from "../../src/utils";
import { DataSource } from "typeorm";

describe("POST /auth/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();

        console.log("connection is created --------- ", connection);
    });

    beforeEach(async () => {
        // Database Truncate

        await truncateTables(connection);
    });

    afterAll(async () => {
        if (connection) {
            await connection.destroy();
        } else {
            console.error("Connection is undefined during afterAll");
        }
    });

    describe("Given all fields", () => {
        it("should return the 201 status code ", async () => {
            // AAA
            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };
            // Act on data

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            // Assert(check output)
            expect(response.statusCode).toBe(201);
        });

        it("should return valid json response", async () => {
            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };
            // Act on data
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            // Assert -> application/json
            // response headers has content type information
            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should persist the user in database", async () => {
            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };
            // Act on data

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            console.log("this is response ----- ", response.body);

            const userRepository = connection.getRepository(User);

            console.log("userrepository ------------ ", userRepository);

            const user = await userRepository.find();

            expect(user).toHaveLength(1);
            expect(user[0].email).toEqual(userData.email);
            expect(user[0].firstName).toEqual(userData.firstName);
            expect(user[0].lastName).toEqual(userData.lastName);
        });
    });
    describe("Fields are missin", () => {});
});
