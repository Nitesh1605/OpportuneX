import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "../src/routes/userRoutes";
import { updateProfile } from "../src/controllers/userController";
import User from "../src/models/User";

// Mock auth middleware
jest.mock("../src/middleware/authMiddleware", () => (req: any, _res: any, next: any) => {
    req.user = { id: "mockUserId" };
    next();
});

// Mock User model
jest.mock("../src/models/User");

const app = express();
app.use(express.json());
app.use("/api/user", userRoutes);

describe("User Controller - updateProfile", () => {
    it("should update user name and email", async () => {
        const mockUser = {
            _id: "mockUserId",
            name: "Old Name",
            email: "old@example.com",
            save: jest.fn(),
        };

        (User.findById as jest.Mock).mockResolvedValue(mockUser);

        const res = await request(app)
            .put("/api/user/profile")
            .send({ name: "New Name", email: "new@example.com" });

        expect(res.status).toBe(200);
        expect(mockUser.name).toBe("New Name");
        expect(mockUser.email).toBe("new@example.com");
        expect(mockUser.save).toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
        (User.findById as jest.Mock).mockResolvedValue(null);

        const res = await request(app)
            .put("/api/user/profile")
            .send({ name: "New Name" });

        expect(res.status).toBe(404);
    });
});
