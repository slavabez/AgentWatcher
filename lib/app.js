"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var chokidar_1 = __importDefault(require("chokidar"));
var PathHelper_1 = require("./PathHelper");
var watchDir = "C:\\Users\\bezga\\ftp\\AgentPlus";
// If /home/slava/ftp doesn't exist, use the current dir
try {
    fs.accessSync(watchDir, fs.constants.F_OK);
}
catch (e) {
    watchDir = "./AgentPlus";
}
console.log("Application started! Watching directory " + watchDir);
var allReports = [];
var watcher = chokidar_1.default.watch(watchDir);
watcher.on("add", function (path) {
    var processed = PathHelper_1.PathHelper.convert(path);
    if (processed.type !== 3)
        allReports.push(processed);
    console.log("File added, now " + allReports.length + " files");
});
watcher.on("unlink", function (path) {
    // Remove file from
    var processed = PathHelper_1.PathHelper.convert(path, true);
    allReports = allReports.filter(function (r) {
        return !(r.type === processed.type && r.name === processed.name);
    });
    console.log("File removed, now " + allReports.length + " files");
});
