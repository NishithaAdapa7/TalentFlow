import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCandidate, getCandidateTimeline, updateCandidate } from "../../API/CandidatesApi";
import "../../CSS/Candidates.css";

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [note, setNote] = useState("");

  const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

  useEffect(() => {
    const load = async () => {
      try {
        const c = await getCandidate(id);
        setCandidate(c);
        const t = await getCandidateTimeline(id);
        setTimeline(t.timeline || []);
      } catch {
        alert("Failed to load candidate");
      }
    };
    load();
  }, [id]);

  const changeStage = async (toStage) => {
    try {
      await updateCandidate(candidate.id, { stage: toStage });
      setCandidate(prev => ({ ...prev, stage: toStage }));
      const t = await getCandidateTimeline(candidate.id);
      setTimeline(t.timeline || []);
    } catch {
      alert("Failed to update stage");
    }
  };

  const addNote = () => {
    if (!note.trim()) return;
    const newEvent = { type: "note", text: note, time: new Date().toISOString(), meta: { to: candidate.stage } };
    setTimeline(prev => [...prev, newEvent]);
    setNote("");
  };

  if (!candidate) return <div className="small">Loading...</div>;

  return (
    <div className="candidate-profile">
      <button className="btn back" onClick={() => navigate(-1)}>Back</button>
      <h2>{candidate.name}</h2>
      <p className="muted">{candidate.email}</p>

      <div className="profile-actions">
        <label>Stage: </label>
        <select value={candidate.stage} onChange={(e) => changeStage(e.target.value)}>
          {stages.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Notes */}
      <section className="notes">
        <h3>Add Note</h3>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Write a note..." />
        <button className="btn" onClick={addNote}>Add Note</button>
      </section>

      {/* Timeline Graph */}
      <section className="timeline">
        <h3>Timeline</h3>
        {timeline.length === 0 && <p className="small muted">No timeline events</p>}
        <div className="timeline-graph">
          {timeline.map((ev, idx) => (
            <div
              key={idx}
              className={`timeline-bar stage-${ev.meta?.to || candidate.stage}`}
              style={{ width: `${(idx + 1) / timeline.length * 100}%` }}
              title={`${ev.type}: ${ev.text || ""}`}
            >
              {ev.type}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
