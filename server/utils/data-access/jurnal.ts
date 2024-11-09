import { desc, eq, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewJurnal,
  jurnalTable,
} from "~~/server/database/schema/keuangan";

export async function getAllJurnal() {
  return await db.query.jurnalTable.findMany({
    orderBy: desc(jurnalTable.createdAt),
    with: {
      akun: {
        columns: {
          kodeAkun: true,
          namaAkun: true,
        },
      },
    },
  });
}

export async function createJurnal(data: NewJurnal) {
  return await db.insert(jurnalTable).values(data);
}

export async function updateJurnal(id: number, data: Partial<NewJurnal>) {
  return await db.update(jurnalTable).set(data).where(eq(jurnalTable.id, id));
}

export async function deleteJurnal(id: number[]) {
  return await db.delete(jurnalTable).where(inArray(jurnalTable.id, id));
}
