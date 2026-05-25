import React from "react";

interface LinkedInPostModalProps {
  event: { title: string; organization: string; type?: string; mode?: string };
  onClose: () => void;
  userName?: string;
}

const LinkedInPostModal: React.FC<LinkedInPostModalProps> = ({ event, userName, onClose }) => {
  // Generate a premium and engaging post copy directly
  const postBody = `🚀 Exciting update from my learning journey! 

I recently explored "${event.title}" hosted by ${event.organization}. 

Key takeaways:
• Learning real-world problem-solving skills outside the classroom
• Focusing on new tech stacks and sharpening my technical foundation
• Committed to sharing my growth and helping other students find these opportunities

Check out my profile or drop a message if you want to connect!

#careerdevelopment #students #tech #learning${userName ? `\n\n— ${userName}` : ""}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postBody);
      alert("LinkedIn post copied to clipboard!");
      onClose();
    } catch {
      alert("Failed to copy. Please select the text and copy manually.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ margin: 0 }}>LinkedIn Post Copier</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <p style={{ fontSize: "0.9rem", color: "#6b7280", margin: "1rem 0" }}>
          Here is a professionally written LinkedIn update ready for you to share. Click copy and post it on your LinkedIn!
        </p>

        <textarea
          className="modal-textarea"
          readOnly
          value={postBody}
          rows={10}
          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#f9fafb", resize: "none" }}
        />

        <div className="modal-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1.5rem" }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCopy}>Copy Post</button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPostModal;
