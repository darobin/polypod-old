
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { PolypodServer } from '../index.js';
import makeRel from '../lib/rel.js';

const rel = makeRel(import.meta.url);
const storeDir = rel('../../scratch');
const blobDir = join(storeDir, 'blob-store');

process.env.LOG_ENABLED = 'true';
process.env.LOG_LEVEL = 'debug';
process.env.LOG_DESTINATION = '1';

async function run () {
  await mkdir(storeDir, { recursive: true });
  await mkdir(blobDir, { recursive: true });

  const pod = PolypodServer.create();
}

run();
