import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import "dotenv/config";

const { DB_HOST, PORT = 3000 } = process.env;

describe("test api/users/login", () => {
    let server = null;

    beforeAll(() => {
        mongoose
            .connect(DB_HOST) //підключення до бази
            .then((server = app.listen(PORT, "Test connection successful")))
            .catch((error) => {
                console.log(error.message);
            });
    });

    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });

    test("auth test", async () => {
        const currentUser = {
            email: "catbars@mail.com",
            password: "123456",
        };
        const response = await request(app)
            .post("/api/users/login")
            .send(currentUser);
        expect(response.status).toBe(200);
    });

    test("auth test token", async () => {
        const currentUser = {
            email: "catbars@mail.com",
            password: "123456",
        };
        const response = await request(app)
            .post("/api/users/login")
            .send(currentUser);

        expect(response.body.token).toBeDefined();
        expect(
            typeof response.body.user.email &&
                typeof response.body.user.subscription
        ).toBe("string");
    });
});
