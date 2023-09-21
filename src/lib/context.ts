
import { subsystemLogger } from '@atproto/common';
import { Keypair } from '@atproto/crypto';

export class AppContext {
  constructor(
    private opts: {
      blobDir?: string,
      keyDir?: string,
      repoSigningKey: Keypair,
      plcRotationKey: Keypair,
      recoveryKey: Keypair,
      log?: ReturnType<typeof subsystemLogger>,
      pgURL?: string,
      plcURL?: string,
      port?: number,
    },
  ) {}
  get blobDir () { return this.opts.blobDir; }
  get keyDir () { return this.opts.keyDir; }
  get repoSigningKey () { return this.opts.repoSigningKey; }
  get plcRotationKey () { return this.opts.plcRotationKey; }
  get recoveryKey () { return this.opts.recoveryKey; }
  get log () { return this.opts.log; }
  get pgURL () { return this.opts.pgURL || 'postgres://localhost/polypod'; }
  get plcURL () { return this.opts.plcURL || 'http://localhost:2582'; }
  get port () { return this.opts.port || 2583; }
}

export default AppContext;
