// NOTE: The import from "./config" should always be first. See notes in config.
import { PACKAGE_NAME, PACKAGE_VERSION } from "./config";
import { start } from "./app";

console.log(`Starting ${PACKAGE_NAME} v${PACKAGE_VERSION}`);
console.log("");
start();
