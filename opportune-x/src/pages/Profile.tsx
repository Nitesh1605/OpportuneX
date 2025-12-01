import React, { useEffect, useState } from "react";
import { getProfile, removeSavedEvent } from "../api/user";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token") || undefined;
      const data = await getProfile(token);
      setUser(data);
    };
    load();
  }, []);

  const handleRemove = async (eventId: string) => {
    const token = localStorage.getItem("token") || undefined;
    await removeSavedEvent(eventId, token);
    setUser({
      ...user,
      savedEvents: user.savedEvents.filter((e: any) => e._id !== eventId)
    });
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>My Profile</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>

      <h3>Saved Events</h3>
      {user.savedEvents.length === 0 ? (
        <p>No saved events</p>
      ) : (
        user.savedEvents.map((event: any) => (
          <div key={event._id} style={{ border: "1px solid #ccc", padding: 10 }}>
            <h4>{event.title}</h4>
            <p>{event.location}</p>
            <button onClick={() => handleRemove(event._id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;
