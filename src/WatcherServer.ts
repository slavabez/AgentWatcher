import { createServer, Server } from "http";
import { AddressInfo } from "net";
import * as express from "express";
import * as cors from "cors";

import ReportManager, { ReportType } from "./helpers/ReportManager";
import DBHelper from "./helpers/DatabaseHelper";

class WatcherServer {
  private readonly app: express.Application;
  private readonly server: Server;
  public address?: string | AddressInfo | null;
  public rm?: ReportManager;
  public dbh?: DBHelper;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.server = createServer(this.app);
    this.dbh = new DBHelper();

    // Serve the static React site
    this.app.use(express.static(`html`));
  }

  /**
   * Starts the server on a port specified. If no port is specified, takes a random free port
   * @param watchDir
   * @param port
   */
  start(watchDir: string, port?: number): void {
    this.server.listen(port, () => {
      if (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "ci")
        console.log(`HTTP Server listening on port ${this.getPort()}`);
    });
    this.address = this.server.address();

    this.app.get("/api/reports", (req: express.Request, res: express.Response) => {
      this.rm.forceReadFiles();
      const all = Array.from(this.rm.allReports.values());
      res.send(all);
    });

    this.app.get("/api/reports/to", (req: express.Request, res: express.Response) => {
      this.rm.forceReadFiles();
      const allTo = this.rm.getReportByType(ReportType.To);
      res.send(allTo);
    });

    this.app.get("/api/reports/from", (req: express.Request, res: express.Response) => {
      this.rm.forceReadFiles();
      const allFrom = this.rm.getReportByType(ReportType.From);
      res.send(allFrom);
    });


    this.rm = new ReportManager(watchDir);
  }

  /**
   * Returns an IPv6 address of the running server, useful for automated tests
   */
  public getAddress() {
    if (
      this.address &&
      typeof this.address !== "string" &&
      this.address.address
    )
      return this.address.address;
  }

  public getPort() {
    if (this.address && typeof this.address !== "string" && this.address.port)
      return this.address.port;
  }

  async stop() {
    await this.server.close();
  }
}

export default WatcherServer;
