import * as fs from "fs";
import chokidar from "chokidar";
import socketio from "socket.io";

import { PathHelper, ReportItem } from "./PathHelper";

let watchDir = `C:\\Users\\bezga\\ftp\\AgentPlus`;

// If /home/slava/ftp doesn't exist, use the current dir
try {
  fs.accessSync(watchDir, fs.constants.F_OK);
} catch (e) {
  watchDir = `./AgentPlus`;
}

console.log(`Application started! Watching directory ${watchDir}`);

let allReports: ReportItem[] = [];

const io = socketio(5000);

io.on("connection", socket => {
  // Initial connection

  // Start the file watcher
  const watcher = chokidar.watch(watchDir);

  watcher.on("add", path => {
    const processed = PathHelper.convert(path);
    if (processed.type !== 3) allReports.push(processed);
    console.log(`File ${path} added, now ${allReports.length} files`);
    socket.emit("report_added", processed);
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
