import { desc, eq, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewBarang,
  barangTable,
} from "~~/server/database/schema/penjualan";

export async function getAllBarang() {
  return await db.query.barangTable.findMany({
    orderBy: desc(barangTable.createdAt),
  });
}

export async function createBarang(data: NewBarang) {
  return await db.insert(barangTable).values(data);
}

export async function updateBarang(id: number, data: Partial<NewBarang>) {
  return await db.update(barangTable).set(data).where(eq(barangTable.id, id));
}

export async function deleteBarang(id: number[]) {
  return await db.delete(barangTable).where(inArray(barangTable.id, id));
}
