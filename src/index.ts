
import http from 'http';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { Request, Response } from 'express';
import { HandlerAuth, HandlerInput, Params } from '@atproto/xrpc-server';
import { Keypair, randomStr } from '@atproto/crypto';
import { ServerConfig, Database, DiskBlobStore, PDS } from '@atproto/pds';
import { Client as PlcClient } from '@did-plc/lib';
import { subsystemLogger } from '@atproto/common';

import AppContext from './lib/context.js';
import pingLexicon from './lexicons/network.polypod.ping.js';

const logger: ReturnType<typeof subsystemLogger> = subsystemLogger('polypod');

export default class PolypodServer {
  public ctx: AppContext;
  public pds: PDS;

  constructor (opts: { ctx: AppContext, pds: PDS }) {
    this.ctx = opts.ctx;
    this.pds = opts.pds;
  }

  static async create (opts: {
    blobDir?: string,
    keyDir?: string,
    repoSigningKey: Keypair,
    plcRotationKey: Keypair,
    recoveryKey: Keypair,
    log?: ReturnType<typeof subsystemLogger>,
    pgURL?: string,
    plcURL: string,
    port?: number,
  }): Promise<PolypodServer> {
    process.env.TLS = '0'; // otherwise this will force the scheme to https
    const ctx = new AppContext({
      blobDir: opts.blobDir,
      keyDir: opts.keyDir,
      repoSigningKey: opts.repoSigningKey,
      plcRotationKey: opts.plcRotationKey,
      recoveryKey: opts.recoveryKey,
      log: opts.log || logger,
      pgURL: opts.pgURL,
      plcURL: opts.plcURL,
      port: opts.port,
    });

    const serverDid = await this.getServerDID(ctx);
    const config = ServerConfig.readEnv({
      debugMode: true,
      port: ctx.port,
      hostname: 'pod.berjon.bast',
      blobstoreLocation: ctx.blobDir,
      jwtSecret: 'big-scary-jwt-secret',
      didPlcUrl: ctx.plcURL,
      serverDid,
      recoveryKey: ctx.recoveryKey.did(),
      adminPassword: 'hunter2',
      moderatorPassword: 'hunter2',
      triagePassword: 'hunter2',
      inviteRequired: false,
      userInviteInterval: null,
      userInviteEpoch: 0,
      dbPostgresUrl: ctx.pgURL,
      availableUserDomains: ['.test', '.dev.bsky.dev', '.bast'],
      // imgUriSalt: '9dd04221f5755bce5f55f47464c27e1e', // NOTE: these two stolen from dev-env, no idea if they mean anything
      // imgUriKey: 'f23ecd142835025f42c3db2cf25dd813956c178392760256211f9d315f8ab4d8',
      // rateLimitsEnabled: true,
      appUrlPasswordReset: 'app://forgot-password', // NOTE: also just copied
      emailNoReplyAddress: 'robin+no-reply@berjon.com',
      labelerDid: 'did:example:labeler', // NOTE: these 5 also copied
      labelerKeywords: { label_me: 'test-label', label_me_2: 'test-label-2' },
      feedGenDid: 'did:example:feedGen',
      maxSubscriptionBuffer: 200,
      repoBackfillLimitMs: 1000 * 60 * 60,
      sequencerLeaderLockId: uniqueLockId(),
      dbTxLockNonce: await randomStr(32, 'base32'),
      // bskyAppViewEndpoint?: string // XXX we'll see what we do here
      // bskyAppViewModeration?: boolean
      // bskyAppViewDid?: string
      // bskyAppViewProxy: boolean
      // bskyAppViewCdnUrlPattern?: string
      crawlersToNotify: [],
    });

    const db = Database.postgres({ url: config.dbPostgresUrl, schema: config.dbPostgresSchema });
    await db.migrateToLatestOrThrow();

    const blobstore = await DiskBlobStore.create(config.blobstoreLocation, config.blobstoreTmp);

    const pds = PDS.create({
      db,
      blobstore,
      repoSigningKey: ctx.repoSigningKey,
      plcRotationKey: ctx.plcRotationKey,
      config,
    });

    const pod = new PolypodServer({
      ctx,
      pds,
    });
    await pod.setupApplications();
    return pod;
  }

  static async getServerDID (ctx: AppContext): Promise<string> {
    const didFile = join(ctx.keyDir, 'server-did.json');
    let serverDid;
    try {
      const data = JSON.parse(await readFile(didFile, 'utf-8'));
      serverDid = data.did;
    }
    catch (error) {
      const plcClient = new PlcClient(ctx.plcURL);
      serverDid = await plcClient.createDid({
        signingKey: ctx.repoSigningKey.did(),
        rotationKeys: [ctx.recoveryKey.did(), ctx.plcRotationKey.did()],
        handle: 'pds.test',
        pds: `http://localhost:${ctx.port}`,
        signer: ctx.plcRotationKey,
      });
      await writeFile(didFile, JSON.stringify({ did: serverDid }, null, 2));
    }
    return serverDid;
  }

  async start (): Promise<http.Server> {
    return this.pds.start();
  }

  async destroy () {
    await this.pds.destroy();
  }

  async setupApplications () {
    // --- Ping method and own XPRC server
    // XXX this is not the signature that we're aiming for
    function ping (ctx: { auth: HandlerAuth | undefined, params: Params, input: HandlerInput | undefined, req: Request, res: Response }) {
      return {
        encoding: 'application/json',
        body: { message: ctx.params.message },
      };
    }

    // we add straight to the PDS
    this.pds.xrpc.addLexicon(pingLexicon);
    this.pds.xrpc.method(pingLexicon.id, ping);
  }
}

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
