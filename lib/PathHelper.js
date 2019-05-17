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
var known_agents_json_1 = __importDefault(require("./known_agents.json"));
var names = known_agents_json_1.default;
var ReportType;
(function (ReportType) {
    ReportType[ReportType["From"] = 1] = "From";
    ReportType[ReportType["To"] = 2] = "To";
    ReportType[ReportType["Unknown"] = 3] = "Unknown";
})(ReportType || (ReportType = {}));
var PathHelper = /** @class */ (function () {
    function PathHelper() {
    }
    PathHelper.convert = function (path, isDeleted) {
        if (isDeleted === void 0) { isDeleted = false; }
        // Remove all before AgentPlus\
        var cut = path.substring(path.indexOf("\\AgentPlus\\") + 11);
        // 'cut' should now be Name\From1C.zip or Name\1\From1C.zip
        var parts = cut.split("\\");
        if (parts.length === 3) {
            // 3 parter (Name\1\From1C.zip)
            var rawName = parts[0];
            var rawType = parts[2];
            var name = this.findName(rawName);
            var type = this.getType(rawType);
            var time = isDeleted ? null : fs.statSync(path).mtime;
            return { name: name, type: type, time: time };
        }
        else if (parts.length === 2) {
            // Regular, 2 parter (Name\From1C.zip)
            var rawName = parts[0], rawType = parts[1];
            var name = this.findName(rawName);
            var type = this.getType(rawType);
            var time = isDeleted ? null : fs.statSync(path).mtime;
            return { name: name, type: type, time: time };
        }
        return {
            name: "Lol",
            type: ReportType.From,
            time: new Date()
        };
    };
    PathHelper.findName = function (name) {
        if (names[name]) {
            return names[name];
        }
        else {
            return name;
        }
    };
    PathHelper.getType = function (type) {
        if (type === "From1C.zip") {
            return ReportType.From;
        }
        else if (type === "To1C.zip") {
            return ReportType.To;
        }
        else {
            return ReportType.Unknown;
        }
    };
    return PathHelper;
}());
exports.PathHelper = PathHelper;
