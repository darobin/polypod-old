
import { ok, equal } from 'node:assert';
import { makePod } from './base.js';

let pod, client, plc;
before(async () => {
  const mocks = await makePod();
  pod = mocks.pod;
  client = mocks.client;
  plc = mocks.plc;
});
after(async () => {
  await plc?.destroy();
  await pod?.destroy();
});

describe('Run network.polypod.ping', () => {
  it('should support empty messages', async () => {
    const ret = await ping();
    ok(ret, 'Value was returned');
    equal(typeof ret, 'object', 'Value was object');
    equal(Object.keys(ret).length, 0, 'Value had no entries');
  });
  it('should support real messages', async () => {
    const msg = 'Came striding like the color of the heavy hemlocks';
    const ret = await ping(msg);
    equal(ret.message, msg, 'Ping echoed the message back');
  });
});

async function ping (message) {
  let params;
  if (message) params = { message };
  let res;
  try {
    res = await client.get('network.polypod.ping', { params });
  }
  catch (err) {
    console.warn(res, err);
  }
  return res.data;
}
