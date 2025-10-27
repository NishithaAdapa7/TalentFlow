// src/components/Candidates/CandidateKanban.jsx
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getCandidates, updateCandidate } from "../../API/CandidatesApi";
import "../../CSS/Candidates.css";

const STAGES = ["applied", "screen", "tech", "offer", "hired", "rejected"];

export default function CandidateKanban() {
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const { candidates } = await getCandidates({ page: 1, pageSize: 1000 });
      const grouped = STAGES.reduce((acc, stage) => ({ ...acc, [stage]: [] }), {});
      candidates.forEach(c => grouped[c.stage || "applied"].push(c));
      setColumns(grouped);
    } catch {
      alert("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const fromStage = result.source.droppableId;
    const toStage = result.destination.droppableId;
    const fromIndex = result.source.index;
    const toIndex = result.destination.index;

    const sourceList = Array.from(columns[fromStage]);
    const [moved] = sourceList.splice(fromIndex, 1);

    const destList = Array.from(columns[toStage] || []);
    destList.splice(toIndex, 0, { ...moved, stage: toStage });

    setColumns(prev => ({ ...prev, [fromStage]: sourceList, [toStage]: destList }));

    try { await updateCandidate(moved.id, { stage: toStage }); }
    catch { alert("Failed to move candidate — rolling back"); loadAll(); }
  };

  // Basic stats for Kanban charts
  const totalCandidates = Object.values(columns).flat().length;
  const stageCounts = STAGES.reduce((acc, s) => ({ ...acc, [s]: (columns[s]?.length || 0) }), {});

  return (
    <div className="kanban-wrap">
      {loading && <div className="small">Loading…</div>}

      {/* Charts */}
      <div className="kanban-stats">
        <div className="chart-box">
          <h4>Total Candidates</h4>
          <p>{totalCandidates}</p>
        </div>
        {STAGES.map(s => (
          <div key={s} className="chart-box">
            <h4>{s.charAt(0).toUpperCase() + s.slice(1)}</h4>
            <p>{stageCounts[s]}</p>
          </div>
        ))}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {STAGES.map(stage => (
            <Droppable key={stage} droppableId={stage}>
              {(provided) => (
                <div className="kanban-column" ref={provided.innerRef} {...provided.droppableProps}>
                  <h4 className="kanban-title">{stage.toUpperCase()}</h4>
                  <div className="kanban-list">
                    {(columns[stage] || []).map((c, idx) => (
                      <Draggable key={c.id} draggableId={c.id} index={idx}>
                        {(provided) => (
                          <div
                            className="kanban-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="kanban-name">{c.name}</div>
                            <div className="kanban-email">{c.email}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
