import * as fs from "fs";
import knownNames from "./known_agents.json";

type NameList = { [index: string]: string };

const names: NameList = knownNames;

enum ReportType {
  From = 1,
  To = 2,
  Unknown = 3
}

export interface ReportItem {
  name: string;
  type: ReportType;
  time: Date | null;
}

export class PathHelper {
  static convert(path: string, isDeleted: boolean = false): ReportItem {
    // Remove all before AgentPlus\
    const cut = path.substring(path.indexOf("\\AgentPlus\\") + 11);
    // 'cut' should now be Name\From1C.zip or Name\1\From1C.zip
    const parts = cut.split("\\");
    if (parts.length === 3) {
      // 3 parter (Name\1\From1C.zip)
      const rawName = parts[0];
      const rawType = parts[2];
      const name = this.findName(rawName);
      const type = this.getType(rawType);
      const time = isDeleted ? null : fs.statSync(path).mtime;
      return { name, type, time };
    } else if (parts.length === 2) {
      // Regular, 2 parter (Name\From1C.zip)
      const [rawName, rawType] = parts;
      const name = this.findName(rawName);
      const type = this.getType(rawType);
      const time = isDeleted ? null : fs.statSync(path).mtime;
      return { name, type, time };
    }
    return {
      name: "Lol",
      type: ReportType.From,
      time: new Date()
    };
  }

  static findName(name: string): string {
    if (names[name]) {
      return names[name];
    } else {
      return name;
    }
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
