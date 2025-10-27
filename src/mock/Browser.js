// src/mocks/browser.js
import { setupWorker } from "msw";
import { candidateHandlers } from "./candidateHandlers";
import { rest } from "msw";
import { faker } from "@faker-js/faker";

// Jobs data
let jobs = Array.from({ length: 25 }, (_, i) => {
  const title = faker.person.jobTitle();
  return {
    id: i + 1,
    title,
    slug: faker.helpers.slugify(title).toLowerCase(),
    description: faker.lorem.sentence(),
    status: Math.random() > 0.3 ? "active" : "archived",
    tags: [faker.hacker.noun()],
    order: i + 1,
    applicantsCount: faker.number.int({ min: 0, max: 50 }),
  };
});

// Jobs handlers
const jobsHandlers = [
  rest.get("/jobs", (req, res, ctx) => {
    const search = req.url.searchParams.get("search") || "";
    const status = req.url.searchParams.get("status") || "";
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(search.toLowerCase()) &&
        (status ? job.status === status : true)
    );
    const pageSize = parseInt(req.url.searchParams.get("pageSize")) || 100;
    const page = parseInt(req.url.searchParams.get("page")) || 1;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return res(ctx.status(200), ctx.json({ jobs: filtered.slice(start, end) }));
  }),
  rest.post("/jobs", async (req, res, ctx) => {
    const newJob = await req.json();
    newJob.id = Date.now();
    newJob.order = jobs.length + 1;
    newJob.status = "active";
    newJob.applicantsCount = 0;
    jobs.push(newJob);
    return res(ctx.status(201), ctx.json(newJob));
  }),
  rest.patch("/jobs/:id", async (req, res, ctx) => {
    const { id } = req.params;
    const updates = await req.json();
    jobs = jobs.map((job) => (job.id === +id ? { ...job, ...updates } : job));
    return res(ctx.status(200), ctx.json(jobs.find((j) => j.id === +id)));
  }),
  rest.patch("/jobs/:id/reorder", async (req, res, ctx) => {
    const { fromOrder, toOrder } = await req.json();
    const fromIndex = jobs.findIndex((j) => j.order === fromOrder);
    const toIndex = jobs.findIndex((j) => j.order === toOrder);
    [jobs[fromIndex].order, jobs[toIndex].order] = [
      jobs[toIndex].order,
      jobs[fromIndex].order,
    ];
    return res(ctx.status(200), ctx.json({ success: true }));
  }),
];

// ✅ Combine jobs + candidates handlers
export const worker = setupWorker(...jobsHandlers, ...candidateHandlers);
