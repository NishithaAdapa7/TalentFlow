// src/API/AssessmentsApi.js
import db from "../db";

// ✅ Get all assessments
export const getAllAssessments = async () => {
  const all = await db.assessments.toArray();
  return all || [];
};

// ✅ Get a single assessment by jobId
export const getAssessment = async (jobId) => {
  if (!jobId) {
    console.error("getAssessment called without a valid jobId");
    return { jobId: null, sections: [], questions: [] };
  }

  // Keep jobId as string (e.g., "job-1")
  const assessment = await db.assessments.get(jobId);
  return assessment || { jobId, sections: [], questions: [] };
};

// ✅ Save or update an assessment
export const saveAssessment = async (jobId, assessment) => {
  await db.assessments.put({ ...assessment, jobId }); // jobId always string
};

// ✅ Store submitted responses locally
export const submitResponses = async (jobId, responses) => {
  await db.submissions.add({
    jobId,
    responses,
    submittedAt: new Date().toISOString(),
  });
};
