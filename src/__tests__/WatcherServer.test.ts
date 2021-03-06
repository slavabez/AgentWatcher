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
      path: "SimonPegg",
      time: new Date(),
      type: ReportType.To
    });

    const res = await axios.get(`${connectionString}/api/reports`);
    expect(res.data).toHaveLength(1);
    expect(res.data[0].path).toBe("SimonPegg");
    expect(res.data[0].type).toBe(ReportType.To);
  });

  test("Handles file deletes properly", async () => {
    const dummyReport = {
      path: "SimonPegg",
      time: new Date(),
      type: ReportType.To
    };

    fh.createReportFile(dummyReport);

    const resBefore = await axios.get(`${connectionString}/api/reports`);
    expect(resBefore.data).toHaveLength(1);
    expect(resBefore.data[0].path).toBe("SimonPegg");
    expect(resBefore.data[0].type).toBe(ReportType.To);

    fh.deleteFileForReport(dummyReport);

    const resAfter = await axios.get(`${connectionString}/api/reports`);
    expect(resAfter.data).toHaveLength(0);
  });

  test("Adds the paths to the db properly with many files", async () => {
    // Create 100 random files, request via API, check the DB
    fh.createUniqueReportFiles(100);
    const res = await axios.get(`${connectionString}/api/reports`);
    expect(res.data).toHaveLength(100);

    const fromDb = await server.dbh.getAllNames();
    expect(fromDb).toHaveLength(100);

    const fromApi = await axios.get(`${connectionString}/api/names`);
    expect(fromApi.data).toHaveLength(100);
  });

  test("Add a random file, update name", async () => {
    fh.createUniqueReportFiles(2);
    await axios.get(`${connectionString}/api/reports`);
    const names = await axios.get(`${connectionString}/api/names`);
    expect(names.data).toHaveLength(2);

    const updated = await axios.put(
      `${connectionString}/api/names/${names.data[0].id}`,
      { name: "New Name" }
    );

    expect(updated.data).toEqual({ id: names.data[0].id, path: names.data[0].path, name: "New Name" });
  });

  test("Can add a file, assign name, read it, then delete it", async () => {
    // Create a dummy report, read, make sure that works
    const dummy = {
      path: "./Imasneakypath/",
      time: new Date(),
      type: ReportType.To
    };

    fh.createReportFile(dummy);

    const initialRes = await axios.get(`${connectionString}/api/reports`);
    expect(initialRes.data).toHaveLength(1);
    expect(initialRes.data[0].path).toBe("Imasneakypath");
    expect(initialRes.data[0].type).toBe(ReportType.To);

    // Make sure a name has been created automatically in teh DB
    const names = await axios.get(`${connectionString}/api/names`);
    expect(names.data).toHaveLength(1);
    expect(names.data[0].id).not.toBeNaN();
    expect(names.data[0]).toHaveProperty(`name`);
    expect(names.data[0]).toHaveProperty(`path`);

    // Use the API to assign a name to this path, read, double check it's name has been set
    const nameId = names.data[0].id;
    const reqBody = {
      name: "I'm a sneaky path"
    };
    const updateReq = await axios.put(`${connectionString}/api/names/${nameId}`, reqBody);
    expect(updateReq.status).toBe(200);
    expect(updateReq.data).toHaveProperty("name");
    expect(updateReq.data.name).toBe("I'm a sneaky path");

    const secondGetReq = await axios.get(`${connectionString}/api/names/`);
    expect(secondGetReq.status).toBe(200);
    expect(secondGetReq.data).toHaveLength(1);
    expect(secondGetReq.data[0]).toHaveProperty("name");
    expect(secondGetReq.data[0].name).toBe("I'm a sneaky path");
    expect(secondGetReq.data[0].path).toBe("Imasneakypath");

    // Delete the name using the API, double check it's gone
    const delReq = await axios.delete(`${connectionString}/api/names/${nameId}`);
    expect(delReq.status).toBe(200);

    const finalReq = await axios.get(`${connectionString}/api/names`);
    expect(finalReq.status).toBe(200);
    expect(finalReq.data).toHaveLength(0);

  });
});
