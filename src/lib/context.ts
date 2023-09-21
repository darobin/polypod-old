
import { PlcServer } from '@did-plc/server';
import { subsystemLogger } from '@atproto/common';

export class AppContext {
  constructor(
    private opts: {
      log?: ReturnType<typeof subsystemLogger>,
      pgURL?: string,
      plc?: PlcServer,
      plcPort?: number,
      port?: number,
    } = {},
  ) {}
  get log () { return this.opts.log; }
  get pgURL () { return this.opts.pgURL || 'postgres://localhost/polypod'; }
  get plc () { return this.opts.plc; }
  set plc (s: PlcServer) { this.opts.plc = s; }
  get plcPort () { return this.opts.plcPort || 2582; }
  get port () { return this.opts.port || 2583; }
}

export default AppContext;
