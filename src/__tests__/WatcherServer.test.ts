import "jest";
import WatcherServer from "../WatcherServer";
import FileHelper from "../helpers/FileHelper";
import * as SocketIOClient from "socket.io-client";
import { ReportType } from "../helpers/ReportManager";

describe("Basic connectivity test", () => {
  test("Basic single client connection", done => {
    const server = new WatcherServer();
    const fh = new FileHelper();
    server.start(fh.uniqueDir);
    const connString = `http://localhost:${server.getPort()}`;
    const client = SocketIOClient.connect(connString, {
      transports: ["websocket"]
    });
    client.on("connect", async () => {
      client.disconnect();
      await fh.cleanup();
      await server.stop();
      done();
    });
  });
});

describe("Integration tests", () => {
  let server: WatcherServer;
  let client: SocketIOClient.Socket;
  let fh: FileHelper;

  /*
    Setup - Before each test, create a server, create and connect a new client
    After all tests - disconnect the client, stop the server
   */

  beforeEach(done => {
    server = new WatcherServer();
    fh = new FileHelper();
    server.start(fh.uniqueDir);

    const connString = `http://localhost:${server.getPort()}`;
    client = SocketIOClient.connect(connString, {
      transports: ["websocket"]
    });

    client.on("connect", async () => {
      done();
    });
  });

  afterEach(async done => {
    if (client && client.connected) client.disconnect();
    await fh.cleanup();
    await server.stop();
    done();
  });

  test("Emits relevant event with 10 reports when reports are added", done => {
    fh.createNReportFiles(10);
    client.on("report.all", data => {
      expect(data).toHaveLength(10);
      done();
    });

    client.emit("report.all");
  });

  test("Emits an event when new report is added (To)", done => {
    client.on("report.added.to", report => {
      expect(report.name).toBe("SimonPegg");
      expect(report.type).toBe(ReportType.To);

      done();
    });

    fh.createReportFile({
      name: "SimonPegg",
      time: new Date(),
      type: ReportType.To
    });
  });

  test("Emits an event when new report is added (From)", done => {
    client.on("report.added.from", report => {
      expect(report.name).toBe("SimonPog");
      expect(report.type).toBe(ReportType.From);

      done();
    });

    fh.createReportFile({
      name: "SimonPog",
      time: new Date(),
      type: ReportType.From
    });
  });

  test("Emits an event when a report is deleted", done => {
    const report = {
      name: "Jahn",
      type: ReportType.To,
      time: new Date()
    };
    fh.createReportFile(report);

    client.on("report.deleted.to", r => {
      expect(r.type).toBe(ReportType.To);
      expect(r.name).toBe("Jahn");
      done();
    });

    // Adding a small timeout to help register the event
    setTimeout(() => {
      fh.deleteFileForReport(report);
    }, 100);
  });
});
