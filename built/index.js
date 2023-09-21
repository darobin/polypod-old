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
import events from 'events';
import { Client as PlcClient } from '@did-plc/lib';
import { createHttpTerminator } from 'http-terminator';
import { subsystemLogger } from '@atproto/common';
import AppContext from './lib/context.js';
var logger = subsystemLogger('polypod');
var PolypodServer = /** @class */ (function () {
    function PolypodServer(opts) {
        this.ctx = opts.ctx;
        this.app = opts.app;
    }
    PolypodServer.create = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var ctx, plcClient, serverDid, app;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.env.TLS = '0'; // otherwise this will force the scheme to https
                        ctx = new AppContext({
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
                        plcClient = new PlcClient(ctx.plcURL);
                        return [4 /*yield*/, plcClient.createDid({
                                signingKey: ctx.repoSigningKey.did(),
                                rotationKeys: [ctx.recoveryKey.did(), ctx.plcRotationKey.did()],
                                handle: 'pds.test',
                                pds: "http://localhost:".concat(ctx.port),
                                signer: ctx.plcRotationKey,
                            })];
                    case 1:
                        serverDid = _a.sent();
                        console.warn(serverDid);
                        app = express();
                        app.use(express.json({ limit: '100kb' }));
                        // app.use(cors())
                        // app.use(loggerMiddleware)
                        // app.use('/', createRouter(ctx))
                        // app.use(error.handler)
                        return [2 /*return*/, new PolypodServer({
                                ctx: ctx,
                                app: app,
                            })];
                }
            });
        });
    };
    PolypodServer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var server;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = this.app.listen(this.ctx.port);
                        this.server = server;
                        this.terminator = createHttpTerminator({ server: server });
                        return [4 /*yield*/, events.once(server, 'listening')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, server];
                }
            });
        });
    };
    PolypodServer.prototype.destroy = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.terminator) === null || _a === void 0 ? void 0 : _a.terminate())];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PolypodServer;
}());
export default PolypodServer;
(function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
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
