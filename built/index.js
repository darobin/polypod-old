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
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import express from 'express';
import { randomStr } from '@atproto/crypto';
import { ServerConfig, Database, DiskBlobStore, PDS } from '@atproto/pds';
import { Client as PlcClient } from '@did-plc/lib';
import { subsystemLogger } from '@atproto/common';
// monkeypatching, may smell
import cors from 'cors';
import compression from '@atproto/pds/dist/util/compression.js';
import { loggerMiddleware } from '@atproto/pds/dist/logger.js';
import { createServer } from '@atproto/pds/dist/lexicon';
import API from '@atproto/pds/dist/api';
import inProcessAppView from '@atproto/pds/dist/app-view/api';
import * as basicRoutes from '@atproto/pds/dist/basic-routes.js';
import * as wellKnown from '@atproto/pds/dist/well-known.js';
import * as error from '@atproto/pds/dist/error.js';
import AppContext from './lib/context.js';
var logger = subsystemLogger('polypod');
var PolypodServer = /** @class */ (function () {
    function PolypodServer(opts) {
        this.ctx = opts.ctx;
        this.pds = opts.pds;
    }
    PolypodServer.create = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var ctx, serverDid, config, _a, _b, db, blobstore, pds, app, xrpcOpts, server, pod;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
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
                        return [4 /*yield*/, this.getServerDID(ctx)];
                    case 1:
                        serverDid = _d.sent();
                        _b = (_a = ServerConfig).readEnv;
                        _c = {
                            debugMode: true,
                            port: ctx.port,
                            hostname: 'pod.berjon.bast',
                            blobstoreLocation: ctx.blobDir,
                            jwtSecret: 'big-scary-jwt-secret',
                            didPlcUrl: ctx.plcURL,
                            serverDid: serverDid,
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
                    case 2:
                        config = _b.apply(_a, [(_c.dbTxLockNonce = _d.sent(),
                                // bskyAppViewEndpoint?: string // XXX we'll see what we do here
                                // bskyAppViewModeration?: boolean
                                // bskyAppViewDid?: string
                                // bskyAppViewProxy: boolean
                                // bskyAppViewCdnUrlPattern?: string
                                _c.crawlersToNotify = [],
                                _c)]);
                        db = Database.postgres({ url: config.dbPostgresUrl, schema: config.dbPostgresSchema });
                        return [4 /*yield*/, db.migrateToLatestOrThrow()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, DiskBlobStore.create(config.blobstoreLocation, config.blobstoreTmp)];
                    case 4:
                        blobstore = _d.sent();
                        pds = PDS.create({
                            db: db,
                            blobstore: blobstore,
                            repoSigningKey: ctx.repoSigningKey,
                            plcRotationKey: ctx.plcRotationKey,
                            config: config,
                        });
                        app = express();
                        app.set('trust proxy', true);
                        app.use(cors());
                        app.use(loggerMiddleware);
                        app.use(compression.default());
                        xrpcOpts = {
                            validateResponse: true,
                            payload: {
                                jsonLimit: 100 * 1024,
                                textLimit: 100 * 1024,
                                blobLimit: 5 * 1024 * 1024, // 5mb
                            },
                        };
                        server = createServer(xrpcOpts);
                        server = API.default(server, pds.ctx);
                        server = inProcessAppView.default(server, pds.ctx);
                        app.use(basicRoutes.createRouter(pds.ctx));
                        app.use(wellKnown.createRouter(pds.ctx));
                        app.use(server.xrpc.router);
                        app.use(error.handler);
                        pds.app = app;
                        pod = new PolypodServer({
                            ctx: ctx,
                            pds: pds,
                        });
                        return [4 /*yield*/, pod.setupApplications()];
                    case 5:
                        _d.sent();
                        return [2 /*return*/, pod];
                }
            });
        });
    };
    PolypodServer.getServerDID = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var didFile, serverDid, data, _a, _b, error_1, plcClient;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        didFile = join(ctx.keyDir, 'server-did.json');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 6]);
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, readFile(didFile, 'utf-8')];
                    case 2:
                        data = _b.apply(_a, [_c.sent()]);
                        serverDid = data.did;
                        return [3 /*break*/, 6];
                    case 3:
                        error_1 = _c.sent();
                        plcClient = new PlcClient(ctx.plcURL);
                        return [4 /*yield*/, plcClient.createDid({
                                signingKey: ctx.repoSigningKey.did(),
                                rotationKeys: [ctx.recoveryKey.did(), ctx.plcRotationKey.did()],
                                handle: 'pds.test',
                                pds: "http://localhost:".concat(ctx.port),
                                signer: ctx.plcRotationKey,
                            })];
                    case 4:
                        serverDid = _c.sent();
                        return [4 /*yield*/, writeFile(didFile, JSON.stringify({ did: serverDid }, null, 2))];
                    case 5:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, serverDid];
                }
            });
        });
    };
    PolypodServer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.pds.start()];
            });
        });
    };
    PolypodServer.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pds.destroy()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PolypodServer.prototype.setupApplications = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return PolypodServer;
}());
export default PolypodServer;
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
