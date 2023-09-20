
import express from 'express';
import http from 'http';
import events from 'events';
import * as xrpc from '@atproto/xrpc-server';
import { Secp256k1Keypair, randomStr } from '@atproto/crypto';
import { ServerConfig } from '@atproto/pds';
import { Client as PlcClient } from '@did-plc/lib';
import { Database, PlcServer } from '@did-plc/server';
import { createHttpTerminator, HttpTerminator } from 'http-terminator';

import AppContext from './lib/context.js';
import pingLexicon from './lexicons/network.polypod.ping.js';

export default class PolypodServer {
  public ctx: AppContext;
  public app: express.Application;
  public server?: http.Server;
  private terminator?: HttpTerminator;

  constructor (opts: { ctx: AppContext; app: express.Application }) {
    this.ctx = opts.ctx;
    this.app = opts.app;
  }

  static async create (opts: {
    port?: number,
    plcPort?: number,
    pgURL?: string,
  } = {}): Promise<PolypodServer> {
    process.env.TLS = '0'; // otherwise this will force the scheme to https
    const ctx = new AppContext({
      port: opts.port,
      plcPort: opts.plcPort,
      pgURL: opts.pgURL,
    });

    // first, set up the PLC server which we run embedded and separate from the Bluesky sandbox
    const plcDB = Database.postgres({ url: ctx.pgURL });
    await plcDB.migrateToLatestOrThrow();
    ctx.plc = PlcServer.create({ db: plcDB, port: ctx.plcPort });

    const app = express();
    app.use(express.json({ limit: '100kb' }))
    // app.use(cors())
    // app.use(loggerMiddleware)
    // app.use('/', createRouter(ctx))
    // app.use(error.handler)

    return new PolypodServer({
      ctx,
      app,
    });
  }

  async start (): Promise<http.Server> {
    await this.ctx.plc.start();
    console.warn(`PLC server running on port ${this.ctx.plcPort}.`);
    // XXX
    // don't .start() the PDS, mount it and start ourselves

    const server = this.app.listen(this.ctx.port);
    this.server = server;
    this.terminator = createHttpTerminator({ server });
    await events.once(server, 'listening');
    return server;
  }

  async destroy () {
    await this.ctx.plc.destroy();
    await this.terminator?.terminate();
    // await this.ctx.db.close()
  }
}

(async function () {
  // const port = 2583;  // NOTE: the default, setting so it's clear
  // XXX: it defaults to this but I don't think we get it automatically
  // also, the other port default is 2583 and I'm not sure if they're supposed to be different or not
  // I am playing with having them both the same, let's see which way this goes
  // const didPlcUrl = `http://localhost:${plcPort}`;
  // const repoSigningKey = await Secp256k1Keypair.create();
  // const plcRotationKey = await Secp256k1Keypair.create();
  // const recoveryKey = await Secp256k1Keypair.create();
  // XXX
  // This doesn't work because the URL doesn't resolve to anything.
  // I assume that we need to run the server first.
  // const plcClient = new PlcClient(didPlcUrl);

  // const serverDid = await plcClient.createDid({
  //   signingKey: repoSigningKey.did(),
  //   rotationKeys: [recoveryKey.did(), plcRotationKey.did()],
  //   handle: 'pds.test',
  //   pds: `http://localhost:${port}`,
  //   signer: plcRotationKey,
  // });

  // // const keypair = await P256Keypair.create();
  // const config = ServerConfig.readEnv({
  //   debugMode: true,
  //   port,
  //   hostname: 'pod.berjon.bast',
  //   blobstoreLocation: blobDir,
  //   jwtSecret: 'big-scary-jwt-secret',
  //   didPlcUrl,
  //   serverDid,
  //   recoveryKey: recoveryKey.did(),
  //   adminPassword: 'hunter2',
  //   moderatorPassword: 'hunter2',
  //   triagePassword: 'hunter2',
  //   inviteRequired: false,
  //   userInviteInterval: null,
  //   userInviteEpoch: 0,
  //   databaseLocation: sqlitePath,
  //   availableUserDomains: ['.test', '.dev.bsky.dev', '.bast'],
  //   imgUriSalt: '9dd04221f5755bce5f55f47464c27e1e', // NOTE: these two stolen from dev-env, no idea if they mean anything
  //   imgUriKey: 'f23ecd142835025f42c3db2cf25dd813956c178392760256211f9d315f8ab4d8',
  //   // rateLimitsEnabled: true,
  //   appUrlPasswordReset: 'app://forgot-password', // NOTE: also just copied
  //   emailNoReplyAddress: 'robin+no-reply@berjon.com',
  //   labelerDid: 'did:example:labeler', // NOTE: these 5 also copied
  //   labelerKeywords: { label_me: 'test-label', label_me_2: 'test-label-2' },
  //   feedGenDid: 'did:example:feedGen',
  //   maxSubscriptionBuffer: 200,
  //   repoBackfillLimitMs: 1000 * 60 * 60,
  //   sequencerLeaderLockId: uniqueLockId(),
  //   dbTxLockNonce: await randomStr(32, 'base32'),
  //   // bskyAppViewEndpoint?: string // XXX we'll see what we do here
  //   // bskyAppViewModeration?: boolean
  //   // bskyAppViewDid?: string
  //   // bskyAppViewProxy: boolean
  //   // bskyAppViewCdnUrlPattern?: string
  //   crawlersToNotify: [],
  // });

  // XXX
  // - create db
  // - create blobstore
  // - create PDS

})();

// from dev-env
const usedLockIds = new Set();
export const uniqueLockId = () => {
  let lockId: number;
  do {
    lockId = 1000 + Math.ceil(1000 * Math.random());
  } while (usedLockIds.has(lockId));
  usedLockIds.add(lockId);
  return lockId;
}


// env
//
// PDS_REPO_SIGNING_KEY_K256_PRIVATE_KEY_HEX=${PDS_REPO_SIGNING_KEY_K256_PRIVATE_KEY_HEX}
// PDS_PLC_ROTATION_KEY_K256_PRIVATE_KEY_HEX=${PDS_PLC_ROTATION_KEY_K256_PRIVATE_KEY_HEX}

// import { ServerConfig } from './config'
// import * as crypto from '@atproto/crypto'
// import Database from './db'
// import PDS from './index'
// import { DiskBlobStore, MemoryBlobStore } from './storage'
// import { BlobStore } from '@atproto/repo'

// const run = async () => {
//   let db: Database

//   const keypair = await crypto.P256Keypair.create()
//   const cfg = ServerConfig.readEnv({
//     serverDid: keypair.did(),
//     recoveryKey: keypair.did(),
//   })

//   if (cfg.dbPostgresUrl) {
//     db = Database.postgres({
//       url: cfg.dbPostgresUrl,
//       schema: cfg.dbPostgresSchema,
//     })
//   } else if (cfg.databaseLocation) {
//     db = Database.sqlite(cfg.databaseLocation)
//   } else {
//     db = Database.memory()
//   }

//   await db.migrateToLatestOrThrow()

//   let blobstore: BlobStore
//   if (cfg.blobstoreLocation) {
//     blobstore = await DiskBlobStore.create(
//       cfg.blobstoreLocation,
//       cfg.blobstoreTmp,
//     )
//   } else {
//     blobstore = new MemoryBlobStore()
//   }

//   const pds = PDS.create({
//     db,
//     blobstore,
//     repoSigningKey: keypair,
//     plcRotationKey: keypair,
//     config: cfg,
//   })
//   await pds.start()
//   console.log(`🌞 ATP Data server is running at ${cfg.origin}`)
// }

// run()

// --- Ping method and own XPRC server
// function ping (ctx: { auth: xrpc.HandlerAuth | undefined, params: xrpc.Params, input: xrpc.HandlerInput | undefined, req: express.Request, res: express.Response }) {
//   return {
//     encoding: 'application/json',
//     body: { message: ctx.params.message },
//   };
// }

// const server = xrpc.createServer([pingLexicon]);
// server.method(pingLexicon.id, ping);

// const app = express();
// app.use(server.router);
// app.listen(7654);
