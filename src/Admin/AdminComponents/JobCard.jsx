import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import AddJob from "./AddJobs";
import { getJobs, addJob, updateJob, reorderJobs } from "../../API/JobsApi";
import "../../CSS/JobCard.css";

const JobCards = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { jobs } = await getJobs({ pageSize: 100, sort: "order", search });
      setJobs(jobs);
    } catch {
      alert("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAdd = async (job) => {
    setLoading(true);
    try {
      await addJob(job);
      fetchJobs();
    } catch {
      alert("Failed to add job");
    } finally {
      setLoading(false);
      setShowAddForm(false);
    }
  };

  const handleUpdate = async (job) => {
    setLoading(true);
    try {
      await updateJob(job.id, job);
      fetchJobs();
    } catch {
      alert("Failed to update job");
    } finally {
      setEditingJob(null);
      setLoading(false);
      setShowAddForm(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const updatedJobs = [...jobs];
    [updatedJobs[result.source.index], updatedJobs[result.destination.index]] = [
      updatedJobs[result.destination.index],
      updatedJobs[result.source.index],
    ];

    updatedJobs.forEach((job, idx) => (job.order = idx + 1));
    setJobs(updatedJobs);

    try {
      await reorderJobs(
        updatedJobs[result.destination.index].order,
        updatedJobs[result.source.index].order
      );
    } catch {
      alert("Failed to reorder, rollback");
      fetchJobs();
    }
  };

  const toggleStatus = (job) =>
    handleUpdate({
      ...job,
      status: job.status === "active" ? "archived" : "active",
    });

  const handleJobClick = (id) => navigate(`/jobs/${id}`);

  return (
    <div className="container">
      <h2>Job Board</h2>

      {/* Search + Add */}
      <div className="job-controls">
        <input
          className="job-search-input"
          type="text"
          placeholder="🔍 Search jobs by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchJobs();
          }}
        />
        <button
          className="add-job-button"
          onClick={() => {
            setEditingJob(null);
            setShowAddForm(!showAddForm);
          }}
        >
          {showAddForm ? "Close" : "➕ Add Job"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="form-overlay">
          <div className="form-container">
            <AddJob
              onAdd={handleAdd}
              editingJob={editingJob}
              onUpdate={handleUpdate}
              cancelEdit={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}

      {/* Jobs Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="jobs" direction="horizontal">
          {(provided) => (
            <div
              className="job-board"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {jobs.map((job, index) => (
                <Draggable key={job.id} draggableId={job.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="job-card"
                      onClick={() => handleJobClick(job.id)}
                    >
                      <h3>{job.title}</h3>
                      <p>{job.description}</p>
                      <div className={`job-meta status-${job.status}`}>
                        {job.status.toUpperCase()} | Applicants:{" "}
                        {job.applicantsCount || 0}
                      </div>
                      <div className="job-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingJob(job);
                            setShowAddForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStatus(job);
                          }}
                        >
                          {job.status === "active"
                            ? "Archive"
                            : "Unarchive"}
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default JobCards;
