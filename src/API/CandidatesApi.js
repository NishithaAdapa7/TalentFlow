import db from "../db";

// Get candidates with optional search and stage filtering
export const getCandidates = async ({ search = "", stage = "" } = {}) => {
  let collection = db.candidates.toCollection();

  if (search) {
    const s = search.toLowerCase();
    collection = collection.filter(c =>
      c.name.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s)
    );
  }

  if (stage) {
    collection = collection.filter(c => c.stage === stage);
  }

  const candidates = await collection.sortBy("createdAt");
  return { candidates, total: candidates.length };
};

// ADD candidate
export const addCandidate = async (candidate) => {
  const candidateWithId = {
    ...candidate,
    id: `cand-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const res = await fetch("/candidates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidateWithId),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Add candidate failed:", err);
    throw new Error("Failed to add candidate");
  }

  return res.json();
};

// Get single candidate by ID
export const getCandidate = async (id) => db.candidates.get(id);

// Update candidate
export const updateCandidate = async (id, updates) => {
  await db.candidates.update(id, updates);
  return db.candidates.get(id);
};

// Get timeline for candidate
export const getCandidateTimeline = async (id) => {
  const timeline = await db.candidateTimeline
    .where("candidateId")
    .equals(id)
    .sortBy("time");
  return { timeline };
};
