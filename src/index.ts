
import express from 'express';
import * as xrpc from '@atproto/xrpc-server';

import pingLexicon from './lexicons/network.polypod.ping.js';

function ping (ctx: { auth: xrpc.HandlerAuth | undefined, params: xrpc.Params, input: xrpc.HandlerInput | undefined, req: express.Request, res: express.Response }) {
  return {
    encoding: 'application/json',
    body: {message: ctx.params.message },
  };
}

const server = xrpc.createServer([pingLexicon]);
server.method(pingLexicon.id, ping);

const app = express();
app.use(server.router);
app.listen(7654);
