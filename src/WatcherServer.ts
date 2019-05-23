import {createServer, Server} from "http";
import {AddressInfo} from "net";
import express from "express";
import cors from "cors";
import path from "path";

import ReportManager, {ReportType} from "./helpers/ReportManager";
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

    this.app.get("/api/reports", this.handleGetAllReports);

    this.app.get("/api/reports/to", this.handleGetToReports);

    this.app.get("/api/reports/from", this.handleGetFromReports);

    // Serve the static React site
    this.app.use(express.static(`html`));

    this.app.get('*', (req, res) => res.sendFile(path.resolve('html', 'index.html')));

  }

  /**
   * Starts the server on a port specified. If no port is specified, takes a random free port
   * @param watchDir
   * @param port
   */
  async start(watchDir: string, port?: number) {
    this.server.listen(port, () => {
      if (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "ci")
        console.log(`HTTP Server listening on port ${this.getPort()}`);
    });
    this.address = this.server.address();
    this.rm = new ReportManager(watchDir);
    await this.dbh.initialiseTables();
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

  stop(cb) {
    this.server.close(cb);
  }

  handleGetAllReports = (req: express.Request, res: express.Response) => {
    this.rm.forceReadFiles(this.dbh);
    const all = Array.from(this.rm.allReports.values());
    res.send(all);
  };

  handleGetToReports = (req: express.Request, res: express.Response) => {
    this.rm.forceReadFiles(this.dbh);
    const allTo = this.rm.getReportByType(ReportType.To);
    res.send(allTo);
  };

  handleGetFromReports = (req: express.Request, res: express.Response) => {
    this.rm.forceReadFiles(this.dbh);
    const allFrom = this.rm.getReportByType(ReportType.From);
    res.send(allFrom);
  };




}

export default WatcherServer;
