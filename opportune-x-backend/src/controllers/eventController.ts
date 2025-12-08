import { Request, Response, NextFunction } from "express";
import Event from "../models/Event";

const parseDateOrNull = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const buildEventPayload = (
  body: Record<string, any>,
  options: { ensureCollectedAt?: boolean } = {}
) => {
  const payload = { ...body };
  payload.deadline =
    typeof body.deadline === "string" || body.deadline instanceof Date
      ? parseDateOrNull(body.deadline as string)
      : null;

  payload.collectedAt =
    typeof body.collectedAt === "string" || body.collectedAt instanceof Date
      ? parseDateOrNull(body.collectedAt as string)
      : null;

  if (options.ensureCollectedAt && !payload.collectedAt) {
    payload.collectedAt = new Date();
  }

  if (Array.isArray(body.tags)) {
    payload.tags = body.tags.map((tag: string) => tag.trim()).filter(Boolean);
  }

  return payload;
};

// Create event (admin)
export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, org, applyUrl } = req.body;

    if (!title || !org || !applyUrl) {
      return res.status(400).json({
        msg: "Title, organization and applyUrl are required",
      });
    }

    const event = await Event.create(
      buildEventPayload(req.body, { ensureCollectedAt: true })
    );
    res.status(201).json(event);
  } catch (err) {
    console.error("createEvent error:", err);
    next(err);
  }
};

// Get all events
export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      type,
      mode,
      source,
      search,
      tags,
      deadlineFrom,
      deadlineTo,
      preferredTypes,
      featured,
      limit,
      includeMeta,
      sortBy,
    } = req.query;

    const filter: Record<string, any> = {};

    if (type && type !== "All") {
      filter.type = type;
    }

    if (preferredTypes) {
      const typesArray = String(preferredTypes)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (typesArray.length > 0) {
        filter.type = { $in: typesArray };
      }
    }

    if (mode && mode !== "All") {
      filter.mode = new RegExp(`^${mode}$`, "i");
    }

    if (source) {
      filter.source = { $regex: source as string, $options: "i" };
    }

    if (search) {
      const searchRegex = { $regex: search as string, $options: "i" };
      filter.$or = [{ title: searchRegex }, { org: searchRegex }];
    }

    if (tags) {
      const tagList = Array.isArray(tags)
        ? (tags as string[])
        : String(tags)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
      if (tagList.length) {
        filter.tags = { $all: tagList };
      }
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (deadlineFrom || deadlineTo) {
      const window: Record<string, Date> = {};
      const fromDate = deadlineFrom
        ? parseDateOrNull(deadlineFrom as string)
        : null;
      const toDate = deadlineTo ? parseDateOrNull(deadlineTo as string) : null;

      if (fromDate) window.$gte = fromDate;
      if (toDate) window.$lte = toDate;

      if (Object.keys(window).length) {
        filter.deadline = window as any;
      }
    }

    const sort: Record<string, 1 | -1> =
      sortBy === "newest"
        ? { createdAt: -1 }
        : sortBy === "featured"
        ? { featured: -1, deadline: 1 }
        : { deadline: 1, createdAt: -1 };

    const query = Event.find(filter).sort(sort);

    if (limit) {
      query.limit(Number(limit));
    }

    const events = await query.exec();

    if (includeMeta === "true") {
      const countsByType = events.reduce<Record<string, number>>((acc, event) => {
        if (event.type) acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
      }, {});

      const countsBySource = events.reduce<Record<string, number>>(
        (acc, event) => {
          if (event.source) acc[event.source] = (acc[event.source] || 0) + 1;
          return acc;
        },
        {}
      );

      return res.json({
        events,
        meta: {
          total: events.length,
          countsByType,
          countsBySource,
        },
      });
    }

    res.json(events);
  } catch (err) {
    console.error("getAllEvents error:", err);
    next(err);
  }
};

// Get single event details
export const getEventDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("getEventDetails error:", err);
    next(err);
  }
};

// Update event (admin)
export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, org, applyUrl } = req.body;

    if (!title || !org || !applyUrl) {
      return res.status(400).json({
        msg: "Title, organization and applyUrl are required",
      });
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      buildEventPayload(req.body),
      {
        new: true,
      }
    );
    if (!updated) return res.status(404).json({ msg: "Event not found" });
    res.json(updated);
  } catch (err) {
    console.error("updateEvent error:", err);
    next(err);
  }
};

// Delete event (admin)
export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Event not found" });
    res.json({ msg: "Event deleted" });
  } catch (err) {
    console.error("deleteEvent error:", err);
    next(err);
  }
};
