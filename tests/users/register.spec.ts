import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/entity/User";
import { AppDataSource } from "../../src/config/data-source";
// import { truncateTables } from "../../src/utils";
import { DataSource } from "typeorm";
import { Roles } from "../../src/constants";
import { isJWT } from "../../src/utils";

describe("POST /auth/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();

        console.log("connection is created --------- ", connection);
    });

    beforeEach(async () => {
        // Database Truncate

        // Yaha hum sirf data clean kr rhe hai , dubara connection create nhi kr rhe hai
        // so db ko sync krne ke lie hume db ke sth new connection create krna pdega

        // await truncateTables(connection);

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

        it("should return id of created user", async () => {
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

            console.log(
                "should return id of created user ----------------- ",
                response.body,
            );

            expect(response.body).toHaveProperty("id");
            const userRepository = connection.getRepository(User);

            const users = await userRepository.find();

            // Check here response id and user id in db are same or not
            expect((response.body as Record<string, string>).id).toBe(
                users[0].id,
            );
        });

        it("should assign a customer role", async () => {
            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };
            // Act on data

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            await request(app as any)
                .post("/auth/register")
                .send(userData);

            const userRepository = connection.getRepository(User);

            const users = await userRepository.find();

            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });

        it("should store the hashed password", async () => {
            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };
            // Act on data

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            await request(app as any)
                .post("/auth/register")
                .send(userData);

            const userRepository = connection.getRepository(User);

            const users = await userRepository.find();

            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);

            // Check here this hashd password is really match the wile card pattern
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it("should return 400 status code if given email is already exist", async () => {
            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };
            // Act on data

            const userRepository = connection.getRepository(User);

            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            console.log(
                "should return 400 status code if given email is already exist",
                response.body,
            );

            const users = await userRepository.find();

            console.log("users -----------", users);
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });

        // ---------------------------------------- JWT Token TestCases -------------------------------------------

        test("should return the acess token and refresh token inside a cookie ", async () => {
            // Arrange the data
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            console.log(
                "should return the acess token and refresh token inside a cookie  ",
                response.body,
            );

            // Assert
            let accessToken = null;
            let refreshToken = null;

            // accessToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1Iiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzMwNTIzMzk3LCJleHAiOjE3MzA1MjY5OTcsImlzcyI6ImF1dGgtc2VydmljZSJ9.iMeBOMOUJxj-OAzEPIBfTuE3iyELSIMlETMjJy3zViyzYIiFv83XxXN8eJ4qOHtmiael2uwBks3uQafBXOm6PE2ep9rPLLNlLHxzegWqG2Eop9hj6uYpuegJ_1GuXiVBdEjqb4p9WjyoD55i4aBxQnRP1qU9Sfw2eQOW16scFn655Gqku3ucQ9_7RdOjcH-ryM-oID03mLLqsjsmi8tdSrHCPpWSzrnj8vdFzm81BFqNCsygcYRwoBfK-rRpwOrWMmfRUv2JsI-hBsaA77R0u83-gx1svfTVghIh8RUSFjn9bCYOZb3ThCKWIn3KgQ25d_4ZjBCvCRvUhUqqNXIyLQ; Expires=Sat, 02 Nov 2024 05:56:37 GMT; Max-Age=3600; Domain=localhost; Path=/; HttpOnly; SameSite=Strict
            // refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1Iiwicm9sZSI6IkFkbWluIiwiaWQiOiIyIiwiaWF0IjoxNzMwNTIzMzk3LCJleHAiOjE3MzA1MjY5OTcsImlzcyI6ImF1dGgtc2VydmljZSIsImp0aSI6IjIifQ.8oITaVQ5F2w1QwGKxjskSdPxU8oYcacklKryogaQTU4; Expires=Sun, 02 Nov 2025 04:56:37 GMT; Max-Age=31536000; Domain=localhost; Path=/; HttpOnly; SameSite=Strict

            const cookies = response.headers["set-cookie"] || [];
            console.log("coookie ---------------", cookies);

            for (const cookie of cookies) {
                console.log("cookie ------------- ", cookie);

                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split("=")[1].split(";")[0];
                }

                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split("=")[1].split(";")[0];
                }
            }

            console.log(
                "accessToken ::::::::::::::::::::::::::::::::::::::::",
                accessToken,
            );
            console.log(
                "refreshToken ::::::::::::::::::::::::::::::::::::::::",
                refreshToken,
            );
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(isJWT(accessToken)).toBe(true);
            expect(isJWT(refreshToken)).toBe(true);
        });
    });
    describe("Fields are missing", () => {
        it("should reture 400 status code  if email field is missing", async () => {
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "",
                password: "secret",
            };
            // Act on data
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            const userRepository = connection.getRepository(User);

            // return list of user
            const users = await userRepository.find();
            expect(response.statusCode).toBe(400);
            // Here make sure , if email is not revecive so no new user create in db
            expect(users).toHaveLength(0);
        });

        it("should reture 400 status code  if firstName field is missing", async () => {
            const userData = {
                firstName: "",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "secret",
            };
            // Act on data
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            const userRepository = connection.getRepository(User);

            // return list of user
            const users = await userRepository.find();
            expect(response.statusCode).toBe(400);
            // Here make sure , if email is not revecive so no new user create in db
            expect(users).toHaveLength(0);
        });

        it("should reture 400 status code  if lastName field is missing", async () => {
            const userData = {
                firstName: "Rakesh",
                lastName: "",
                email: "rakesh@mern.space",
                password: "secret",
            };
            // Act on data
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            const userRepository = connection.getRepository(User);

            // return list of user
            const users = await userRepository.find();
            expect(response.statusCode).toBe(400);
            // Here make sure , if email is not revecive so no new user create in db
            expect(users).toHaveLength(0);
        });

        it("should reture 400 status code  if password field is missing", async () => {
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "",
            };
            // Act on data
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            const userRepository = connection.getRepository(User);

            // return list of user
            const users = await userRepository.find();
            expect(response.statusCode).toBe(400);
            // Here make sure , if email is not revecive so no new user create in db
            expect(users).toHaveLength(0);
        });

        // Pending Tests

        it.todo(
            "should return message (Password is too short) if password length less than 8 ",
        );

        it.todo(
            "should return message (Password is too long) if password length greater than 10 ",
        );
    });

    describe("Fields are not in ptoper format", () => {
        it("shoould truim the email field", async () => {
            // Arrange,
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "          rakesh@mern.space          ",
                password: "secret",
            };

            // Act
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            await request(app as any)
                .post("/auth/register")
                .send(userData);

            const userRepositery = connection.getRepository(User);
            const users = await userRepositery.find();

            const trimEmail = userData.email.trim();

            console.log("users[0].email ------------------ ", users[0].email);
            expect(users[0].email).toBe(trimEmail);
        });

        // Pending Tests

        test.todo(
            "should return 400 status code if email is not as valid email",
        );
        test.todo(
            "should return 400 status code if password length is less than 8 characters",
        );
    });
});
