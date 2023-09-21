
import { ok, fail } from 'node:assert';
import getPort from 'get-port';
import PolypodPLCServer from '../built/plc.js';
import { Client } from '@did-plc/lib';

let plc, plcPort;
before(async () => {
  plcPort = await getPort();
  plc = await PolypodPLCServer.create('postgres://localhost/polypod-test', plcPort);
  await plc.start();
});
after(async () => {
  if (!plc) return;
  await plc.destroy();
});

describe('PLC Server', () => {
  it('should be up and running', async () => {
    const client = new Client(`http://localhost:${plcPort}`);
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
