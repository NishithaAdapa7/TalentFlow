// src/db.js
import Dexie from "dexie";

const db = new Dexie("TalentFlowDB");

db.version(1).stores({
  jobs: "id, title, status",
  candidates: "id, name, email, stage, jobId, createdAt",
  candidateTimeline: "++id, candidateId, time, type, text, meta",
  assessments: "jobId", // jobId (string) as primary key
  submissions: "++id, jobId, candidateId, submittedAt",
});

export default db;
