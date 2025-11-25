import React, { useState } from "react";

interface EventLike {
  title: string;
  organization: string;
}

interface LinkedInPostModalProps {
  event: EventLike;
  onClose: () => void;
}

const LinkedInPostModal: React.FC<LinkedInPostModalProps> = ({
  event,
  onClose,
}) => {
  const [templateType, setTemplateType] = useState<"participation" | "win">(
    "participation"
  );

  const baseText =
    templateType === "win"
      ? `Excited to share that I won/was shortlisted in "${event.title}" organized by ${event.organization}. It was a great opportunity to work on real-world problems and collaborate with amazing people.`
      : `Happy to share that I recently participated in "${event.title}" organized by ${event.organization}. Learned a lot about teamwork, problem-solving and improved my skills.`;

  const hashtags =
    templateType === "win"
      ? "#hackathon #students #winners"
      : "#hackathon #learning #students";

  const fullText = `${baseText}\n\nKey learnings:\n- \n- \n\n${hashtags}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      alert("Copied LinkedIn post to clipboard!");
    } catch {
      alert("Could not copy. Please select and copy manually.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <div className="modal-header">
          <h2 className="modal-title">Generate LinkedIn post</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
          This helps students quickly share their participation or achievement on
          LinkedIn after an event.
        </p>

        <select
          value={templateType}
          onChange={(e) =>
            setTemplateType(e.target.value as "participation" | "win")
          }
          className="select modal-select"
        >
          <option value="participation">Participation template</option>
          <option value="win">Win / shortlist template</option>
        </select>

        <textarea
          readOnly
          value={fullText}
          style={{
            width: "100%",
            height: "200px",
            resize: "none",
            marginTop: "0.5rem",
            borderRadius: "0.5rem",
            border: "1px solid rgba(148, 163, 184, 0.5)",
            background: "#020617",
            color: "#e5e7eb",
            padding: "0.5rem 0.6rem",
            fontSize: "0.8rem",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "0.75rem",
          }}
        >
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
