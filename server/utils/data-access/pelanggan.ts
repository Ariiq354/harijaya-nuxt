import { desc, eq, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewPelanggan,
  pelangganTable,
} from "~~/server/database/schema/penjualan";

export async function getAllPelanggan() {
  return await db.query.pelangganTable.findMany({
    orderBy: desc(pelangganTable.createdAt),
  });
}

export async function createPelanggan(data: NewPelanggan) {
  return await db.insert(pelangganTable).values(data);
}

export async function updatePelanggan(id: number, data: Partial<NewPelanggan>) {
  return await db
    .update(pelangganTable)
    .set(data)
    .where(eq(pelangganTable.id, id));
}

export async function deletePelanggan(id: number[]) {
  return await db.delete(pelangganTable).where(inArray(pelangganTable.id, id));
}
