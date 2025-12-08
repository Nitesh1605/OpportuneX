import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, removeSavedEvent, updateProfile } from "../api/user";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token") || undefined;
      if (!token) return;
      const data = await getProfile();
      setUser(data);
      setFormData({ name: data.name, email: data.email, password: "" });
    };
    load();
  }, []);

  const handleRemove = async (eventId: string) => {
    const token = localStorage.getItem("token") || undefined;
    if (!token) return;
    await removeSavedEvent(eventId);
    setUser({
      ...user,
      savedEvents: user.savedEvents.filter((e: any) => e._id !== eventId),
    });
  };

  const handleApplyOrView = (event: any) => {
    if (event.applyUrl) {
      window.open(event.applyUrl, "_blank", "noopener,noreferrer");
    } else {
      navigate(`/events/${event._id || event.id}`);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const updatedUser = await updateProfile(formData);
      setUser({ ...user, name: updatedUser.name, email: updatedUser.email });
      setIsEditing(false);
      if (formData.password) {
        alert("Password updated. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to update profile");
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <div className="page-header">
        <h2 className="page-title">My Profile</h2>
      </div>

      <div className="detail-card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      </div>

      {isEditing && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <div className="modal-header">
              <h3 className="modal-title">Edit Profile</h3>
              <button className="modal-close" onClick={() => setIsEditing(false)}>×</button>
            </div>
            {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
            <form onSubmit={handleUpdate}>
              <label className="modal-label">Name</label>
              <input
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <label className="modal-label">Email</label>
              <input
                className="input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <label className="modal-label">New Password (leave blank to keep current)</label>
              <input
                className="input"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h3>Saved Events</h3>
      {user.savedEvents.length === 0 ? (
        <p>No saved events</p>
      ) : (
        <div className="event-grid">
          {user.savedEvents.map((event: any) => (
            <div key={event._id} className="event-card">
              <h4 className="event-title">{event.title}</h4>
              {event.location && <p className="event-meta">{event.location}</p>}
              <div className="event-card-actions">
                <button className="btn btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }} onClick={() => handleApplyOrView(event)}>View</button>
                <button className="btn btn-danger" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }} onClick={() => handleRemove(event._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
