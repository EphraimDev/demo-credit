import http from "http";
import conn from "../database/connect";

export default function handleGracefulShutdown(server: http.Server) {
  server.close(async function (err) {
    console.log("Http server closed!");
    conn.destroy();
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
}
