import WatcherServer from "./WatcherServer";
import * as config from "../package.json";

const server = new WatcherServer();

server.start(config.watchDir);

console.log(server.getAddress());
