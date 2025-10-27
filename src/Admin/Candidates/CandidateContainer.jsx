// src/components/Candidates/CandidateContainer.jsx
import React, { useState } from "react";
import CandidateList from "./CnadidateList";
import CandidateKanban from "./CandidateKanban";
import "../../CSS/Candidates.css";
import AdminNavbar from "../AdminComponents/NavBar";

export default function CandidateContainer() {
  const [view, setView] = useState("list"); // "list" or "kanban"

  return (
    <div className="candidates-container">
        <AdminNavbar adminName={name} />
        <div style={{ height: '55px' }}></div> {/* spacer */}
      {/* Toggle Button */}
      <div className="view-toggle">
        <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
          List View
        </button>
        <button className={view === "kanban" ? "active" : ""} onClick={() => setView("kanban")}>
          Kanban View
        </button>
      </div>

      {/* Render view */}
      {view === "list" && <CandidateList />}
      {view === "kanban" && <CandidateKanban />}
    </div>
  );
}
