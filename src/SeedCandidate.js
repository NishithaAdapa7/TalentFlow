// src/seedCandidates.js
import db from "./db";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

/**
 * seedCandidates()
 * - seeds 1000 candidates and timeline entries
 * - assigns candidates to existing jobs in db.jobs (if none exist, it makes placeholder job ids)
 */
export const seedCandidates = async (count = 1000) => {
  const cCount = await db.candidates.count();
  if (cCount > 0) return; // already seeded

  let jobs = [];
  try {
    jobs = await db.jobs.toArray();
  } catch (e) {
    // ignore if jobs table doesn't exist yet
    jobs = [];
  }

  // fallback job ids if there are no jobs
  const fallbackJobIds = jobs.length ? jobs.map(j => j.id) : ["job-placeholder-1"];

  const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

  const batch = [];
  const timelineEvents = [];

  for (let i = 0; i < count; i++) {
    const candidateId = nanoid();
    const name = faker.person.fullName();
    const email = faker.internet.email({ firstName: name.split(" ")[0] });
    const jobId = jobs.length ? faker.helpers.arrayElement(fallbackJobIds) : faker.helpers.arrayElement(fallbackJobIds);
    const stage = faker.helpers.arrayElement(stages);
    const createdAt = faker.date.past({ years: 1 }).toISOString();

    batch.push({
      id: candidateId,
      name,
      email,
      jobId,
      stage,
      createdAt,
    });

    // timeline: creation
    timelineEvents.push({
      candidateId,
      time: createdAt,
      type: "created",
      meta: { stage },
      text: `Candidate created and set to ${stage}`,
    });

    // Add 0-3 additional timeline events representing stage changes
    const extraEvents = faker.number.int({ min: 0, max: 3 });
    let lastTime = new Date(createdAt);
    for (let k = 0; k < extraEvents; k++) {
      lastTime = new Date(lastTime.getTime() + faker.number.int({ min: 1, max: 30 }) * 24 * 60 * 60 * 1000);
      const evStage = faker.helpers.arrayElement(stages);
      timelineEvents.push({
        candidateId,
        time: lastTime.toISOString(),
        type: "transition",
        meta: { from: stage, to: evStage },
        text: `Moved from ${stage} to ${evStage}`,
      });
    }
  }

  // bulk add
  await db.candidates.bulkAdd(batch);
  if (timelineEvents.length) await db.candidateTimeline.bulkAdd(timelineEvents);

  console.log(`Seeded ${batch.length} candidates and ${timelineEvents.length} timeline events`);
};
