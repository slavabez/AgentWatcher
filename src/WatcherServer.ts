import { createServer, Server } from "http";
import { AddressInfo } from "net";
import * as express from "express";
import * as cors from "cors";
import * as socketIO from "socket.io";

import ReportManager, { Report, ReportType } from "./helpers/ReportManager";

class WatcherServer {
  private readonly app: express.Application;
  private readonly server: Server;
  private io: socketIO.Server;
  public address?: string | AddressInfo | null;
  public rm?: ReportManager;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.server = createServer(this.app);
    this.io = socketIO(this.server);

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
    this.io.on("connection", (socket: socketIO.Socket) => {
      // User is requesting ALL the reports
      socket.on("report.all", () => {
        this.rm.forceReadFiles();
        const all = Array.from(this.rm.allReports.values());
        socket.emit("report.all", all);
      });

      // User requesting ALL of the TO reports (sales)
      socket.on("report.all.to", () => {
        this.rm.forceReadFiles();
        const allTo = this.rm.getReportByType(ReportType.To);
        socket.emit("report.all.to", allTo);
      });

      // User requesting ALL of the FROM reports (stock)
      socket.on("report.all.from", () => {
        this.rm.forceReadFiles();
        const allFrom = this.rm.getReportByType(ReportType.From);
        socket.emit("report.all.from", allFrom);
      });
    });

    // Preparing callbacks
    const handleAdded = (r: Report) => {
      // have a loot at the type and fire a relevant event
      if (r.type === ReportType.To) {
        console.log(`Emitting new TO report for ${r.name}`);
        this.io.emit("report.added.to", r);
      } else if (r.type === ReportType.From) {
        console.log(`Emitting new FROM report for ${r.name}`);
        this.io.emit("report.added.from", r);
      }
    };

    const handleDeleted = (r: Report) => {
      if (r.type === ReportType.To) {
        console.log(`Emitting deleted TO report for ${r.name}`);
        this.io.emit("report.deleted.to", r);
      } else if (r.type === ReportType.From) {
        console.log(`Emitting deleted FROM report for ${r.name}`);
        this.io.emit("report.deleted.from", r);
      }
    };

    this.rm = new ReportManager(watchDir, handleAdded, handleDeleted);
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
    this.io.close();
    await this.server.close();
  }
}

export default WatcherServer;
