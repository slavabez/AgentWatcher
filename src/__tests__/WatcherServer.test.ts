import "jest";
import axios from "axios";
import del from "del";
import WatcherServer from "../WatcherServer";
import FileHelper from "../helpers/FileHelper";
import { ReportType } from "../helpers/ReportManager";

describe("Basic API tests", () => {
  test("Basic single client connection", async () => {
    const server = new WatcherServer();
    const fh = new FileHelper();
    await server.start(fh.uniqueDir);
    const allReportsUrl = `http://localhost:${server.getPort()}/api/reports`;
    const res = await axios.get(allReportsUrl);
    // Needs to be an empty array
    expect(res.data).toStrictEqual([]);
    await fh.cleanup();
    await server.stop();
    await del(server.dbh.dbFilePath, { force: true });
  });
});

describe("Integration tests", () => {
  let server: WatcherServer;
  let fh: FileHelper;
  let connectionString: string;

  jest.setTimeout(30000);

  /*
    Setup - Before each test, create a server, create and connect a new client
    After all tests - disconnect the client, stop the server
   */

  beforeEach(async () => {
    server = new WatcherServer();
    fh = new FileHelper();
    await server.start(fh.uniqueDir);
    connectionString = `http://localhost:${server.getPort()}`;
  });

  afterEach(async () => {
    await fh.cleanup();
    await server.stop();
    await del(server.dbh.dbFilePath, { force: true });
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

  test("Adds the paths to the db properly with many files", async () => {
    // Create 100 random files, request via API, check the DB
    fh.createUniqueReportFiles(500);
    const res = await axios.get(`${connectionString}/api/reports`);
    expect(res.data).toHaveLength(500);

    const fromDb = await server.dbh.getAllNames();
    expect(fromDb).toHaveLength(500);
  });
});
