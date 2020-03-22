import { mainDb } from "../db";

async function main() {
  const results = await mainDb.raw("SELECT * FROM dbo.VendorAuthRole;");
  console.log("RESULTS: ", results);

  const results2 = await mainDb.select().from("VendorAuthRole");
  console.log("RESULTS2: ", results2);

  process.exit();
}
main();
