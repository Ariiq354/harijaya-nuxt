import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./auth";
import { timestamp } from "./common";
import { pembayaranPiutangItemTable } from "./keuangan";

export const barangTable = sqliteTable("barang", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  deskripsi: text().notNull(),
  satuan: text().notNull(),
  tipe: int().notNull(), // 1: mentah, 2: jadi
  status: int({ mode: "boolean" }).notNull(), // 0: tidak aktif, 1: aktif
  ...timestamp,
});

export const barangHargaTable = sqliteTable("barang_harga", {
  id: int().primaryKey({ autoIncrement: true }),
  barangId: text()
    .notNull()
    .references(() => barangTable.id, { onDelete: "cascade" }),
  harga: int().notNull(),
  stok: int().notNull(),
  ...timestamp,
});

export const pelangganTable = sqliteTable("pelanggan", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull(),
  phone: text().notNull(),
  npwp: text().notNull(),
  address: text().notNull(),
  namaBank: text().notNull(),
  namaRekening: text().notNull(),
  noRekening: text().notNull(),
  ...timestamp,
});

export const fakturPenjualanTable = sqliteTable("faktur_penjualan", {
  id: int().primaryKey({ autoIncrement: true }),
  pelangganId: text()
    .notNull()
    .references(() => pelangganTable.id, {
      onDelete: "set default",
    })
    .default(""),
  noFaktur: text().notNull().unique(),
  tanggal: text().notNull(),
  userId: text()
    .notNull()
    .references(() => userTable.id, {
      onDelete: "set default",
    })
    .default(""),
  lampiran: text().notNull(),
  catatan: text().notNull(),
  ppn: int({ mode: "boolean" }).notNull(), // 0: tidak, 1: iya
  biayaKirim: int().notNull(),
  biayaLainnya: int().notNull(),
  total: int().notNull(),
  ...timestamp,
});

export const penjualanProdukTable = sqliteTable("penjualan_produk", {
  id: int().primaryKey({ autoIncrement: true }),
  noPenjualan: text()
    .notNull()
    .references(() => fakturPenjualanTable.noFaktur, {
      onDelete: "cascade",
    }),
  barangId: text()
    .notNull()
    .references(() => barangTable.id, { onDelete: "cascade" }),
  harga: int().notNull(),
  kuantitas: int().notNull(),
  ...timestamp,
});

export const fakturPenjualanRelations = relations(
  fakturPenjualanTable,
  ({ one, many }) => ({
    pelanggan: one(pelangganTable, {
      fields: [fakturPenjualanTable.pelangganId],
      references: [pelangganTable.id],
    }),
    produk: many(penjualanProdukTable),
    pembayaran: many(pembayaranPiutangItemTable),
  })
);

export const penjualanProdukRelations = relations(
  penjualanProdukTable,
  ({ one }) => ({
    fakturPenjualan: one(fakturPenjualanTable, {
      fields: [penjualanProdukTable.noPenjualan],
      references: [fakturPenjualanTable.noFaktur],
    }),
    barang: one(barangTable, {
      fields: [penjualanProdukTable.barangId],
      references: [barangTable.id],
    }),
  })
);

export const barangRelations = relations(barangTable, ({ many }) => ({
  barangHarga: many(barangHargaTable),
}));

export const barangHargaRelations = relations(barangHargaTable, ({ one }) => ({
  barang: one(barangTable, {
    fields: [barangHargaTable.barangId],
    references: [barangTable.id],
  }),
}));

export type Barang = typeof barangTable.$inferSelect;
export type NewBarang = typeof barangTable.$inferInsert;

export type BarangHarga = typeof barangHargaTable.$inferSelect;
export type NewBarangHarga = typeof barangHargaTable.$inferInsert;

export type Pelanggan = typeof pelangganTable.$inferSelect;
export type NewPelanggan = typeof pelangganTable.$inferInsert;

export type FakturPenjualan = typeof fakturPenjualanTable.$inferSelect;
export type NewFakturPenjualan = typeof fakturPenjualanTable.$inferInsert;

export type PenjualanProduk = typeof penjualanProdukTable.$inferSelect;
export type NewPenjualanProduk = typeof penjualanProdukTable.$inferInsert;
