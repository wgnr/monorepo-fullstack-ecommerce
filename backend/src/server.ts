import { GlobalVars } from "@config/index";
import { connectServices, closeServices } from "@root/appServices";

const { PORT, db: MongoDBConfig } = GlobalVars;

export const startServer = async () => {
  // Connect to services
  await connectServices(MongoDBConfig);

  const { httpServer } = await import("./app");

  const server = httpServer
    .listen(PORT, () => console.log(`Listening on port ${PORT}`))
    .on("error", error => console.error(`Error in server!!!!!\n${error}`));
};

export const shutDownServer = async () => {
  await closeServices();
  process.exit();
};
