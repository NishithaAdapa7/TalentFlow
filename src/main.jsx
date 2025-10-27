// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { seedJobs } from "./seedJobs";
import { seedCandidates } from "./SeedCandidate";
import { seedAssessments } from "./SeedAssessments";

// Seed data + start MSW
async function init() {
  await seedJobs();
  await seedCandidates();
  await seedAssessments();

  if (process.env.NODE_ENV === "development") {
    const { worker } = await import("./mock/Browser");
    worker.start();
  }
}
init();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
