import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./common";
import { barangTable } from "./penjualan";

export const prosesTable = sqliteTable("proses", {
  id: int().primaryKey({ autoIncrement: true }),
  noProses: text().notNull().unique(),
  tanggal: text().notNull(),
  ...timestamp,
});

export const prosesProdukTable = sqliteTable("proses_produk", {
  id: int().primaryKey({ autoIncrement: true }),
  noProses: text()
    .notNull()
    .references(() => prosesTable.noProses, { onDelete: "cascade" }),
  barangId: text()
    .notNull()
    .references(() => barangTable.id, { onDelete: "cascade" }),
  harga: int().notNull(),
  kuantitas: int().notNull(),
  tipeBarang: int().notNull(), // 1: barang mentah, 2: barang jadi
  ...timestamp,
});

export const stokFisikTable = sqliteTable("stok_fisik", {
  id: int().primaryKey({ autoIncrement: true }),
  noStokFisik: text().notNull().unique(),
  tanggal: text().notNull(),
  ...timestamp,
});

export const stokFisikProdukTable = sqliteTable("stok_fisik_produk", {
  id: int().primaryKey({ autoIncrement: true }),
  noStokFisik: text()
    .notNull()
    .references(() => stokFisikTable.noStokFisik, { onDelete: "cascade" }),
  barangId: text()
    .notNull()
    .references(() => barangTable.id, { onDelete: "cascade" }),
  kuantitas: int().notNull(),
  harga: int().notNull(),
  tipe: int().notNull(), // 1: kurang, 2: tambah
  ...timestamp,
});

// RELATIONS
export const prosesRelations = relations(prosesTable, ({ many }) => ({
  produkProses: many(prosesProdukTable),
}));

export const prosesProdukRelations = relations(
  prosesProdukTable,
  ({ one }) => ({
    proses: one(prosesTable, {
      fields: [prosesProdukTable.noProses],
      references: [prosesTable.noProses],
    }),
    barang: one(barangTable, {
      fields: [prosesProdukTable.barangId],
      references: [barangTable.id],
    }),
  })
);

export const stokFisiRelations = relations(stokFisikTable, ({ many }) => ({
  produkStok: many(stokFisikProdukTable),
}));

export const stokFisikProdukRelations = relations(
  stokFisikProdukTable,
  ({ one }) => ({
    stokFisik: one(stokFisikTable, {
      fields: [stokFisikProdukTable.noStokFisik],
      references: [stokFisikTable.noStokFisik],
    }),
    barang: one(barangTable, {
      fields: [stokFisikProdukTable.barangId],
      references: [barangTable.id],
    }),
  })
);

// TYPE
export type Proses = typeof prosesTable.$inferSelect;
export type NewProses = typeof prosesTable.$inferInsert;

export type ProsesProduk = typeof prosesProdukTable.$inferSelect;
export type NewProsesProduk = typeof prosesProdukTable.$inferInsert;

export type StokFisik = typeof stokFisikTable.$inferSelect;
export type NewStokFisik = typeof stokFisikTable.$inferInsert;

export type StokFisikProduk = typeof stokFisikProdukTable.$inferSelect;
export type NewStokFisikProduk = typeof stokFisikProdukTable.$inferInsert;
