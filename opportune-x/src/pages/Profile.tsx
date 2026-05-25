import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api/user";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        setUser(data);
        setFormData({ name: data.name, email: data.email, password: "" });
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    load();
  }, []);

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

  if (!user) return <p style={{ padding: "2rem" }}>Loading profile...</p>;

  return (
    <div className="container" style={{ maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <div className="page-header">
        <h2 className="page-title">My Profile</h2>
      </div>

      <div className="list-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p><b>Name:</b> {user.name}</p>
          <p style={{ margin: 0 }}><b>Email:</b> {user.email}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
      </div>

      {isEditing && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <div className="modal-header">
              <h3 className="modal-title" style={{ margin: 0 }}>Edit Profile</h3>
              <button className="modal-close" onClick={() => setIsEditing(false)}>×</button>
            </div>
            {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              <label>Name</label>
              <input className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              
              <label>Email</label>
              <input className="input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              
              <label>New Password (leave blank to keep current)</label>
              <input className="input" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              
              <div className="modal-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem" }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
