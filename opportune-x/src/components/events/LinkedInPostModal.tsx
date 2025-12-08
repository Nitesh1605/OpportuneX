import React, { useMemo, useState } from "react";

interface EventLike {
  title: string;
  organization: string;
  type?: string;
  mode?: string;
}

interface LinkedInPostModalProps {
  event: EventLike;
  onClose: () => void;
  userName?: string;
}

type TemplateType = "participation" | "win" | "announcement";
type Tone = "excited" | "grateful" | "professional";
type CallToAction = "connect" | "apply" | "shoutout";

const TEMPLATE_COPY: Record<
  TemplateType,
  { intro: string; highlights: string[]; hashtags: string[] }
> = {
  participation: {
    intro:
      "Just wrapped up an incredible experience at {{event}} hosted by {{org}}!",
    highlights: [
      "Collaborated with inspiring teammates to solve real-world challenges",
      "Experimented with new stacks and sharpened my problem-solving muscle",
      "Got actionable feedback from mentors and industry judges",
    ],
    hashtags: ["#hackathon", "#students", "#learning", "#tech"],
  },
  win: {
    intro:
      "Thrilled to share that our team placed at {{event}} by {{org}} 🎉",
    highlights: [
      "Built a solution that tackled {{type}} pain points end-to-end",
      "Pitched to judges and iterated quickly on their feedback",
      "Grateful for the late-night debugging sessions that paid off",
    ],
    hashtags: ["#hackathon", "#winners", "#innovation", "#teamwork"],
  },
  announcement: {
    intro:
      "Shot my shot at {{event}} ({{type}}) by {{org}} and I couldn't be more excited!",
    highlights: [
      "Applying to programs like this to keep growing outside the classroom",
      "Focusing on {{mode}} experiences so I can collaborate from anywhere",
      "Committed to sharing my journey to help more students find these chances",
    ],
    hashtags: ["#internship", "#applications", "#careerdevelopment"],
  },
};

const TONE_OPENERS: Record<Tone, string> = {
  excited: "🚀 Big news!",
  grateful: "🙏 Feeling thankful today.",
  professional: "📌 Quick update from my learning journey:",
};

const CTA_COPY: Record<CallToAction, string> = {
  connect:
    "If you know students who should be at the next edition, tag them or drop me a message — let's help more people find these opportunities.",
  apply:
    "If this sounds like your vibe, go check out the application link and jump in. Happy to share tips if you need them!",
  shoutout:
    "Huge shoutout to the organizing team & mentors — your energy makes these experiences unforgettable.",
};

const LinkedInPostModal: React.FC<LinkedInPostModalProps> = ({
  event,
  userName,
  onClose,
}) => {
  const [template, setTemplate] = useState<TemplateType>("participation");
  const [tone, setTone] = useState<Tone>("excited");
  const [cta, setCta] = useState<CallToAction>("connect");
  const [customHighlights, setCustomHighlights] = useState("");

  const templateCopy = TEMPLATE_COPY[template];

  const computedHighlights = useMemo(() => {
    const custom = customHighlights
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    return custom.length > 0 ? custom : templateCopy.highlights;
  }, [customHighlights, templateCopy.highlights]);

  const intro = useMemo(() => {
    const base = templateCopy.intro
      .replace("{{event}}", `"${event.title}"`)
      .replace("{{org}}", event.organization)
      .replace("{{type}}", event.type || "this opportunity")
      .replace("{{mode}}", event.mode || "online");
    return `${TONE_OPENERS[tone]} ${base}`;
  }, [event.mode, event.title, event.organization, event.type, templateCopy, tone]);

  const postBody = useMemo(() => {
    const bullets = computedHighlights
      .map((highlight) => `• ${highlight}`)
      .join("\n");
    const nameLine = userName ? `\n— ${userName}` : "";
    return `${intro}\n\nKey takeaways:\n${bullets}\n\n${CTA_COPY[cta]}\n${templateCopy.hashtags.join(
      " "
    )}${nameLine}`;
  }, [computedHighlights, intro, cta, templateCopy.hashtags, userName]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postBody);
      alert("Copied LinkedIn post to clipboard!");
    } catch {
      alert("Could not copy. Please select and copy manually.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <div className="modal-header">
          <h2 className="modal-title">LinkedIn post generator</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-grid">
          <label>
            Theme
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as TemplateType)}
              className="select modal-select"
            >
              <option value="participation">Participation recap</option>
              <option value="win">Win / shortlist</option>
              <option value="announcement">Application announcement</option>
            </select>
          </label>

          <label>
            Tone
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="select modal-select"
            >
              <option value="excited">Excited</option>
              <option value="grateful">Grateful</option>
              <option value="professional">Professional</option>
            </select>
          </label>

          <label>
            Call to action
        <select
              value={cta}
              onChange={(e) => setCta(e.target.value as CallToAction)}
          className="select modal-select"
        >
              <option value="connect">Invite connections</option>
              <option value="apply">Encourage applications</option>
              <option value="shoutout">Shoutout organizers</option>
        </select>
          </label>
        </div>

        <label className="modal-label">
          Custom highlights (optional)
        <textarea
            value={customHighlights}
            onChange={(e) => setCustomHighlights(e.target.value)}
            placeholder="Add one highlight per line"
            className="modal-textarea"
          />
        </label>

        <label className="modal-label">
          Generated copy
          <textarea className="modal-textarea" readOnly value={postBody} />
        </label>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleCopy}>
            Copy text
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPostModal;
