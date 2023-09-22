
import { join } from 'node:path';
import { mkdtemp, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import axios from 'axios';
import getPort from 'get-port';
import { Secp256k1Keypair } from '@atproto/crypto';
import PolypodServer from '../built/index.js';
import PolypodPLCServer from '../built/plc.js';

export const PORT = 7654;
export const BASE_URL = `http://localhost:${PORT}/xrpc/`;
export const client = axios.create({ baseURL: BASE_URL });

export async function makePLC () {
  const plcPort = await getPort();
  const plc = await PolypodPLCServer.create('postgres://localhost/plc-test', plcPort);
  await plc.start();
  return { plc, plcPort };
}

export async function makePod (plc) {
  if (!plc) plc = (await makePLC()).plc;
  const podPort = await getPort();
  const tmp = await mkdtemp(join(tmpdir(), 'polypod-'));
  const keyDir = join(tmp, 'keys');
  const blobDir = join(tmp, 'blobs');
  await Promise.all([blobDir, keyDir].map(d => mkdir(d, { recursive: true })));
  const pod = await PolypodServer.create({
    blobDir,
    keyDir,
    repoSigningKey: await Secp256k1Keypair.create({ exportable: true }),
    plcRotationKey: await Secp256k1Keypair.create({ exportable: true }),
    recoveryKey: await Secp256k1Keypair.create({ exportable: true }),
    port: podPort,
    plcURL: plc.plcURL,
  });
  await pod.start();
  return { pod, podPort, plc };
}
