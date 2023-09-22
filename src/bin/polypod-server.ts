#!/usr/bin/env node

import { readFile, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { Keypair, Secp256k1Keypair } from '@atproto/crypto';
import PolypodServer from '../index.js';
import PolypodPLCServer from '../plc.js';
import makeRel from '../lib/rel.js';

const rel = makeRel(import.meta.url);
const storeDir = rel('../../scratch');
const blobDir = join(storeDir, 'blob-store');
const keyDir = join(storeDir, 'key-store');

process.env.LOG_ENABLED = 'true';
process.env.LOG_LEVEL = 'debug';
process.env.LOG_DESTINATION = '1';

async function run () {
  await Promise.all([storeDir, blobDir, keyDir].map(d => mkdir(d, { recursive: true })));

  const [repoSigningKey, plcRotationKey, recoveryKey] = await Promise.all(
    ['repo-signing', 'plc-rotation', 'recovery'].map(n => loadOrCreateKey(keyDir, n))
  );

  const plc = await PolypodPLCServer.create('postgres://localhost/plc-test', 2582);
  await plc.start();

  const pod = await PolypodServer.create({
    blobDir,
    keyDir,
    repoSigningKey,
    plcRotationKey,
    recoveryKey,
    plcURL: plc.plcURL,
  });
  await pod.start();
}

run();

async function loadOrCreateKey (keyDir: string, name: string): Promise<Keypair> {
  const keyFile = join(keyDir, name);
  let key;
  try {
    const data = await readFile(keyFile);
    key = await Secp256k1Keypair.import(data);
  }
  catch (err) {
    key = await Secp256k1Keypair.create({ exportable: true });
    const data = await key.export();
    await writeFile(keyFile, data);
  }
  return key;
}
