// src/routes/eventRoutes.ts
import express from 'express';
import { saveEvent, removeEvent } from '../controllers/eventController';

const router = express.Router();

// Save event for user
router.post('/save/:eventId', saveEvent);

// Remove event from saved list for user
router.delete('/remove/:eventId', removeEvent);

export default router;
