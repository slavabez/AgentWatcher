import * as fs from "fs";
import chokidar from "chokidar";
import socketio from "socket.io";

import { PathHelper, ReportItem } from "./PathHelper";

let watchDir = require("../package.json").watchDirectory;

try {
  fs.accessSync(watchDir, fs.constants.F_OK);
} catch (e) {
  watchDir = `./AgentPlus`;
}

console.log(`Application started! Watching directory ${watchDir}`);

let allReports: ReportItem[] = [];

const io = socketio(5000);
// Start the file watcher
const watcher = chokidar.watch(watchDir);

io.on("connection", socket => {
  // Initial connection

  watcher.on("add", path => {
    const p = PathHelper.convert(path);
    if (p.type === 1 || p.type === 2) {
      const hasDuplicate = allReports.some(
        r => r.name === p.name && r.type === p.type
      );
      if (!hasDuplicate) {
        allReports.push(p);
      }
    }

    console.log(`File ${path} added, now ${allReports.length} files`);
    socket.emit("report_added", p);
  });

  watcher.on("unlink", path => {
    // Remove file from
    const processed = PathHelper.convert(path, true);
    allReports = allReports.filter(r => {
      return !(r.type === processed.type && r.name === processed.name);
    });
    console.log(`File ${path} removed, now ${allReports.length} files`);
    socket.emit("report_removed", processed);
  });

  socket.on("list_reports", () => {
    socket.emit("all_reports", allReports);
  });
});
