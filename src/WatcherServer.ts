import { Server, createServer } from "http";
import { AddressInfo } from "net";
import * as express from "express";
import * as socketIO from "socket.io";

import ReportManager from "./helpers/ReportManager";

class WatcherServer {
  private readonly app: Express.Application;
  private readonly server: Server;
  private io: socketIO.Server;
  public address?: string | AddressInfo | null;
  public rm: ReportManager;

  constructor(watchDir: string) {
    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIO(this.server);
    this.rm = new ReportManager(watchDir);
  }

  /**
   * Starts the server on a port specified. If no port is specified, takes a random free port
   * @param port
   */
  start(port?: number): void {
    this.server.listen(port, () => {
      if (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "ci")
        console.log(`HTTP Server listening on port ${this.getPort()}`);
    });
    this.address = this.server.address();
    this.io.on("connection", (socket: socketIO.Socket) => {
      // New user connected, attach socket event listeners
    });
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

  stop(): void {
    this.io.close();
    this.server.close();
  }
}

export default WatcherServer;
