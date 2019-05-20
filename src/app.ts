import * as dotenv from "dotenv";
import WatcherServer from "./WatcherServer";

dotenv.config();

const server = new WatcherServer();

server.start(process.env.WATCH_DIR, 5000);

console.log(server.getAddress());
