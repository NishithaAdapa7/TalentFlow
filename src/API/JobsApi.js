import db from "../db";
import { nanoid } from "nanoid";

// Fetch jobs with optional search & pagination
export const getJobs = async ({ page = 1, pageSize = 100, search = "", sort = "order" } = {}) => {
  let jobs = await db.jobs.toArray();
  if (search) {
    jobs = jobs.filter(job => job.title.toLowerCase().includes(search.toLowerCase()));
  }
  jobs.sort((a, b) => a[sort] - b[sort]);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { jobs: jobs.slice(start, end) };
};

// Add new job
export const addJob = async (job) => {
  const newJob = {
    id: nanoid(),
    ...job,
    status: "active",
    order: (await db.jobs.count()) + 1,
    applicantsCount: 0,
    tags: job.tags || [],
    slug: job.title.toLowerCase().replace(/\s+/g, "-"),
  };
  await db.jobs.add(newJob);
  return newJob;
};

// Update existing job
export const updateJob = async (id, updates) => {
  await db.jobs.update(id, updates);
  return db.jobs.get(id);
};

// Reorder jobs
export const reorderJobs = async (fromOrder, toOrder) => {
  const fromJob = await db.jobs.where("order").equals(fromOrder).first();
  const toJob = await db.jobs.where("order").equals(toOrder).first();
  if (fromJob && toJob) {
    await db.jobs.update(fromJob.id, { order: toOrder });
    await db.jobs.update(toJob.id, { order: fromOrder });
  }
  return { success: true };
};
