import fs from "fs";
import uniqid from "uniqid";
import faker from "faker";
import del from "del";
import { Report, ReportType } from "./ReportManager";

/**
 * A file to help with tests, creates temp files and directories
 */
export default class FileHelper {
  public readonly uniqueDir: string;
  public readonly prefix?: string;

  constructor(prefix: string = uniqid()) {
    this.prefix = prefix;
    this.uniqueDir = `./.${this.prefix}/AgentPlus/`;
    // Create the prefixed folder
    fs.mkdirSync(`./.${this.prefix}`);
    fs.mkdirSync(this.uniqueDir);
  }

  createNReportFiles(n: number) {
    for (let i = 0; i < n; i++) {
      let type: boolean | ReportType = !!Math.round(Math.random());
      type = type ? ReportType.To : ReportType.From;
      this.createReportFile(FileHelper.createRandomReport(type));
    }
  }

  createUniqueReportFiles(n: number) {
    for (let i = 0; i < n; i++) {
      const coinToss = !!Math.round(Math.random());
      const type = coinToss ? ReportType.To : ReportType.From;
      this.createReportFile(FileHelper.createUniqueRandomReport(type));
    }
  }

  /**
   * Creates a file in relevant directory, to mock Agent Plus behaviour
   * @param r
   */
  createReportFile(r: Report) {
    const fileName = r.type === ReportType.To ? "To1C.zip" : "From1C.zip";
    fs.mkdirSync(`${this.uniqueDir}${r.path}`);
    fs.writeFileSync(`${this.uniqueDir}${r.path}/${fileName}`, "Lol");
  }

  async cleanup() {
    await del(`./.${this.prefix}`, { force: true });
  }

  static createRandomReport(type = ReportType.To): Report {
    const someTimeAgo = Date.now() - 60 * 1000 * 60 * Math.random();
    return {
      path: faker.name.lastName().replace(" ", ""),
      type,
      time: new Date(someTimeAgo)
    };
  }

  static createUniqueRandomReport(type = ReportType.To): Report {
    const someTimeAgo = Date.now() - 60 * 1000 * 60 * Math.random();
    return {
      path: uniqid(),
      type,
      time: new Date(someTimeAgo)
    };
  }

  deleteFileForReport(r: Report) {
    const fileName = r.type === ReportType.To ? "To1C.zip" : "From1C.zip";
    const path = `${this.uniqueDir}${r.path}/${fileName}`;
    try {
      fs.unlinkSync(path);
    } catch (e) {
      console.error(`Error attempting to delete file ${path}`);
    }
  }
}
