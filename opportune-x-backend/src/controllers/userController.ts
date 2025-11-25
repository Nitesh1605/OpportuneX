// src/controllers/userController.ts
import User from "../model/User";

// Function to get the user's saved events
export const getSavedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedEvents");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.savedEvents); // Return the saved events
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved events" });
  }
};

// Function to save an event to user's saved events
export const saveEventToUser = async (req, res) => {
  const { eventId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.savedEvents.includes(eventId)) {
      user.savedEvents.push(eventId);
      await user.save();
      return res.json({ message: "Event saved successfully" });
    }

    res.status(400).json({ error: "Event already saved" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save event" });
  }
};

// Function to delete a saved event from user's saved events
export const deleteSavedEvent = async (req, res) => {
  const { eventId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const index = user.savedEvents.indexOf(eventId);
    if (index > -1) {
      user.savedEvents.splice(index, 1); // Remove the event from savedEvents array
      await user.save();
      return res.json({ message: "Event removed from saved list" });
    }

    res.status(400).json({ error: "Event not found in saved list" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove event" });
  }
};
