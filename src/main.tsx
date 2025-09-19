import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ClerkProvider } from "@clerk/clerk-react";

const publishableKey = "pk_test_bGl2ZS1zdGFsbGlvbi00My5jbGVyay5hY2NvdW50cy5kZXYk";

if (!publishableKey) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={publishableKey}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <App />
    </ThemeProvider>
  </ClerkProvider>
);
