import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import db from "../../db";
import AdminNavbar from "./NavBar";
import "../../CSS/JobDetails.css";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const selectedJob = await db.jobs.get(id); // Dexie fetch by id
        setJob(selectedJob);
      } catch {
        alert("Failed to load job");
      }
    };
    fetchJob();
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div className="job-detail-page">
      <AdminNavbar />
      <div style={{ height: '50px' }}></div>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <p>Status: {job.status}</p>
      <p>Applicants: {job.applicantsCount}</p>
      <p>Tags: {job.tags.join(", ")}</p>
    </div>
  );
};

export default JobDetail;
