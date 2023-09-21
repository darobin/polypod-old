
import { Keypair, Secp256k1Keypair, randomStr } from '@atproto/crypto';
import { Database, PlcServer } from '@did-plc/server';
import { subsystemLogger } from '@atproto/common';

export default class PolypodPLCServer {
  public plc: PlcServer;
  public plcPort?: number;

  constructor (plc, plcPort) {
    this.plc = plc;
    this.plcPort = plcPort;
  }

  get plcURL () { return `http://localhost:${this.plcPort}`; }

  static async create (pgURL?: string, plcPort?: number): Promise<PolypodPLCServer> {
    const plcDB = Database.postgres({ url: pgURL });
    await plcDB.migrateToLatestOrThrow();
    const plc = PlcServer.create({ db: plcDB, port: plcPort });

    return new PolypodPLCServer(plc, plcPort);
  }

  async start (): Promise<void> {
    await this.plc.start();
  }

  async destroy () {
    await this.plc.destroy();
  }
}
