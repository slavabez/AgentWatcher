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
var watchDir = "/home/slava/ftp";
// If /home/slava/ftp doesn't exist, use the current dir
try {
    fs.accessSync("/home/slava/ftp", fs.constants.F_OK);
}
catch (e) {
    watchDir = "./";
}
console.log("Application started! Watching directory " + watchDir);
var watcher = chokidar_1.default.watch(watchDir);
var log = console.log.bind(console);
watcher.on("add", function (path) { return log("File " + path + " added"); });
watcher.on("change", function (path) { return log("File " + path + " changed"); });
watcher.on("unlink", function (path) { return log("File " + path + " deleted"); });
