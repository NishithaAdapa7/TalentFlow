import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCandidates, addCandidate } from "../../API/CandidatesApi";
import "../../CSS/Candidates.css";

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({ name: "", email: "" });

  const navigate = useNavigate();
  const stages = ["", "applied", "screen", "tech", "offer", "hired", "rejected"];

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const { candidates } = await getCandidates({ search, stage });
      setCandidates(candidates);
    } catch {
      alert("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.email) return alert("Fill all fields");
    try {
      await addCandidate(newCandidate);
      setNewCandidate({ name: "", email: "" });
      setShowAddModal(false);
      fetchCandidates();
    } catch (e) {
      console.error(e);
      alert("Failed to add candidate. Please try again.");
    }
  };

  return (
    <div className="candidates-container">

      {/* Controls */}
      <div className="candidates-controls">
        <input
          className="candidate-search"
          placeholder="Search name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && fetchCandidates()}
        />
        <select value={stage} onChange={e => setStage(e.target.value)}>
          {stages.map(s => <option key={s} value={s}>{s || "All Stages"}</option>)}
        </select>
        <button className="btn" onClick={fetchCandidates}>Search</button>
        <button className="btn" onClick={() => setShowAddModal(true)}>Add New Candidate</button>
      </div>

      {/* Candidate List */}
      <div className="candidates-list">
        {candidates.map(c => (
          <div
            key={c.id}
            className="candidate-row"
            onClick={() => navigate(`/candidates/${c.id}`)}
          >
            <div className="candidate-name">{c.name}</div>
            <div className="candidate-email">{c.email}</div>
            <div className={`candidate-stage stage-${c.stage}`}>{c.stage}</div>
          </div>
        ))}
      </div>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Candidate</h3>
            <input
              placeholder="Name"
              value={newCandidate.name}
              onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })}
            />
            <input
              placeholder="Email"
              value={newCandidate.email}
              onChange={e => setNewCandidate({ ...newCandidate, email: e.target.value })}
            />
            <div className="modal-actions">
              <button className="btn" onClick={handleAddCandidate}>Add</button>
              <button className="btn back" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
