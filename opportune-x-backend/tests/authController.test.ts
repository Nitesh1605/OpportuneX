import { register, login } from "../src/controllers/authController";
import User from "../src/models/User";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

jest.mock("../src/models/User");

// simple helper to create mock res
const createRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const createNext = () => jest.fn() as jest.MockedFunction<NextFunction>;

describe("authController.register", () => {
  it("returns 400 when required fields are missing", async () => {
    const req = {
      body: { name: "", email: "", password: "" },
    } as Request;
    const res = createRes();
    const next = createNext();

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "All fields required" });
  });

  it("creates a user and returns token when data is valid", async () => {
    const req = {
      body: { name: "Test", email: "test@example.com", password: "secret123" },
    } as Request;
    const res = createRes();
    const next = createNext();

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue({
      _id: "user-id",
      name: "Test",
      email: "test@example.com",
      isAdmin: false,
    });

    const signSpy = jest
      .spyOn(jwt, "sign")
      .mockReturnValue("fake-jwt-token" as any);

    await register(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(User.create).toHaveBeenCalled();
    expect(signSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: "fake-jwt-token" })
    );
  });
});

describe("authController.login", () => {
  it("returns 404 when user is not found", async () => {
    const req = {
      body: { email: "missing@example.com", password: "secret123" },
    } as Request;
    const res = createRes();
    const next = createNext();

    (User.findOne as jest.Mock).mockResolvedValue(null);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "User not found" });
  });
});