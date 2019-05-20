import * as fs from "fs";
import * as uniqid from "uniqid";
import * as faker from "faker";
import * as rimraf from "rimraf";
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

  createReportFile(r: Report) {
    const fileName = r.type === ReportType.To ? "To1C.zip" : "From1C.zip";
    fs.mkdirSync(`${this.uniqueDir}/${r.name}`);
    fs.writeFileSync(`${this.uniqueDir}/${r.name}/${fileName}`, "Lol");
  }

  fullCleanup() {
    rimraf.sync(`./.${this.prefix}`);
  }

  static createRandomReport(type: ReportType = ReportType.To): Report {
    const someTimeAgo = Date.now() - 60 * 1000 * 60 * Math.random();
    return {
      name: faker.name.lastName().replace(" ", ""),
      type,
      time: new Date(someTimeAgo)
    };
  }

  deleteFileForReport(r: Report) {
    const fileName = r.type === ReportType.To ? "To1C.zip" : "From1C.zip";
    const path = `${this.uniqueDir}${r.name}/${fileName}`;
    try {
      fs.unlinkSync(path);
    } catch (e) {
      console.error(`Error attempting to delete file ${path}`);
    }
  }
}
