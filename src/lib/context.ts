
import { PlcServer } from '@did-plc/server';

export class AppContext {
  constructor(
    private opts: {
      port? :number,
      plcPort? :number,
      pgURL? :string,
      plc? :PlcServer,
    } = {},
  ) {}
  get port () { return this.opts.port || 2583; }
  get plcPort () { return this.opts.plcPort || 2582; }
  get pgURL () { return this.opts.pgURL || 'postgres://localhost/polypod'; }
  get plc () { return this.opts.plc; }
  set plc (s: PlcServer) { this.opts.plc = s; }
}

export default AppContext;
