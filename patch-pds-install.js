#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const atdir = './node_modules/@atproto/pds/dist';

(async function () {
  const typesFile = join(atdir, 'index.d.ts');
  let types = await readFile(typesFile, 'utf-8');
  types = types
    .replace(
      /\nimport \{ Server as XrpcServer } from '@atproto\/xrpc-server';/,
      ''
    )
    .replace(
      /\s+xrpc\?: XrpcServer;/g,
      ''
    )
    .replace(
      /(import AppContext from '\.\/context';)/,
      `$1\nimport { Server as XrpcServer } from '@atproto/xrpc-server';`
    )
    .replace(
      /(\s+)(app: express\.Application;)/g,
      `$1$2$1xrpc?: XrpcServer;`
    )
  ;
  await writeFile(typesFile, types);

  const codeFile = join(atdir, 'index.js');
  let code = await readFile(codeFile, 'utf-8');
  code = code
    .replace(
      /\s+this\.xrpc = opts\.xrpc;/,
      ''
    )
    .replace(
      /(\s+)(this\.app = opts\.app;)/,
      `$1$2$1this.xrpc = opts.xrpc;`
    )
    .replace(', xrpc: server.xrpc', '')
    .replace(
      /return new PDS\(\{ ctx, app \}\);/,
      'return new PDS({ ctx, app, xrpc: server.xrpc });'
    )
  ;
  await writeFile(codeFile, code);
})();
