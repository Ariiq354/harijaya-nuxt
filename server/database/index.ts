import { drizzle } from "drizzle-orm/libsql";
import * as auth from "./schema/auth";
import * as inventory from "./schema/inventory";
import * as penjualan from "./schema/penjualan";
import * as pembelian from "./schema/pembelian";
import * as keuangan from "./schema/keuangan";

const config = useRuntimeConfig();

export const db = drizzle({
  connection: {
    url: config.databaseUrl as string,
    authToken: config.databaseAuthToken as string,
  },
  schema: {
    ...auth,
    ...inventory,
    ...penjualan,
    ...pembelian,
    ...keuangan,
  },
  casing: "snake_case",
});
