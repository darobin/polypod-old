
import { ok, fail } from 'node:assert';
import { join } from 'node:path';
import { mkdtemp, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import getPort from 'get-port';
import { Secp256k1Keypair } from '@atproto/crypto';
import axios from 'axios';
import PolypodServer from '../built/index.js';
import PolypodPLCServer from '../built/plc.js';

let pod, podPort, plc, plcPort;
before(async () => {
  plcPort = await getPort();
  podPort = await getPort();
  plc = await PolypodPLCServer.create('postgres://localhost/plc-test', plcPort);
  await plc.start();
  const tmp = await mkdtemp(join(tmpdir(), 'polypod-'));
  const keyDir = join(tmp, 'keys');
  const blobDir = join(tmp, 'blobs');
  await Promise.all([blobDir, keyDir].map(d => mkdir(d, { recursive: true })));
  pod = await PolypodServer.create({
    blobDir,
    keyDir,
    repoSigningKey: await Secp256k1Keypair.create({ exportable: true }),
    plcRotationKey: await Secp256k1Keypair.create({ exportable: true }),
    recoveryKey: await Secp256k1Keypair.create({ exportable: true }),
    port: podPort,
    plcURL: plc.plcURL,
  });
  await pod.start();
});
after(async () => {
  await plc?.destroy();
  await pod?.destroy();
});

describe('PDS Server', () => {
  it('should be up and running', async () => {
    try {
      const res = await axios.get(`http://localhost:${plcPort}/xrpc/_health`);
      ok(typeof res.data.version !== 'undefined', 'Health check returns with expected document');
    }
    catch (err) {
      console.warn(err);
      fail('Health check failed.');
    }
  });
});
