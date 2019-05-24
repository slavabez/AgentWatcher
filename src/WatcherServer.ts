import { createServer, Server } from "http";
import { AddressInfo } from "net";
import express from "express";
import cors from "cors";
import path from "path";

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
    this.app.use(express.json());
    this.server = createServer(this.app);
    this.dbh = new DBHelper();

    // Reports
    this.app.get("/api/reports", this.handleGetAllReports);
    this.app.get("/api/reports/to", this.handleGetToReports);
    this.app.get("/api/reports/from", this.handleGetFromReports);

    // Names
    this.app.get("/api/names", this.handleGetAllNames);
    this.app.put("/api/names/:id", this.handleUpdateName);

    // Serve the static React site
    this.app.use(express.static(`html`));

    // If no paths have been hit, serve the React page (React will take care of it)
    this.app.get("*", (req, res) =>
      res.sendFile(path.resolve("html", "index.html"))
    );
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
    await this.rm.addNamesToDict(this.dbh);
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

  stop() {
    return new Promise((resolve, reject) => {
      this.server.close(err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  handleGetAllReports = async (req: express.Request, res: express.Response) => {
    this.rm.forceReadFiles();
    const all = Array.from(this.rm.allReports.values());
    await this.rm.verifyAllReportsToDb(this.dbh);
    res.send(all);
  };

  handleGetToReports = async (req: express.Request, res: express.Response) => {
    this.rm.forceReadFiles();
    const allTo = this.rm.getReportByType(ReportType.To);
    await this.rm.verifyAllReportsToDb(this.dbh);
    res.send(allTo);
  };

  handleGetFromReports = async (
    req: express.Request,
    res: express.Response
  ) => {
    this.rm.forceReadFiles();
    const allFrom = this.rm.getReportByType(ReportType.From);
    await this.rm.verifyAllReportsToDb(this.dbh);
    res.send(allFrom);
  };

  handleGetAllNames = async (req: express.Request, res: express.Response) => {
    const names = await this.dbh.getAllNames();
    res.send(names);
  };

  handleGetNameById = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const name = await this.dbh.getNameById(id);
    res.send(name);
  };

  handleUpdateName = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const { name } = req.body;
    await this.dbh.updateName({ id, name });
    // Write to the database
    const n = await this.dbh.getNameById(id);
    // Update in the in-memory dictionary
    this.rm.addNameToDict(n.path, n.name);
    res.send(n);
  };
}

export default WatcherServer;
