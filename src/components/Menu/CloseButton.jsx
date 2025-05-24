import React from "react";

export default function CloseButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        border: "none",
        background: "none",
        top: 8,
        right: 8,
        width: 41,
        height: 41,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <i class="nes-icon close" />
    </button>
  );
}
