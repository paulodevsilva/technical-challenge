import * as fs from 'fs';

export async function loadJobs(): void {
  const jobs = await fs.promises.readdir('./src/jobs');

  const jobFiles = jobs.filter(
    (file) => !['interfaces', 'schemas', 'services'].includes(file)
  );
}
