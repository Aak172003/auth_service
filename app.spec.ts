import app from "./src/app";
import { calculateDiscount } from "./src/utils";
import request from "supertest";

// We can skip any test cases for testing

describe("App", () => {
    it("should return correct discount amount ", () => {
        const discount = calculateDiscount(100, 10);
        expect(discount).toBe(10);
    });

    it("should return 200 statusCode ", async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        const response = await request(app as any).get("/");
        expect(response.statusCode).toBe(200);
    });
});
