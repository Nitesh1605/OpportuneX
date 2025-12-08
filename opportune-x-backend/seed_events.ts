const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, ".env") });

// Define Event Schema (simplified version of your actual model)
const eventSchema = new mongoose.Schema({
  title: String,
  org: String,
  type: String,
  mode: String,
  description: String,
  deadline: Date,
  location: String,
  applyUrl: String,
  source: String,
  sourceUrl: String,
  tags: [String],
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model("Event", eventSchema);

const realEvents = [
  {
    title: "Qubic | Hack the Future",
    org: "Qubic",
    type: "Hackathon",
    mode: "Virtual",
    description: "Build with Qubic's blockchain infrastructure or no-code integrations. Up to $44,550 in prizes for high-impact protocols or dApps.",
    deadline: new Date("2025-12-05"),
    location: "Global",
    applyUrl: "https://qubic.blog/2025/11/20/qubic-hack-the-future-hackathon/",
    source: "Devpost",
    sourceUrl: "https://qubic.blog/2025/11/20/qubic-hack-the-future-hackathon/",
    tags: ["Blockchain", "Web3", "Crypto", "No-Code"],
    featured: true
  },
  {
    title: "Global Hack Week: AI/ML",
    org: "Major League Hacking (MLH)",
    type: "Hackathon",
    mode: "Virtual",
    description: "A week-long celebration of AI and Machine Learning. Learn new skills, build projects, and connect with the MLH community.",
    deadline: new Date("2025-12-12"),
    location: "Global",
    applyUrl: "https://mlh.io/seasons/2026/events/global-hack-week-ai-ml",
    source: "MLH",
    sourceUrl: "https://mlh.io/seasons/2026/events/global-hack-week-ai-ml",
    tags: ["AI", "Machine Learning", "Beginner Friendly", "MLH"],
    featured: true
  },
  {
    title: "Open Source AI Hackathon #12",
    org: "Tech Jobs for Good",
    type: "Hackathon",
    mode: "Hybrid",
    description: "Hands-on hackathon focused on building AI applications and Agents using Large Language Models (LLMs).",
    deadline: new Date("2025-12-14"),
    location: "San Francisco / Virtual",
    applyUrl: "https://www.techjobsforgood.com/events/2024-12-14-open-source-ai-hackathon-12-ai-agents",
    source: "Eventbrite",
    sourceUrl: "https://www.techjobsforgood.com/",
    tags: ["AI Agents", "LLM", "Open Source", "GenAI"],
    featured: false
  },
  {
    title: "SANS Holiday Hack Challenge 2025",
    org: "SANS Institute",
    type: "Challenge",
    mode: "Virtual",
    description: "A free, high-quality cybersecurity game with hands-on challenges covering forensics, web pentesting, and more.",
    deadline: new Date("2026-01-05"),
    location: "Global",
    applyUrl: "https://sans.org/HolidayHack",
    source: "SANS",
    sourceUrl: "https://sans.org/HolidayHack",
    tags: ["Cybersecurity", "CTF", "Hacking", "Security"],
    featured: true
  },
  {
    title: "Diversion 2K26",
    org: "IEM-ACM Student Chapter",
    type: "Hackathon",
    mode: "Hybrid",
    description: "Annual hackathon focusing on Web Development, Web3, AI/ML, AR/VR, and Cloud Computing.",
    deadline: new Date("2025-12-15"),
    location: "Kolkata, India",
    applyUrl: "https://devfolio.co/hackathons/diversion-2k26",
    source: "Devfolio",
    sourceUrl: "https://devfolio.co/hackathons/diversion-2k26",
    tags: ["Web3", "Cloud", "AR/VR", "Student Friendly"],
    featured: false
  },
  {
    title: "ETHMumbai 2026",
    org: "Devfolio",
    type: "Hackathon",
    mode: "In-Person",
    description: "The first Ethereum hackathon in Mumbai, exploring real-world use cases for the Ethereum ecosystem.",
    deadline: new Date("2026-01-31"),
    location: "Mumbai, India",
    applyUrl: "https://devfolio.co/hackathons/ethmumbai",
    source: "Devfolio",
    sourceUrl: "https://devfolio.co/hackathons/ethmumbai",
    tags: ["Ethereum", "Blockchain", "Smart Contracts", "India"],
    featured: true
  }
];

const seedDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    if (uri) {
        uri = uri.trim().replace(/^['"]|['"]$/g, "");
    }
    
    if (!uri) {
        console.error("MONGO_URI is missing");
        process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB...");

    // Optional: Clear existing events if you want a fresh start
    // await Event.deleteMany({}); 
    // console.log("Cleared existing events...");

    const injected = await Event.insertMany(realEvents);
    console.log(`Successfully added ${injected.length} real events!`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
