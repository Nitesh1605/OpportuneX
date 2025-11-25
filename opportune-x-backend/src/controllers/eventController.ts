import Event from "../models/Event";

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();  // Fetch all events from the database
    res.json(events);  // Send the events as the response
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
};
