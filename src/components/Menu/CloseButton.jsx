import React from "react";

export default function CloseButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        border: "none",
        background: "red",
        color: "white",
        fontSize: "1.5em",
        width: 41,
        height: 41,
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ✕
    </button>
  );
}
