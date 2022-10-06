import http from "http";
import { db } from "../..";

export default function handleGracefulShutdown(server: http.Server) {
  server.close(async function (err) {
    console.log("Http server closed!");
    db.then((conn) => conn?.destroy()).catch((err) => console.log(err));
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
}
