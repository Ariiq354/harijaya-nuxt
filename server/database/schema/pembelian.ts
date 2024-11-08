import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./auth";
import { timestamp } from "./common";
import { pembayaranUtangItemTable } from "./keuangan";
import { barangTable } from "./penjualan";

export const supplierTable = sqliteTable("supplier", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull(),
  npwp: text().notNull(),
  phone: text().notNull(),
  address: text().notNull(),
  namaBank: text().notNull(),
  namaRekening: text().notNull(),
  noRekening: text().notNull(),
  ...timestamp,
});

export const fakturPembelianTable = sqliteTable("faktur_pembelian", {
  id: int().primaryKey({ autoIncrement: true }),
  supplierId: text().references(() => supplierTable.id, {
    onDelete: "set null",
  }),
  noFaktur: text().notNull().unique(),
  tanggal: text().notNull(),
  userId: text().references(() => userTable.id, {
    onDelete: "set null",
  }),
  lampiran: text().notNull(),
  biayaKirim: int().notNull(),
  catatan: text().notNull(),
  biayaLainnya: int().notNull(),
  total: int().notNull(),
  ...timestamp,
});

export const pembelianProdukTable = sqliteTable("pembelian_produk", {
  id: int().primaryKey({ autoIncrement: true }),
  noPembelian: text()
    .notNull()
    .references(() => fakturPembelianTable.noFaktur, { onDelete: "cascade" }),
  barangId: text()
    .notNull()
    .references(() => barangTable.id, { onDelete: "cascade" }),
  harga: int().notNull(),
  kuantitas: int().notNull(),
  ...timestamp,
});

export const fakturPembelianRelations = relations(
  fakturPembelianTable,
  ({ one, many }) => ({
    supplier: one(supplierTable, {
      fields: [fakturPembelianTable.supplierId],
      references: [supplierTable.id],
    }),
    produk: many(pembelianProdukTable),
    pembayaran: many(pembayaranUtangItemTable),
  })
);

export const pembelianProdukRelations = relations(
  pembelianProdukTable,
  ({ one }) => ({
    fakturPembelian: one(fakturPembelianTable, {
      fields: [pembelianProdukTable.noPembelian],
      references: [fakturPembelianTable.noFaktur],
    }),
    barang: one(barangTable, {
      fields: [pembelianProdukTable.barangId],
      references: [barangTable.id],
    }),
  })
);

export type Supplier = typeof supplierTable.$inferSelect;
export type NewSupplier = typeof supplierTable.$inferInsert;

export type FakturPembelian = typeof fakturPembelianTable.$inferSelect;
export type NewFakturPembelian = typeof fakturPembelianTable.$inferInsert;

export type PembelianProduk = typeof pembelianProdukTable.$inferSelect;
export type NewPembelianProduk = typeof pembelianProdukTable.$inferInsert;
