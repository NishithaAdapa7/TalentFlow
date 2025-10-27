import React, { useState, useEffect } from "react";
import "../../CSS/AddJob.css";

const AddJob = ({ onAdd, editingJob, onUpdate, cancelEdit }) => {
  const [form, setForm] = useState({ title: "", description: "" });

  useEffect(() => {
    if (editingJob) setForm({ title: editingJob.title, description: editingJob.description });
  }, [editingJob]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Title is required");

    if (editingJob) {
      onUpdate({ ...editingJob, ...form });
    } else {
      onAdd(form);
    }

    setForm({ title: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="add-job-form">
      <input name="title" placeholder="Job Title" value={form.title} onChange={handleChange} required />
      <input name="description" placeholder="Job Description" value={form.description} onChange={handleChange} />
      <button type="submit">{editingJob ? "Update Job" : "Add Job"}</button>
      {editingJob && <button type="button" onClick={cancelEdit}>Cancel</button>}
    </form>
  );
};

export default AddJob;
