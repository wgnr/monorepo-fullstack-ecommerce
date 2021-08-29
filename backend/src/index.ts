import { startServer, shutDownServer } from "@root/server";

startServer();

process.on("SIGINT", async () => {
  console.log("Exiting...");
  await shutDownServer();
  process.exit();
});
