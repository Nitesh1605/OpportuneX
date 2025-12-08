import Event, { IEvent } from "../models/Event";
import { AlertPreferences, IUser } from "../models/User";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const ALERT_PREF_DEFAULTS: AlertPreferences = {
  newMatches: true,
  weeklyDigest: false,
  deadlineReminderDays: 3,
  lookbackDays: 7,
};

const mergePrefs = (prefs?: AlertPreferences): AlertPreferences => ({
  ...ALERT_PREF_DEFAULTS,
  ...(prefs || {}),
});

const addDays = (from: Date, days: number) =>
  new Date(from.getTime() + days * DAY_IN_MS);

type PopulatedUser = IUser & { savedEvents?: IEvent[] };

export const buildUserAlerts = async (user: PopulatedUser) => {
  const prefs = mergePrefs(user.alertPreferences);
  const preferredTypes = user.preferredTypes || [];
  const now = new Date();

  const response: {
    newMatches: { count: number; events: IEvent[] };
    deadlineReminders: { count: number; events: IEvent[] };
    closingSoon: { count: number; events: IEvent[] };
  } = {
    newMatches: { count: 0, events: [] },
    deadlineReminders: { count: 0, events: [] },
    closingSoon: { count: 0, events: [] },
  };

  if (prefs.newMatches && preferredTypes.length > 0) {
    const lookbackStart = addDays(now, -prefs.lookbackDays);
    const newMatches = await Event.find({
      type: { $in: preferredTypes },
      createdAt: { $gte: lookbackStart },
    })
      .sort({ createdAt: -1 })
      .limit(12);

    response.newMatches = {
      count: newMatches.length,
      events: newMatches,
    };
  }

  const savedEvents = (user.savedEvents || []) as unknown as IEvent[];
  if (savedEvents.length > 0) {
    const reminderCutoff = addDays(now, prefs.deadlineReminderDays);
    const reminders = savedEvents.filter((event) => {
      if (!event.deadline) return false;
      const deadlineDate = new Date(event.deadline);
      return deadlineDate >= now && deadlineDate <= reminderCutoff;
    });
    response.deadlineReminders = {
      count: reminders.length,
      events: reminders.slice(0, 10),
    };
  }

  const closingSoon = await Event.find({
    deadline: { $gte: now, $lte: addDays(now, 7) },
    ...(preferredTypes.length ? { type: { $in: preferredTypes } } : {}),
  })
    .sort({ deadline: 1 })
    .limit(10);

  response.closingSoon = { count: closingSoon.length, events: closingSoon };

  return { alerts: response, preferences: prefs };
};

