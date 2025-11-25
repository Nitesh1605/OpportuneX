import express from 'express';
import { createEvent, getEvents, getEventById, updateEvent } from '../controllers/eventController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

// Get all events
router.get('/', getEvents);

// Get event by ID
router.get('/:id', getEventById);

// Create a new event (Protected route)
router.post('/', protect, createEvent);

// Update event (Protected route)
router.put('/:id', protect, updateEvent);

export default router;
