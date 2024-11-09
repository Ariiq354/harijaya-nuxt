import type {
  SQLiteColumn,
  SQLiteTableWithColumns,
} from "drizzle-orm/sqlite-core";
import type { H3Event } from "h3";
import { db } from "../database";
import { like, sql } from "drizzle-orm";

export function protectFunction(event: H3Event) {
  if (!event.context.session) {
    throw createError({
      statusCode: 401,
    });
  }
}

export async function getNumber(
  code: string,
  table: SQLiteTableWithColumns<any>,
  column: SQLiteColumn<any>
) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const date = `${year}${month}${day}`;

  const [result] = await db
    .select({
      num: sql<string>`
        CASE
          WHEN MAX(CAST(SUBSTR(${column}, -3) AS INTEGER)) ISNULL then '001'
          ELSE SUBSTR('00' || (MAX(CAST(SUBSTR(${column}, -3) AS INTEGER)) + 1), -3)
        END`,
    })
    .from(table)
    .where(
      like(column, sql`${code + "-"} || strftime('%Y%m%d', 'now') || '-%'`)
    );

  return code + "-" + date + "-" + result.num;
}
