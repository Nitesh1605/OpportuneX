const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

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
  createdAt: { type: Date, default: Date.now },
});

const EventModel = mongoose.model("Event", eventSchema);

const jobs = [
  {
    title: "Software Engineer, New Grad 2025",
    org: "Google",
    type: "Job",
    mode: "In-Person",
    description:
      "Join Google as a new grad Software Engineer. Work on products used by billions of people. Competitive salary, benefits, and a world-class engineering culture.",
    deadline: null,
    location: "Multiple Locations, USA",
    applyUrl: "https://www.google.com/about/careers/applications/jobs/results/?category=SOFTWARE_ENGINEERING&employment_type=FULL_TIME",
    source: "Google Careers",
    sourceUrl: "https://careers.google.com",
    tags: ["SWE", "New Grad", "Full-Time", "Backend", "Frontend"],
    featured: true,
  },
  {
    title: "Frontend Engineer",
    org: "Vercel",
    type: "Job",
    mode: "Remote",
    description:
      "Build the future of web development at Vercel. Work on the platform powering millions of developers worldwide. Remote-first, async culture.",
    deadline: null,
    location: "Remote (Global)",
    applyUrl: "https://vercel.com/careers",
    source: "Vercel Careers",
    sourceUrl: "https://vercel.com/careers",
    tags: ["React", "TypeScript", "Remote", "Frontend"],
    featured: true,
  },
  {
    title: "Backend Engineer – Node.js",
    org: "Supabase",
    type: "Job",
    mode: "Remote",
    description:
      "Help scale Supabase's open-source backend-as-a-service platform. Work with PostgreSQL, Node.js, and a passionate open-source community.",
    deadline: null,
    location: "Remote (Global)",
    applyUrl: "https://supabase.com/careers",
    source: "Supabase Careers",
    sourceUrl: "https://supabase.com/careers",
    tags: ["Node.js", "PostgreSQL", "Open Source", "Remote"],
    featured: false,
  },
  {
    title: "Full Stack Developer",
    org: "GitHub",
    type: "Job",
    mode: "Hybrid",
    description:
      "Join GitHub's engineering team. Build tools that millions of developers use every day. Work with React, Ruby on Rails, and cloud infrastructure.",
    deadline: null,
    location: "San Francisco, CA / Remote",
    applyUrl: "https://github.com/about/careers",
    source: "GitHub Careers",
    sourceUrl: "https://github.com/about/careers",
    tags: ["Full Stack", "React", "Rails", "GitHub"],
    featured: false,
  },
  {
    title: "DevRel Engineer",
    org: "Hashnode",
    type: "Job",
    mode: "Remote",
    description:
      "Hashnode is hiring a Developer Relations Engineer to grow and support the developer community. Create content, speak at events, and build demos.",
    deadline: null,
    location: "Remote (Global)",
    applyUrl: "https://hashnode.com/careers",
    source: "Hashnode Careers",
    sourceUrl: "https://hashnode.com/careers",
    tags: ["DevRel", "Community", "Remote", "Content"],
    featured: false,
  },
];

const internships = [
  {
    title: "Software Engineering Intern – Summer 2026",
    org: "Microsoft",
    type: "Internship",
    mode: "Hybrid",
    description:
      "Microsoft's SWE internship program is one of the most competitive and rewarding in the industry. Work on real-world products — Azure, Office, Xbox, or AI. 12-week paid internship.",
    deadline: new Date("2026-01-31"),
    location: "Redmond, WA / Hybrid",
    applyUrl: "https://jobs.careers.microsoft.com/global/en/search?q=software+engineering+intern&lc=United%20States&l=en_us&pg=1&pgSz=20&o=Relevance&flt=true",
    source: "Microsoft Careers",
    sourceUrl: "https://careers.microsoft.com",
    tags: ["SWE", "Internship", "Summer 2026", "Paid", "Microsoft"],
    featured: true,
  },
  {
    title: "Data Science Intern – 2026",
    org: "Meta",
    type: "Internship",
    mode: "Hybrid",
    description:
      "Work alongside world-class researchers and engineers at Meta. Apply ML to products like Instagram, WhatsApp, and the Metaverse. 12–16 week paid internship.",
    deadline: new Date("2026-02-15"),
    location: "Menlo Park, CA / New York, NY",
    applyUrl: "https://www.metacareers.com/careersearch/?q=intern",
    source: "Meta Careers",
    sourceUrl: "https://www.metacareers.com",
    tags: ["Data Science", "ML", "Internship", "Paid", "Meta"],
    featured: true,
  },
  {
    title: "Frontend Engineering Intern",
    org: "Figma",
    type: "Internship",
    mode: "In-Person",
    description:
      "Figma is looking for passionate frontend interns. Work on the design tool used by millions of creators. Collaborate with full-stack engineers on real product features.",
    deadline: new Date("2026-01-15"),
    location: "San Francisco, CA",
    applyUrl: "https://www.figma.com/careers/",
    source: "Figma Careers",
    sourceUrl: "https://www.figma.com/careers/",
    tags: ["Frontend", "React", "TypeScript", "Internship", "Design"],
    featured: false,
  },
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

    const injected = await EventModel.insertMany([...jobs, ...internships]);
    console.log(`✅ Successfully added ${injected.length} Jobs & Internships!`);
    console.log(`   - ${jobs.length} Jobs`);
    console.log(`   - ${internships.length} Internships`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
