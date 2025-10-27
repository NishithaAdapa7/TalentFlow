// src/components/Assessments/AssessmentList.jsx
import React, { useEffect, useState } from "react";
import { getAllAssessments } from "../../API/AssessmentsApi";
import { Link } from "react-router-dom";
import "../../CSS/Assessments.css";
import AdminNavbar from "../AdminComponents/NavBar";

export default function AssessmentList() {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getAllAssessments();
      setAssessments(data);
    }
    load();
  }, []);

  return (
    <div className="assessment-list-container">
           <AdminNavbar adminName={name} />
        <div style={{ height: '55px' }}></div> {/* spacer */}
      <h2>All Assessments</h2>
      {assessments.length === 0 ? (
        <p>No assessments found yet.</p>
      ) : (
        <div className="assessment-list">
          {assessments.map((a) => (
            <div key={a.jobId} className="assessment-card">
              <h3>{a.title || `Assessment for ${a.jobId}`}</h3>
              <p>
                Sections: {a.sections?.length || 0} | Questions:{" "}
                {a.sections?.reduce(
                  (acc, s) => acc + s.questions.length,
                  0
                ) + (a.questions?.length || 0)}
              </p>
              <Link to={`/assessments/${a.jobId}`}>
                <button className="view-btn">View / Edit</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
