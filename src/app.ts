import WatcherServer from "./WatcherServer";

const server = new WatcherServer(`/home/slava/ftp`);

server.start();

console.log(server.getAddress());
