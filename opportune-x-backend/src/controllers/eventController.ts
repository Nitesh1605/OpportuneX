import Event from '../models/Event';
import { Request, Response } from 'express';

// Get all events
export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get event by ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, date, location, description } = req.body;

    const newEvent = new Event({
      name,
      date,
      location,
      description,
      creator: req.user.id, // Assuming the user is authenticated
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update an event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};
