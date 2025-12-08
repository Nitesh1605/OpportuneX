import { buildUserAlerts } from "../src/services/alertService";
import Event from "../src/models/Event";

jest.mock("../src/models/Event");

const createQueryMock = (result: any[]) => {
  const limit = jest.fn().mockResolvedValue(result);
  const sort = jest.fn().mockReturnValue({ limit });
  return { sort, limit };
};

describe("alertService.buildUserAlerts", () => {
  it("returns new matches and deadline reminders", async () => {
    const user: any = {
      preferredTypes: ["Hackathon"],
      alertPreferences: { newMatches: true, deadlineReminderDays: 2, lookbackDays: 5 },
      savedEvents: [
        { _id: "1", title: "Saved", deadline: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      ],
    };

    const newMatchesQuery = createQueryMock([
      { _id: "2", title: "Fresh Hackathon", deadline: new Date() },
    ]);
    const closingSoonQuery = createQueryMock([
      { _id: "3", title: "Closing Soon", deadline: new Date() },
    ]);

    (Event.find as jest.Mock)
      .mockReturnValueOnce({ sort: newMatchesQuery.sort })
      .mockReturnValueOnce({ sort: closingSoonQuery.sort });

    const result = await buildUserAlerts(user);

    expect(result.alerts.newMatches.count).toBe(1);
    expect(result.alerts.deadlineReminders.count).toBe(1);
    expect(result.alerts.closingSoon.count).toBe(1);
  });
});

