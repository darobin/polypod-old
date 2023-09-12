var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import express from 'express';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import * as xrpc from '@atproto/xrpc-server';
import { Secp256k1Keypair, randomStr } from '@atproto/crypto';
import { ServerConfig } from '@atproto/pds';
import { Client as PlcClient } from '@did-plc/lib';
import makeRel from './lib/rel.js';
import pingLexicon from './lexicons/network.polypod.ping.js';
var rel = makeRel(import.meta.url);
var storeDir = rel('../scratch');
var sqlitePath = join(storeDir, 'pds.sqlite');
var blobDir = join(storeDir, 'blob-store');
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var port, didPlcUrl, repoSigningKey, plcRotationKey, recoveryKey, plcClient, serverDid, config, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    process.env.TLS = '0'; // otherwise this will force the scheme to https
                    process.env.LOG_ENABLED = 'true';
                    process.env.LOG_LEVEL = 'debug';
                    process.env.LOG_DESTINATION = '1';
                    return [4 /*yield*/, mkdir(storeDir, { recursive: true })];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, mkdir(blobDir, { recursive: true })];
                case 2:
                    _d.sent();
                    port = 2582;
                    didPlcUrl = 'http://localhost:2582';
                    return [4 /*yield*/, Secp256k1Keypair.create()];
                case 3:
                    repoSigningKey = _d.sent();
                    return [4 /*yield*/, Secp256k1Keypair.create()];
                case 4:
                    plcRotationKey = _d.sent();
                    return [4 /*yield*/, Secp256k1Keypair.create()];
                case 5:
                    recoveryKey = _d.sent();
                    plcClient = new PlcClient(didPlcUrl);
                    return [4 /*yield*/, plcClient.createDid({
                            signingKey: repoSigningKey.did(),
                            rotationKeys: [recoveryKey.did(), plcRotationKey.did()],
                            handle: 'pds.test',
                            pds: "http://localhost:".concat(port),
                            signer: plcRotationKey,
                        })];
                case 6:
                    serverDid = _d.sent();
                    _b = (_a = ServerConfig).readEnv;
                    _c = {
                        debugMode: true,
                        port: port,
                        hostname: 'pod.berjon.bast',
                        blobstoreLocation: blobDir,
                        jwtSecret: 'big-scary-jwt-secret',
                        didPlcUrl: didPlcUrl,
                        serverDid: serverDid,
                        recoveryKey: recoveryKey.did(),
                        adminPassword: 'hunter2',
                        moderatorPassword: 'hunter2',
                        triagePassword: 'hunter2',
                        inviteRequired: false,
                        userInviteInterval: null,
                        userInviteEpoch: 0,
                        databaseLocation: sqlitePath,
                        availableUserDomains: ['.test', '.dev.bsky.dev', '.bast'],
                        imgUriSalt: '9dd04221f5755bce5f55f47464c27e1e',
                        imgUriKey: 'f23ecd142835025f42c3db2cf25dd813956c178392760256211f9d315f8ab4d8',
                        // rateLimitsEnabled: true,
                        appUrlPasswordReset: 'app://forgot-password',
                        emailNoReplyAddress: 'robin+no-reply@berjon.com',
                        labelerDid: 'did:example:labeler',
                        labelerKeywords: { label_me: 'test-label', label_me_2: 'test-label-2' },
                        feedGenDid: 'did:example:feedGen',
                        maxSubscriptionBuffer: 200,
                        repoBackfillLimitMs: 1000 * 60 * 60,
                        sequencerLeaderLockId: uniqueLockId()
                    };
                    return [4 /*yield*/, randomStr(32, 'base32')];
                case 7:
                    config = _b.apply(_a, [(_c.dbTxLockNonce = _d.sent(),
                            // bskyAppViewEndpoint?: string // XXX we'll see what we do here
                            // bskyAppViewModeration?: boolean
                            // bskyAppViewDid?: string
                            // bskyAppViewProxy: boolean
                            // bskyAppViewCdnUrlPattern?: string
                            _c.crawlersToNotify = [],
                            _c)]);
                    return [2 /*return*/];
            }
        });
    });
})();
// from dev-env
var usedLockIds = new Set();
export var uniqueLockId = function () {
    var lockId;
    do {
        lockId = 1000 + Math.ceil(1000 * Math.random());
    } while (usedLockIds.has(lockId));
    usedLockIds.add(lockId);
    return lockId;
};
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
function ping(ctx) {
    return {
        encoding: 'application/json',
        body: { message: ctx.params.message },
    };
}
var server = xrpc.createServer([pingLexicon]);
server.method(pingLexicon.id, ping);
var app = express();
app.use(server.router);
app.listen(7654);
