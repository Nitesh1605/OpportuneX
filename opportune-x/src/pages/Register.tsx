import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);
      setError("");
      const data = await registerUser(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(data.user.isAdmin ? "/admin" : "/dashboard");
    } catch (err) {
      console.error("Error registering:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Join OpportuneX to track opportunities.</p>
        {error && <p style={{ color: "#f87171", fontSize: "0.80rem", marginBottom: "1rem" }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[{ name: "name", label: "Name", type: "text", holder: "Your name" }, { name: "email", label: "Email", type: "email", holder: "you@example.com" }, { name: "password", label: "Password", type: "password", holder: "••••••••" }].map((f) => (
            <div key={f.name} className="auth-field">
              <label>{f.label}</label>
              <input className="auth-input" name={f.name} type={f.type} placeholder={f.holder} value={(formData as any)[f.name]} onChange={handleChange} required />
            </div>
          ))}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        
        <div className="auth-bottom" style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
