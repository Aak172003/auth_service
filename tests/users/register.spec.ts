import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
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
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            console.log("this is response  ---------- ", response.body);

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
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            console.log("this is response  ---------- ", response.body);

            // Assert -> application/json
            // response headers has content type information
            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
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
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            console.log("this is response ----- ", response);
        });
    });
    describe("Fields are missin", () => {});
});
