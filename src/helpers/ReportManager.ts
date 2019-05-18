import * as chokidar from "chokidar";
import * as fs from "fs";

enum ReportType {
  From = 1,
  To = 2,
  Unknown = 3
}

export interface Report {
  name: string;
  type: ReportType;
  time: Date | null;
}

class ReportManager {
  public watcher: chokidar.FSWatcher;
  public allReports: Map<string, Report>;

  constructor(watchDir: string) {
    // Check that path specified is a directory
    try {
      fs.accessSync(watchDir, fs.constants.F_OK);
    } catch (e) {
      console.error(`Error trying to access the directory ${watchDir}`, e);
    }

    this.watcher = chokidar.watch(watchDir);
  }

  getReportByType(type: ReportType) {
    // Covert to array, filter to return only type specified (To, aka sales or From, aka supplies)
    return Array.from(this.allReports.values()).filter(r => r.type === type);
  }
}

export default ReportManager;
