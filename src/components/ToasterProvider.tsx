"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "inherit",
          fontSize: "14px",
          borderRadius: "12px",
          border: "1px solid #e1e8e1",
          background: "#fafcfa",
          color: "#1d271f",
        },
        success: { iconTheme: { primary: "#05893e", secondary: "#f3fbf4" } },
        error: { iconTheme: { primary: "#d03739", secondary: "#fff6f5" } },
      }}
    />
  );
}
