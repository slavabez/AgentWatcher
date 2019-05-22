import * as chokidar from "chokidar";
import * as fs from "fs";
import * as path from "path";

export enum ReportType {
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
  public watchDir?: string;

  constructor(watchDir: string) {
    // Check that path specified is a directory
    try {
      fs.accessSync(watchDir, fs.constants.F_OK);
    } catch (e) {
      console.error(`Error trying to access the directory ${watchDir}`, e);
    }

    this.watchDir = watchDir;
    this.allReports = new Map<string, Report>();
  }

  addToReportMap(r: Report) {
    this.allReports.set(`${r.name}-${r.type}`, r);
  }

  getReportByType(type: ReportType) {
    // Covert to array, filter to return only type specified (To, aka sales or From, aka supplies)
    return Array.from(this.allReports.values()).filter(r => r.type === type);
  }

  /**
   * Forces reading from the files, without relying on the file watcher
   */
  forceReadFiles(): void {
    const result = [];

    const files = [this.watchDir];
    do {
      const filepath = files.pop();
      const stat = fs.lstatSync(filepath);
      if (stat.isDirectory()) {
        fs.readdirSync(filepath).forEach(f =>
          files.push(path.join(filepath, f))
        );
      } else if (stat.isFile()) {
        result.push(filepath);
      }
    } while (files.length !== 0);

    if (result) {
      result.forEach(r => {
        this.addToReportMap(ReportManager.convert(r));
      });
    }
  }

  /**
   * Converts file path to a digested object
   * @param path - has to be the full path, including the /AgentPlus/ part.
   * @param isDeleted - if true, doesn't try to get 'last modified'. Use when you know the file no longer exists.
   */
  static convert(path: string, isDeleted: boolean = false): Report {
    // Remove all before and including AgentPlus\
    const cut = path.substring(path.indexOf("/AgentPlus/") + 11);
    // 'cut' should now be Name\From1C.zip or Name\1\From1C.zip
    const parts = cut.split("/");
    if (parts.length === 3) {
      // 3 parts (Name\1\From1C.zip)
      const rawName = parts[0];
      const rawType = parts[2];
      const name = this.findName(rawName);
      const type = this.getType(rawType);
      const time = isDeleted ? null : fs.statSync(path).mtime;
      return { name, type, time };
    } else if (parts.length === 2) {
      // Regular, 2 parts (Name\From1C.zip)
      const [rawName, rawType] = parts;
      const name = this.findName(rawName);
      const type = this.getType(rawType);
      const time = isDeleted ? null : fs.statSync(path).mtime;
      return { name, type, time };
    } else {
      return {
        name: "Error",
        type: ReportType.Unknown,
        time: new Date()
      };
    }
  }

  static findName(name: string): string {
    // TODO: implement persistent name storage
    return name;
  }

  static getType(type: string): ReportType {
    if (type === "From1C.zip") {
      return ReportType.From;
    } else if (type === "To1C.zip") {
      return ReportType.To;
    } else {
      return ReportType.Unknown;
    }
  }
}

export default ReportManager;
