import "jest";
import WatcherServer from "../WatcherServer";
import FileHelper from "../helpers/FileHelper";
import * as SocketIOClient from "socket.io-client";

describe("Simple connectivity tests", () => {
  let server: WatcherServer;
  let clients: SocketIOClient.Socket[] = [];
  let fh: FileHelper;

  beforeAll(done => {
    server = new WatcherServer();
    fh = new FileHelper();
    server.start(fh.uniqueDir);
    done();
  });

  afterAll(done => {
    server.stop();
    fh.fullCleanup(done);
  });

  test("Let's see", () => {
    console.log("Done!");
    fh.createNReportFiles(10);
  });
});
