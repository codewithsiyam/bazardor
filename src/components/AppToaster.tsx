"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: { fontFamily: "inherit", fontSize: "14px", color: "#1d271f", background: "#fafcfa", border: "1px solid #e1e8e1" },
        success: { iconTheme: { primary: "#05893e", secondary: "#f3fbf4" } },
        error: { iconTheme: { primary: "#d03739", secondary: "#fff6f5" } },
      }}
    />
  );
}
