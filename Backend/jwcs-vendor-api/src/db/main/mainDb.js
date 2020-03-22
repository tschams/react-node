import Knex from "knex";

import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "../../config";

export const mainDb = Knex({
  client: "mssql",
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    requestTimeout: 30 * 1000, // 30 seconds in milliseconds
    user: DB_USER,
    password: DB_PASS,
    options: {
      enableArithAbort: true,
    },
  },
  postProcessResponse(result, queryContext) {
    if (Array.isArray(result)) {
      return result.map(convertRowPropertyNamesToCamelCase);
    }
    return convertRowPropertyNamesToCamelCase(result);
  },
});

function convertRowPropertyNamesToCamelCase(row) {
  if (!row) {
    return row;
  }
  const entries = Object.entries(row);
  const newRow = {};
  for (let [colName, value] of entries) {
    const newName = colName.substr(0, 1).toLowerCase() + colName.substr(1);
    newRow[newName] = value;
  }
  return newRow;
}
