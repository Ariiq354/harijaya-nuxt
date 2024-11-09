import { jurnalTable } from "~~/server/database/schema/keuangan";

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getNumber("TRX", jurnalTable, jurnalTable.kodeTransaksi);

  return res;
});
