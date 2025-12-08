import { Request, Response, NextFunction } from "express";
import {
  getAllEvents,
  getEventDetails,
} from "../src/controllers/eventController";
import Event from "../src/models/Event";

jest.mock("../src/models/Event");

const createRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const createNext = () => jest.fn() as jest.MockedFunction<NextFunction>;

const mockQueryChain = (data: any[]) => {
  const exec = jest.fn().mockResolvedValue(data);
  const chain: any = {};
  chain.sort = jest.fn().mockReturnValue(chain);
  chain.limit = jest.fn().mockReturnValue(chain);
  chain.exec = exec;
  return chain;
};

describe("eventController.getAllEvents", () => {
  it("returns events with metadata when includeMeta is true", async () => {
    const req = { query: { includeMeta: "true" } } as unknown as Request;
    const res = createRes();
    const next = createNext();
    const chain = mockQueryChain([
      { _id: "1", title: "Test Event", org: "Test Org", type: "Hackathon" },
    ]);

    (Event.find as jest.Mock).mockReturnValue({
      sort: chain.sort,
      limit: chain.limit,
      exec: chain.exec,
    });

    await getAllEvents(req, res, next);

    expect(Event.find).toHaveBeenCalledWith({});
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        events: expect.arrayContaining([
          expect.objectContaining({ title: "Test Event" }),
        ]),
        meta: expect.objectContaining({ total: 1 }),
      })
    );
  });
});

describe("eventController.getEventDetails", () => {
  it("returns 404 when event not found", async () => {
    const req = { params: { id: "nonexistent" } } as unknown as Request;
    const res = createRes();
    const next = createNext();

    (Event.findById as jest.Mock).mockResolvedValue(null);

    await getEventDetails(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Event not found" });
  });
});