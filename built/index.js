"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var xrpc = require("@atproto/xrpc-server");
var network_polypod_ping_1 = require("./lexicons/network.polypod.ping");
function ping(ctx) {
    return {
        encoding: 'application/json',
        body: { message: ctx.params.message },
    };
}
var server = xrpc.createServer([network_polypod_ping_1.default]);
server.method(network_polypod_ping_1.default.id, ping);
var app = (0, express_1.default)();
app.use(server.router);
app.listen(7654);
