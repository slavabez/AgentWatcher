import "jest";
import WatcherServer from "../WatcherServer";
import FileHelper from "../helpers/FileHelper";
import * as SocketIOClient from "socket.io-client";

describe("Simple connectivity tests", () => {
  let server: WatcherServer;
  let client: SocketIOClient.Socket;
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

  afterEach(() => {
    if (client && client.connected) client.disconnect();
  });

  test("Basic single client connection", done => {
    const connString = `http://localhost:${server.getPort()}`;
    const client = SocketIOClient.connect(connString, {
      transports: ["websocket"]
    });
    client.on("connect", () => {
      done();
    });
  });
});
