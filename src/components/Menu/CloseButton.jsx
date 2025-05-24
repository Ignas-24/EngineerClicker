import React from "react";

export default function CloseButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="nes-btn is-error"
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        width: 41,
        height: 41,
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      ✕
    </button>
  );
}
