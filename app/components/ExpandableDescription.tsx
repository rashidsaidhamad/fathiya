"use client";
import { useState } from "react";

interface ExpandableDescriptionProps {
  description: string;
  maxLength?: number;
  color?: string;
  fontSize?: string;
  marginBottom?: string;
  lineHeight?: number | string;
}

export default function ExpandableDescription({
  description,
  maxLength = 150,
  color = "#555",
  fontSize = "13px",
  marginBottom = "14px",
  lineHeight = 1.6,
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongDescription = description.length > maxLength;
  const displayText = isExpanded ? description : description.slice(0, maxLength);

  return (
    <div>
      <p style={{ color, fontSize, marginBottom, lineHeight }}>
        {displayText}
        {isLongDescription && !isExpanded && "..."}
      </p>
      {isLongDescription && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: "none",
            border: "none",
            color: "#c49a6c",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 600,
            padding: "0",
            marginTop: "-8px",
            marginBottom: marginBottom,
            textDecoration: "none",
          }}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
