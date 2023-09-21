#!/usr/bin/env node
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
import { readFile, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { Secp256k1Keypair } from '@atproto/crypto';
import PolypodServer from '../index.js';
import makeRel from '../lib/rel.js';
var rel = makeRel(import.meta.url);
var storeDir = rel('../../scratch');
var blobDir = join(storeDir, 'blob-store');
var keyDir = join(storeDir, 'key-store');
process.env.LOG_ENABLED = 'true';
process.env.LOG_LEVEL = 'debug';
process.env.LOG_DESTINATION = '1';
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, repoSigningKey, plcRotationKey, recoveryKey, pod;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([storeDir, blobDir, keyDir].map(function (d) { return mkdir(d, { recursive: true }); }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, Promise.all(['repo-signing', 'plc-rotation', 'recovery'].map(function (n) { return loadOrCreateKey(keyDir, n); }))];
                case 2:
                    _a = _b.sent(), repoSigningKey = _a[0], plcRotationKey = _a[1], recoveryKey = _a[2];
                    return [4 /*yield*/, PolypodServer.create({
                            blobDir: blobDir,
                            keyDir: keyDir,
                            repoSigningKey: repoSigningKey,
                            plcRotationKey: plcRotationKey,
                            recoveryKey: recoveryKey,
                        })];
                case 3:
                    pod = _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
run();
function loadOrCreateKey(keyDir, name) {
    return __awaiter(this, void 0, void 0, function () {
        var keyFile, key, data, err_1, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    keyFile = join(keyDir, name);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 8]);
                    return [4 /*yield*/, readFile(keyFile)];
                case 2:
                    data = _a.sent();
                    return [4 /*yield*/, Secp256k1Keypair.import(data)];
                case 3:
                    key = _a.sent();
                    return [3 /*break*/, 8];
                case 4:
                    err_1 = _a.sent();
                    return [4 /*yield*/, Secp256k1Keypair.create({ exportable: true })];
                case 5:
                    key = _a.sent();
                    return [4 /*yield*/, key.export()];
                case 6:
                    data = _a.sent();
                    return [4 /*yield*/, writeFile(keyFile, data)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/, key];
            }
        });
    });
}
