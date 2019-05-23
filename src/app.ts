import dotenv from "dotenv";
import WatcherServer from "./WatcherServer";

dotenv.config();

const server = new WatcherServer();

(async () => {
  try {
    await server.start(process.env.WATCH_DIR, 5000);

  } catch (e) {
    console.error(`Error starting the server`, e);
  }
})();
