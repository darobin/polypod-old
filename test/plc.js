
import { ok, fail } from 'node:assert';
import getPort from 'get-port';
import PolypodServer from '../built/index.js';
import { Client } from '@did-plc/lib';

let pod, plcPort;
before(async () => {
  plcPort = await getPort();
  pod = await PolypodServer.create({
    port: await getPort(),
    plcPort,
    pgURL: 'postgres://localhost/polypod-test',
  });
  await pod.start();
});
after(async () => {
  if (!pod) return;
  pod.destroy();
});

describe('PLC Server', () => {
  it('should be up and running', async () => {
    const client = new Client(`http://localhost:${plcPort}/`);
    try {
      const res = await client.health();
      ok(typeof res.version !== 'undefined', 'Health check returns with expected document');
    }
    catch (err) {
      console.warn(err);
      fail('Health check failed.');
    }
  });
});
