import * as fs from "fs";
import chokidar from "chokidar";

let watchDir = `/home/slava/ftp`;

// If /home/slava/ftp doesn't exist, use the current dir
try {
  fs.accessSync(`/home/slava/ftp`, fs.constants.F_OK);
} catch (e) {
  watchDir = `./`;
}

console.log(`Application started! Watching directory ${watchDir}`);

const watcher = chokidar.watch(watchDir);

const log = console.log.bind(console);

watcher.on("add", path => log(`File ${path} added`));
watcher.on("change", path => log(`File ${path} changed`));
watcher.on("unlink", path => log(`File ${path} deleted`));
