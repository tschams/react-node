import { PasswordUtils } from "../lib/security/passwords";

var password = "asdfASDF1$";

/** Password hashed by ASP.NET Core 2.2 Identity Framework */
var hashedPassword =
  "AQAAAAEAAE4gAAAAEJHyKIPGzsfjrk63eeb/" +
  "vunIxEMuuMtXDAV1AivAalm6TLw66NeimG8SZjZkS1QtLA==";

async function main() {
  // Test password hashed by externally verified source.
  console.log("");
  console.log("Testing externally hashed password...");
  console.log("");
  if (await PasswordUtils.compare(hashedPassword, password)) {
    console.info("PASSED: Correct password matches hash!");
  } else {
    console.warn("FAILED: Correct password DOES NOT match hash!");
  }

  if (!(await PasswordUtils.compare(hashedPassword, "INCORRECT"))) {
    console.warn("PASSED: Incorrect password does not match hash!");
  } else {
    console.info("FAILED: Incorrect password MATCHES hash!?");
  }

  // Test password hashed by our code.
  console.log("");
  console.log("Testing locally hashed password...");
  console.log("");
  const hashed = await PasswordUtils.hash(password);
  console.log("hashed: ", '"' + hashed + '"');
  if (await PasswordUtils.compare(hashed, password)) {
    console.info("PASSED: Correct password matches hash!");
  } else {
    console.warn("FAILED: Correct password DOES NOT match hash!");
  }

  console.log("");
}

main();
