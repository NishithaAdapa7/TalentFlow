// src/mocks/candidateHandlers.js
import { rest } from "msw";
import db from "../db";

// Utility: simulate latency + 5-10% write failure
const randomDelay = () => Math.floor(Math.random() * 1000) + 200;
const shouldFail = (rate = 0.08) => Math.random() < rate;

export const candidateHandlers = [
  // GET /candidates?search=&stage=&page=&pageSize=
  rest.get("/candidates", async (req, res, ctx) => {
    const search = req.url.searchParams.get("search") || "";
    const stage = req.url.searchParams.get("stage") || "";
    const page = parseInt(req.url.searchParams.get("page") || "1");
    const pageSize = parseInt(req.url.searchParams.get("pageSize") || "100");

    let all = await db.candidates.toArray();

    if (search) {
      const q = search.toLowerCase();
      all = all.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    if (stage) all = all.filter(c => c.stage === stage);

    // sort by createdAt desc
    all.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = all.length;
    const start = (page - 1) * pageSize;
    const slice = all.slice(start, start + pageSize);

    return res(
      ctx.delay(randomDelay()),
      ctx.status(200),
      ctx.json({ candidates: slice, total })
    );
  }),

  // GET /candidates/:id
  rest.get("/candidates/:id", async (req, res, ctx) => {
    const { id } = req.params;
    const candidate = await db.candidates.get(id);
    if (!candidate) return res(ctx.delay(randomDelay()), ctx.status(404));
    return res(ctx.delay(randomDelay()), ctx.status(200), ctx.json(candidate));
  }),

  // POST /candidates
  rest.post("/candidates", async (req, res, ctx) => {
    const body = await req.json();
    const newCandidate = {
      ...body,
      id: body.id || `cand-${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString(),
    };
    if (shouldFail(0.08)) return res(ctx.delay(randomDelay()), ctx.status(500), ctx.json({ message: "Write failed" }));
    await db.candidates.add(newCandidate);
    // timeline entry
    await db.candidateTimeline.add({
      candidateId: newCandidate.id,
      time: newCandidate.createdAt,
      type: "created",
      text: "Candidate created",
      meta: { stage: newCandidate.stage || "applied" },
    });
    return res(ctx.delay(randomDelay()), ctx.status(201), ctx.json(newCandidate));
  }),

  // PATCH /candidates/:id
  rest.patch("/candidates/:id", async (req, res, ctx) => {
    const { id } = req.params;
    const updates = await req.json();
    if (shouldFail(0.08)) return res(ctx.delay(randomDelay()), ctx.status(500), ctx.json({ message: "Write failed" }));
    await db.candidates.update(id, updates);

    // if stage changed, add timeline event
    if (updates.stage) {
      await db.candidateTimeline.add({
        candidateId: id,
        time: new Date().toISOString(),
        type: "transition",
        text: `Stage changed to ${updates.stage}`,
        meta: { to: updates.stage },
      });
    }

    const updated = await db.candidates.get(id);
    return res(ctx.delay(randomDelay()), ctx.status(200), ctx.json(updated));
  }),

  // GET /candidates/:id/timeline
  rest.get("/candidates/:id/timeline", async (req, res, ctx) => {
    const { id } = req.params;
    const events = await db.candidateTimeline.where("candidateId").equals(id).toArray();
    events.sort((a,b) => new Date(a.time) - new Date(b.time));
    return res(ctx.delay(randomDelay()), ctx.status(200), ctx.json({ timeline: events }));
  })
];
