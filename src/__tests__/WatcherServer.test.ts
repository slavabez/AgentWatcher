import "jest";
import axios from "axios";
import WatcherServer from "../WatcherServer";
import FileHelper from "../helpers/FileHelper";
import {ReportType} from "../helpers/ReportManager";

describe("Basic API tests", () => {
  test("Basic single client connection", async done => {
    const server = new WatcherServer();
    const fh = new FileHelper();
    server.start(fh.uniqueDir);
    const allReportsUrl = `http://localhost:${server.getPort()}/api/reports`;
    const res = await axios.get(allReportsUrl);
    // Needs to be an empty array
    expect(res.data).toStrictEqual([]);
    await fh.cleanup();
    server.stop(done);
  });
});

describe("Integration tests", () => {
  let server: WatcherServer;
  let fh: FileHelper;
  let connectionString: string;

  /*
    Setup - Before each test, create a server, create and connect a new client
    After all tests - disconnect the client, stop the server
   */

  beforeEach(() => {
    server = new WatcherServer();
    fh = new FileHelper();
    server.start(fh.uniqueDir);
    connectionString = `http://localhost:${server.getPort()}`;
  });

  afterEach(async done => {
    await fh.cleanup();
    server.stop(done);
  });

  test("Returns right number of reports", async () => {
    fh.createNReportFiles(10);
    const res = await axios.get(`${connectionString}/api/reports`);
    expect(res.data).toHaveLength(10);
  });

  test("Returns a single report fine", async () => {
    fh.createReportFile({
      name: "SimonPegg",
      time: new Date(),
      type: ReportType.To
    });

    const res = await axios.get(`${connectionString}/api/reports`);
    expect(res.data).toHaveLength(1);
    expect(res.data[0].name).toBe("SimonPegg");
    expect(res.data[0].type).toBe(ReportType.To);
  });

  test("Handles file deletes properly", async () => {
    const dummyReport = {
      name: "SimonPegg",
      time: new Date(),
      type: ReportType.To
    };

    fh.createReportFile(dummyReport);

    const resBefore = await axios.get(`${connectionString}/api/reports`);
    expect(resBefore.data).toHaveLength(1);
    expect(resBefore.data[0].name).toBe("SimonPegg");
    expect(resBefore.data[0].type).toBe(ReportType.To);

    fh.deleteFileForReport(dummyReport);

    const resAfter = await axios.get(`${connectionString}/api/reports`);
    expect(resAfter.data).toHaveLength(0);
  });
});
