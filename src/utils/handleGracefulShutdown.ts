import http from "http";
import { dbConn } from "../..";

export default function handleGracefulShutdown(server: http.Server) {
  server.close(async function (err) {
    console.log("Http server closed!");
    dbConn.destroy();
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
}
