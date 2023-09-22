
import { ok, fail } from 'node:assert';
import axios from 'axios';
import { makePod } from './base.js';

let pod, podPort, plc;
before(async () => {
  const mocks = await makePod();
  pod = mocks.pod;
  podPort = mocks.podPort;
  plc = mocks.plc;
});
after(async () => {
  await plc?.destroy();
  await pod?.destroy();
});

describe('PDS Server', () => {
  it('should be up and running', async () => {
    try {
      const res = await axios.get(`http://localhost:${podPort}/xrpc/_health`);
      ok(typeof res.data.version !== 'undefined', 'Health check returns with expected document');
    }
    catch (err) {
      console.warn(err);
      fail('Health check failed.');
    }
  });
});
