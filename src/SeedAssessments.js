// src/seedAssessments.js
import db from "./db";

export async function seedAssessments() {
  const assessments = [];

  for (let j = 1; j <= 3; j++) {
    const jobId = `job-${j}`;

    const sections = [
      {
        id: j * 1000 + 1,
        title: `Section 1 for Job ${j}`,
        questions: [],
      },
      {
        id: j * 1000 + 2,
        title: `Section 2 for Job ${j}`,
        questions: [],
      },
    ];

    for (let i = 1; i <= 5; i++) {
      sections[0].questions.push({
        id: j * 100 + i,
        text: `Section 1 - Question ${i} for Job ${j}`,
        type: ["single", "multi", "short", "long", "numeric", "file"][i % 6],
        options: ["Option 1", "Option 2", "Option 3"],
        required: true,
        condition: { questionId: null, value: null },
        min: 1,
        max: 10,
      });

      sections[1].questions.push({
        id: j * 100 + i + 5,
        text: `Section 2 - Question ${i} for Job ${j}`,
        type: ["single", "multi", "short", "long", "numeric", "file"][
          (i + 1) % 6
        ],
        options: ["Option 1", "Option 2", "Option 3"],
        required: true,
        condition: { questionId: null, value: null },
        min: 1,
        max: 10,
      });
    }

    assessments.push({ jobId, sections, questions: [] });
  }

  for (let a of assessments) {
    const exists = await db.assessments.get(a.jobId);
    if (!exists) await db.assessments.add(a);
  }
}
