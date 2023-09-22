
import { ok, fail } from 'node:assert';
import { Client } from '@did-plc/lib';
import { makePLC } from './base.js';

let plc, plcPort;
before(async () => {
  const mocks = await makePLC();
  plc = mocks.plc;
  plcPort = mocks.plcPort;
});
after(async () => {
  await plc?.destroy();
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
