"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// XXX gotta be a Lexicon type
var ping = {
    lexicon: 1,
    id: 'network.polypod.ping',
    defs: {
        main: {
            type: 'query',
            parameters: {
                type: 'params',
                properties: { message: { type: 'string' } },
            },
            output: {
                encoding: 'application/json',
            },
        },
    },
};
exports.default = ping;
