import { desc, eq, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewSupplier,
  supplierTable,
} from "~~/server/database/schema/pembelian";

export async function getAllSupplier() {
  return await db.query.supplierTable.findMany({
    orderBy: desc(supplierTable.createdAt),
  });
}

export async function createSupplier(data: NewSupplier) {
  return await db.insert(supplierTable).values(data);
}

export async function updateSupplier(id: number, data: Partial<NewSupplier>) {
  return await db
    .update(supplierTable)
    .set(data)
    .where(eq(supplierTable.id, id));
}

export async function deleteSupplier(id: number[]) {
  return await db.delete(supplierTable).where(inArray(supplierTable.id, id));
}
