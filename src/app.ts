import { envs } from "./config/plugins/envs.plugin";
import { Server } from "./presentation/server";

async function main() {
   Server.start();
  // console.log(envs);
}

main();