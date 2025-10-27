// src/mocks/assessmentHandlers.js
import { rest } from "msw";
import db from "../db";

const randomDelay = () => Math.floor(Math.random() * 1000) + 200;
const shouldFail = () => Math.random() < 0.08;

export const assessmentHandlers = [
  // ✅ GET /assessments/:jobId
  rest.get("/assessments/:jobId", async (req, res, ctx) => {
    const { jobId } = req.params;
    const assessment = await db.assessments.where({ jobId }).first();
    return res(
      ctx.delay(randomDelay()),
      ctx.status(200),
      ctx.json(assessment || { jobId, sections: [], questions: [] })
    );
  }),

  // ✅ PUT /assessments/:jobId
  rest.put("/assessments/:jobId", async (req, res, ctx) => {
    if (shouldFail())
      return res(ctx.status(500), ctx.json({ message: "Write failed" }));

    const { jobId } = req.params;
    const data = await req.json();

    await db.assessments.put({ ...data, jobId });
    return res(ctx.delay(randomDelay()), ctx.status(200), ctx.json(data));
  }),

  // ✅ POST /assessments/:jobId/submit
  rest.post("/assessments/:jobId/submit", async (req, res, ctx) => {
    if (shouldFail())
      return res(ctx.status(500), ctx.json({ message: "Write failed" }));

    const { jobId } = req.params;
    const submission = await req.json();

    await db.submissions.add({
      ...submission,
      jobId,
      submittedAt: new Date().toISOString(),
    });

    return res(ctx.delay(randomDelay()), ctx.status(201), ctx.json(submission));
  }),
];
