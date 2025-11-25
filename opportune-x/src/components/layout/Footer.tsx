import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} OpportuneX • Built for students.
    </footer>
  );
};

export default Footer;
