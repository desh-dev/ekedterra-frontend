import BottomNav from "@/components/layout/bottom-nav";
import React from "react";

const dotStyle: React.CSSProperties = {
  display: "inline-block",
  width: "12px",
  height: "12px",
  margin: "0 6px",
  borderRadius: "50%",
  background: "#333",
  animation: "bounce 1s infinite",
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const Loading = () => {
  return (
    <div style={containerStyle}>
      <span
        style={{
          ...dotStyle,
          animationDelay: "0s",
        }}
      />
      <span
        style={{
          ...dotStyle,
          animationDelay: "0.2s",
        }}
      />
      <span
        style={{
          ...dotStyle,
          animationDelay: "0.4s",
        }}
      />
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-16px); }
          }
        `}
      </style>
      <BottomNav />
    </div>
  );
};

export default Loading;
