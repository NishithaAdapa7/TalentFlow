import db from "./db";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

export const seedJobs = async () => {
  const count = await db.jobs.count();
  if (count > 0) return; // Already seeded

  const jobs = Array.from({ length: 25 }).map((_, i) => {
    const title = faker.person.jobTitle();
    return {
      id: nanoid(),
      title,
      slug: faker.helpers.slugify(title).toLowerCase(),
      description: faker.lorem.sentence(),
      status: Math.random() > 0.3 ? "active" : "archived",
      tags: [faker.hacker.noun()],
      order: i + 1,
      applicantsCount: faker.number.int({ min: 0, max: 50 }),
    };
  });

  await db.jobs.bulkAdd(jobs);
  console.log("Seeded 25 jobs in IndexedDB ✅");
};
